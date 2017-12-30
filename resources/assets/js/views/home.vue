<template>
  <div class="layout-padding">

    <template v-if="income_value===0 && outcome_value===0">
      <q-alert v-for="type in ['warning']" :key="type" :color="type" ref="destroyableAlert"
      appear dismissible enter="bounceInLeft" leave="bounceOutRight" style="margin-bottom: 1.5rem">
        Aún no tienes movimientos creados.
      </q-alert>
    </template>

    <div class="doc-container with-bg">
      <div class="row justify-left">
        <div class="col-12 col-md-auto">
          <q-field icon="date_range" helper="Seleccione una métrica">
            <q-select float-label="Reporte de" v-model="filter" @change="onChangeHandler" :options="[
                                                          {label: 'Hoy', value: 'd'},
                                                          {label: 'Última semana', value: 'w'},
                                                          {label: 'Último mes', value: 'm'},
                                                          {label: 'Último Año', value: 'y'}
                                                        ]" />
          </q-field>
        </div>
      </div>
      <div class="row justify-left">
        <div class="col-12 col-md-auto">
          <cardTotal title="INGRESOS" background-color="secondary" icon-name="" :total="income_value" subtitle="Total entradas" />
        </div>
        <div class="col-12 col-md-auto">
          <cardTotal title="EGRESOS" background-color="amber" icon-name="" :total="outcome_value" subtitle="Total gastos" />
        </div>
      </div>

    </div>

    <dashboardChart :chart-data="datacollection" :options="lineOptions" :dataOriginal="datacollection.datasets[0].data"/>
  </div>
</template>


<script>
/* eslint-disable */

 import 'quasar-extras/animate/bounceInLeft.css'
  import 'quasar-extras/animate/bounceOutRight.css'

import cardTotal from '../components/Card.vue'
import dashboardChart from '../components/chart/Line.js'
import { QSelect, QField, Alert, QAlert, } from 'quasar-framework'
import axios from 'axios'

export default {

  data: function() {
    return {
      isProcessing: false,
      filter: 'd',
      path: 'getDashboardInfo',
      form: {},
      datacollection: {},
      YearLabels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto",
        "Septiembre", "Octubre", "Noviembre", "Diciembre"],
      WeekLabels: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"],
      lineOptions: {
        responsive: true, maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              callback: function(value, index, values) {
                return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
              }
            }
          }]
        },
        tooltips: {
          enabled: true,
          callbacks: {
            label: function(tooltipItems, data) {
              return tooltipItems.yLabel.toLocaleString("en-US", { style: "currency", currency: "USD" });
            }
          }
        }

      },
    };
  },
  name: 'Krece',
  metaInfo: {
    titleTemplate: '%s'
  },

  created() {
    this.fillOptions();
    this.fetchData();
  },
  updated() {
  },
  computed: {
    income_value() {
      try {
        if (this.filter === 'd') {
          return this.form.income.day;
        }
        else if (this.filter === 'w') {
          return this.form.income.week;
        }
        else if (this.filter === 'm') {
          return this.form.income.month;
        }
        else if (this.filter === 'y') {
          return this.form.income.year;
        }
      } catch (e) {
        return 0;
      }
    },
    outcome_value() {
      try {
        if (this.filter === 'd') {
          return this.form.outcome.day;
        }
        else if (this.filter === 'w') {
          return this.form.outcome.week;
        }
        else if (this.filter === 'm') {
          return this.form.outcome.month;
        }
        else if (this.filter === 'y') {
          return this.form.outcome.year;
        }
      } catch (e) {
        return 0;
      }
    }
  },
  methods: {
    fillOptions() {
      this.datacollection = {
        labels: [],
        datasets: [{
          label: 'Ingresos',
          fill: true,
          // lineTension: 0.1,
          backgroundColor: 'rgba(26,179,148,0.5)',
          borderColor: 'rgba(26,179,148,0.7)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#fff',
          pointBackgroundColor: 'rgba(26,179,148,1)',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [],
          spanGaps: false
        },
        {
          label: 'Gastos',
          fill: true,
          // lineTension: 0.1,
          backgroundColor: 'rgba(235, 200, 181,0.4)',
          borderColor: 'rgba(245, 127, 64,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(245, 127, 64,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(245, 127, 64,1)',
          pointHoverBorderColor: 'rgba(245, 127, 64,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [],
          spanGaps: false
        }]
      };

    },
    onChangeHandler(val) {
      let baseData = this.form.graph_data;
      let collection = this.datacollection;

      if (val == 'd') {
        collection.labels = this.WeekLabels;
        collection.datasets[0].data = baseData.weekData_income;
        collection.datasets[1].data = baseData.weekData_outcome;
      }
      else if (val == 'w') {
        collection.labels = this.WeekLabels;
        collection.datasets[0].data = baseData.weekData_income;
        collection.datasets[1].data = baseData.weekData_outcome;
      }
      else if (val == 'm') {
        collection.labels = baseData.labels_current_month;
        collection.datasets[0].data = baseData.data_by_day_current_month_in;
        collection.datasets[1].data = baseData.data_by_day_current_month_out;
      }
      else if (val == 'y') {
        collection.labels = this.YearLabels;
        collection.datasets[0].data = baseData.DataBymont_peryear_in;
        collection.datasets[1].data = baseData.DataBymont_peryear_out;
      }

    },
    fetchData() {
      let vm = this;
      vm.isProcessing = true;
      axios.get(`/api/${vm.path}`)
        .then(function(response) {
          vm.$set(vm.$data, 'form', response.data.form)
          console.log(vm.form)
          vm.datacollection.datasets[0].data = vm.form.graph_data.weekData_income;
          vm.datacollection.datasets[1].data = vm.form.graph_data.weekData_outcome;
          vm.datacollection.labels = vm.WeekLabels;
          vm.isProcessing = false;
         
        })
        .catch(function(error) {
          vm.isProcessing = false;
        })
         
    },

  },
  components: {
    cardTotal, dashboardChart, QSelect, QField, QAlert
  }
}
</script>
<style lang="stylus">

  .flex-row-docs
    h3
      padding-bottom 4px
      border-bottom 1px solid rgba(0, 0, 0, .2)
    .row > div
      padding 10px 15px
      background rgba(86,61,124,.15)
      border 1px solid rgba(86,61,124,.2)
    .row + .row
      margin-top 1rem
    .doc-container
      padding 15px
      max-height 1000px
    .minheight-rows .row
      min-height 5rem
    .with-bg .row
      background rgba(255,0,0,.1)
    @media (max-width $breakpoint-xs-max)
      .doc-container-small-padding
        .row > div
          padding 8px 3px
</style>