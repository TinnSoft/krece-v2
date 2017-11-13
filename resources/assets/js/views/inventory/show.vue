<template>
    <div class="layout-padding docs-tab ">
       <kToolbar :toolbarlabel="form.name" :showsaveButton="false" :redirectTo="`${redirect}`" 
        ></kToolbar>  

          <q-tabs color="grey-2" align="justify" inverted>
            <q-tab default color="grey-6" name="info" slot="title" icon="local_mall" label="Acerca de" />
            <q-tab color="grey-6" name="report" slot="title" icon="pie_chart" label="Movimientos" />
            <q-tab-pane name="info">
                <q-list>
                    <q-collapsible icon="local_grocery_store" label="<strong>General</strong>" sublabel="información básica del ítem" opened>
                        <div>
                            <q-item>
                                <q-item-side icon="assignment" color="light" />
                                <q-item-main>
                                    <q-item-tile label>{{form.description}}</q-item-tile>
                                    <q-item-tile sublabel>Descripción</q-item-tile>
                                </q-item-main>
                            </q-item>
                            <q-item>
                                <q-item-main inset>
                                    <q-item-tile label>{{form.reference}}</q-item-tile>
                                    <q-item-tile sublabel>Referencia</q-item-tile>
                                </q-item-main>
                            </q-item>
                            <q-item>
                                <q-item-side icon="attach_money" color="light" />
                                <q-item-main inset>
                                    <q-item-tile label>{{form.sale_price}}</q-item-tile>
                                    <q-item-tile sublabel>Precio de venta</q-item-tile>
                                </q-item-main>
                            </q-item>
                            <q-item>
                                <q-item-side icon="attach_money" color="light" />
                                <q-item-main inset>
                                    <q-item-tile label>{{form.inv_unit_cost}}</q-item-tile>
                                    <q-item-tile sublabel>Precio de Compra</q-item-tile>
                                </q-item-main>
                            </q-item>
                              <q-item>
                                <q-item-side icon="play_for_work" color="light" />
                                <q-item-main inset>
                                    <q-item-tile label>{{getNameValue(form.category)}}</q-item-tile>
                                    <q-item-tile sublabel>Categoría</q-item-tile>
                                </q-item-main>
                            </q-item>
                             <q-item>
                                <q-item-side icon="view_list" color="light" />
                                <q-item-main inset>
                                    <q-item-tile label>{{getNameValue(form.list_price)}}</q-item-tile>
                                    <q-item-tile sublabel>Lista de Precios</q-item-tile>
                                </q-item-main>
                            </q-item>
                        </div>
                    </q-collapsible>                   
                    <q-collapsible icon="more_horiz" label="<strong>Otros</strong>" sublabel="información adicional del ítem">
                        <div>
                            <q-item>
                                <q-item-side icon="assignment" color="light" />
                                <q-item-main>
                                    <q-item-tile label>{{measureUnit}}</q-item-tile>
                                    <q-item-tile sublabel>Unidad de Medida</q-item-tile>
                                </q-item-main>
                            </q-item>
                            <q-item>
                                <q-item-side icon="equalizer" color="light" />
                                <q-item-main inset>
                                    <q-item-tile label>{{form.inv_quantity_initial}}</q-item-tile>
                                    <q-item-tile sublabel>Inventario Inicial (Cantidad)</q-item-tile>
                                </q-item-main>
                            </q-item>
                             <q-item>
                                <q-item-side icon="equalizer" color="light" />
                                <q-item-main inset>
                                    <q-item-tile label>{{form.inv_quantity_actual}}</q-item-tile>
                                    <q-item-tile sublabel>Inventario Actual (Cantidad)</q-item-tile>
                                </q-item-main>
                            </q-item>
                            <q-item>
                                <q-item-side icon="attach_money" color="light" />
                                <q-item-main inset>
                                    <q-item-tile label>{{getNameValue(form.tax)}}</q-item-tile>
                                    <q-item-tile sublabel>Impuesto</q-item-tile>
                                </q-item-main>
                            </q-item>
                        </div>
                    </q-collapsible>
                </q-list>
            </q-tab-pane>
            <q-tab-pane name="report">
                <q-select color="secondary" float-label="Seleccione un reporte" v-model="transaction_type" :options="listOptions" @change="handleChange" />
           
               <template v-if="transaction_type=='bill'">
                <billReport  :path="path" :kmodule="transaction_type"></billReport>
               </template>
                 <template v-if="transaction_type=='credit_note'">
                <creditNoteReport  :path="path" :kmodule="transaction_type"></creditNoteReport>
               </template>
                 <template v-if="transaction_type=='debit_note'">
                <debitNoteReport  :path="path" :kmodule="transaction_type"></debitNoteReport>
               </template>
                <template v-if="transaction_type=='estimate'">
                <estimateReport  :path="path" :kmodule="transaction_type"></estimateReport>
               </template>
                 <template v-if="transaction_type=='invoice'">
                <invoiceReport  :path="path" :kmodule="transaction_type"></invoiceReport>
               </template>
                   <template v-if="transaction_type=='po'">
                <poReport  :path="path" :kmodule="transaction_type"></poReport>
               </template>
                 <template v-if="transaction_type=='remision'">
                <remisionReport  :path="path" :kmodule="transaction_type"></remisionReport>
               </template>
            </q-tab-pane>
        </q-tabs>

    </div>
</template>

<script>
import {
  QList,
  QListHeader,
  QItem,
  QItemSeparator,
  QItemSide,
  QItemMain,
  QItemTile,
  QCollapsible,
  QRadio,
  QTab,
  QTabs,
  QTabPane,
  QSelect
} from "quasar-framework";

import axios from "axios";
import billReport from "./reports/bill.vue";
import creditNoteReport from "./reports/credit_note.vue";
import debitNoteReport from "./reports/debit_note.vue";
import estimateReport from "./reports/estimate.vue";
import invoiceReport from "./reports/invoice.vue";
import poReport from "./reports/purchase_order.vue";
import remisionReport from "./reports/remision.vue";
import kToolbar from "../../components/Toolbar.vue";

export default {
  components: {
    QList,
    QSelect,
    QListHeader,
    QItem,
    QItemSeparator,
    QItemSide,
    QItemMain,
    QItemTile,
    QCollapsible,
    QRadio,
    QTab,
    QTabs,
    QTabPane,
    billReport,
    creditNoteReport,
    debitNoteReport,
    estimateReport,
    invoiceReport,
    poReport,
    kToolbar,
    remisionReport
  },
  data() {
    return {
      redirect: "/inventory",
      listOptions: [
        {
          label: "Facturas de venta",
          icon: "show_chart",
          value: "invoice"
        },
        {
          label: "Notas de crédito",
          icon: "show_chart",
          value: "credit_note"
        },
        {
          label: "Cotizaciones",
          icon: "show_chart",
          value: "estimate"
        },
        {
          label: "Facturas de compra",
          icon: "attach_money",
          value: "bill"
        },
        {
          label: "Notas débito",
          icon: "attach_money",
          value: "debit_note"
        },
        {
          label: "Remisiones",
          icon: "attach_money",
          value: "remision"
        },
        {
          label: "Ordenes de Compra",
          icon: "attach_money",
          value: "po"
        }
      ],
      form: {},
      isProcessing: false,
      transaction_type: "invoice",
      pathFetchData: `inventory/${this.$route.params.id}`,
      modulename: "inventory",
      warningmessage: "Estas a punto de eliminar el producto: "
    };
  },
  created() {
    this.fetchData();
  },
  computed: {
    measureUnit() {
      try {
        if (this.form.measure_unit) {
          return this.form.measure_unit.measure_unit;
        }
      } catch ($e) {
        return null;
      }
    },
    path() {
      return `getInventoryReports/${this.transaction_type}/${this.$route.params
        .id}`;
    }
  },
  methods: {
    getNameValue(val) {
      try {
        return val.name;
      } catch ($e) {
        return null;
      }
    },
    handleChange(val) {
      this.transaction_type = val;
    },
    fetchData() {
      var vm = this;
      vm.isProcessing = true;
      axios
        .get(`/api/${vm.pathFetchData}`)
        .then(function(response) {
          // console.log(response.data.model)
          vm.$set(vm, "form", response.data.model);
          vm.isProcessing = false;
        })
        .catch(function(error) {
          vm.isProcessing = false;
        });
    }
  }
};
</script>