<template>
    <div class="layout-padding ">

        <kToolbar toolbarlabel="GESTION DE BANCOS" :redirectTo="`/${model}`" @click="openBankModal($refs, 'create')" label2="NUEVO BANCO" icon2="add_circle_outline"></kToolbar>

        <div class="row justify-left">
            <div class="col-12 col-md-auto">
                <cardTotal title="SALDO" background-color="teal-14" icon-name="" total="0" subtitle="Total Acumulado" />
                
                <q-card inline >
                    <q-chip square pointing="down" color="green" style="min-width: 300px">GESTIÓN</q-chip>
                
                    <q-card-main style="height: 50px">
                        <q-select
                            v-model="select"
                            :options="selectOptions"
                        />
                        <q-fab color="green" icon="keyboard_arrow_down" direction="down">
                            <q-fab-action color="lime"  icon="attach_money" >Agregar Dinero</q-fab-action>
                            <q-fab-action color="secondary"  icon="money_off" /> reasasa
                            <q-fab-action color="secondary"  icon="swap_horiz" />
                        </q-fab>
                    </q-card-main>
                
                    <q-card-title style="height: 50px">    
                        <span slot="right" class="row items-center">
                            <q-icon name="perm_data_setting" /> 
                        </span>
                    </q-card-title>
                </q-card>

            </div>
        </div>

        <q-data-table :data="table" :config="config" :columns="columns">
            <template slot="col-actions" slot-scope="cell">
                <kButton color="secondary" iconname="edit" tooltiplabel="Editar" @click="editBankModal($refs, cell.row)"></kButton>
                <kButton color="secondary" iconname="remove_red_eye" tooltiplabel="Ver" @click="show(cell)"></kButton>
                <kButton color="red" iconname="delete" tooltiplabel="Eliminar" @click="remove(cell)"></kButton>
            </template>
             <template slot="col-status_id" slot-scope="cell">               
                <Bank_Status :id="cell.row.status_id"></Bank_Status>
            </template>
        </q-data-table>

        <bankModal ref="_bank" @close="closeBankModal"></bankModal>

    </div>
</template>

<script>
import kButton from "../../components/tables/Button.vue";
import cardTotal from "../../components/Card.vue";

import {
  QTabs,
  QFab,
  QFabAction,
  QFixedPosition,
  QTab,
  QTabPane,
  QDataTable,
  QBtn,
  QIcon,
  QInnerLoading,
  QSpinnerMat,
  Toast,
  QList,
  QItem,
  QItemSide,
  ActionSheet,
  QItemMain,
  Ripple,
  QCard,
  QCardTitle,
  QCardMain,
  QChip,
  QSelect
} from "quasar-framework";

import axios from "axios";
import accounting from "accounting";
import bankModal from "./modals/Bank.vue";
import Bank_Status from "../../components/status/BankTransactions.vue";

import kToolbar from "../../components/Toolbar.vue";

export default {
  components: {
    QTabs,
    QFab,
    QSelect,
    QFabAction,
    QFixedPosition,
    QTab,
    QTabPane,
    QDataTable,
    QBtn,
    QIcon,
    kButton,
    bankModal,
    QInnerLoading,
    QSpinnerMat,
    Toast,
    kToolbar,
    QList,
    QItem,
    QItemSide,
    QItemMain,
    Bank_Status,
    cardTotal,
    QCard,
    QCardTitle,
    QCardMain,
    QChip
  },
  directives: {
    Ripple
  },
  methods: {
    show(cell) {
      this.$router.push(`/${this.model}/${cell.row.public_id}`);
    },
    closeBankModal() {
      this.fetchData();
    },
    editBankModal(refs, cell) {
      this.openBankModal(refs, "edit", cell.id);
    },
    openBankModal(refs, processType, bankid) {
      refs._bank.open(processType, bankid);
    },
    fetchData() {
      var vm = this;

      vm.isProcessing = true;
      vm.config.messages.noData = "Cargando...";
      console.log(this.$route);
      axios
        .get(`/api/${vm.path}/${this.$route.params.id}`)
        .then(function(response) {
          vm.$set(vm, "table", response.data);
          vm.isProcessing = false;
        })
        .catch(function(error) {
          vm.isProcessing = false;
        });

      if (vm.table.length === 0) {
        vm.config.messages.noData = "Aún no tienes registros creados";
      }
    },
    remove(val) {
      var vm = this;
      vm.isProcessing = true;
      axios
        .delete("/api/bank/" + val.row.id)
        .then(function(response) {
          if (response.data.deleted) {
            Toast.create.positive("Se eliminó el registro satisfactoriamente");
            vm.fetchData();
            vm.isProcessing = false;
          }
        })
        .catch(function(error) {
          Toast.create.negative(
            "No fue posible eliminar el registro seleccionado, intente de nuevo."
          );
          vm.isProcessing = false;
        });
    }
  },
  created() {
    this.fetchData();
    this.columns = bankColumns();
  },
  data() {
    return {
      select: '',
      selectOptions: [],
      model: "bank",
      config: {
        isProcessing: false,
        customerType: null,
        refresh: false,
        noHeader: false,
        columnPicker: false,
        leftStickyColumns: 0,
        rightStickyColumns: 0,
        bodyStyle: {
          maxHeight: "500px"
        },
        rowHeight: "45px",
        responsive: true,
        labels: {
          columns: "Columnas",
          allCols: "Todas",
          rows: "Mostrar ",
          selected: {
            singular: "item seleccionado.",
            plural: "items seleccionados."
          },
          clear: "Limpiar",
          search: "Buscar",
          all: "Todo"
        },
        pagination: {
          rowsPerPage: 10,
          options: [5, 10, 15, 30, 50, 500]
        },
        messages: {
          noData: "No hay datos disponibles...",
          noDataAfterFiltering:
            "No se encontraron coincidencias con la busqueda. Porfavor revise los valores ingresados."
        }
      },
      table: [],
      columns: {},
      pagination: true,
      rowHeight: 50,
      bodyHeightProp: "maxHeight",
      bodyHeight: 500,
      path: "getbank_transaction_history"
    };
  },
  watch: {
    pagination(value) {
      if (!value) {
        this.oldPagination = clone(this.config.pagination);
        this.config.pagination = false;
        return;
      }
      this.config.pagination = this.oldPagination;
    },
    rowHeight(value) {
      this.config.rowHeight = value + "px";
    },
    bodyHeight(value) {
      let style = {};
      if (this.bodyHeightProp !== "auto") {
        style[this.bodyHeightProp] = value + "px";
      }
      this.config.bodyStyle = style;
    },
    bodyHeightProp(value) {
      let style = {};
      if (value !== "auto") {
        style[value] = this.bodyHeight + "px";
      }
      this.config.bodyStyle = style;
    }
  }
};

function bankColumns() {
  return [
    {
      label: "Fecha",
      field: "date",
      width: "70px",
      sort: true,
      type: "string"
    },
    {
      label: "Beneficiario",
      field: "contact_name",
      width: "70px",
      sort: true,
      filter: true
    },
    {
      label: "Categoría",
      field: "detail",
      width: "90px",
      filter: true,
      sort: true
    },
    {
      label: "Estado",
      field: "status_id",
      width: "50px",
      filter: true,
      sort: true
    },
    {
      label: "Salida",
      field: "total_outcome",
      format(value) {
        return accounting.formatMoney(value);
      },
      type: "string",
      width: "70px"
    },
    {
      label: "Entrada",
      field: "total_income",
      format(value) {
        return accounting.formatMoney(value);
      },
      type: "string",
      width: "70px"
    },
    {
      label: "Acciones",
      field: "actions",
      type: "string",
      width: "60px"
    }
  ];
}
</script>

<style lang="stylus">
</style>