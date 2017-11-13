<template>
    <div class="layout-padding docs-tab">

         <kToolbar toolbarlabel="GESTION DE INVENTARIO" :showbackButton="false" :showsaveButton="false" 
        icon2="add_circle_outline"></kToolbar>     

                <q-data-table :data="table" :config="config" :columns="columns" color="secondary">
                
                    <template slot="col-actions" slot-scope="cell">
                        <kButton color="secondary" iconname="edit" tooltiplabel="Editar" @click="editProductModal($refs, cell.row)"></kButton>
                        <kButton color="secondary" iconname="remove_red_eye" tooltiplabel="Ver" @click="show(cell)"></kButton>
                        <kButton color="red" iconname="delete" tooltiplabel="Eliminar" @click="remove(cell)"></kButton>
                    </template>
                </q-data-table>

      
                <q-fixed-position corner="top-right" :offset="[28, 28]">
                     <q-tooltip >
                        <div>Agregar <strong>nuevo producto o servicio</strong></div>
                    </q-tooltip>
                    <q-btn round color="yellow-10" icon="add_to_queue" class="animate-pop"  @click="openProductModal($refs,'create')"/>
                </q-fixed-position>
        <productModal ref="_contact" @close="closeProductModal"></productModal>
    </div>
</template>

<script>
import kButton from "../../components/tables/Button.vue";

import {
  QDataTable,
  QBtn,
  QTooltip,
  QIcon,
  QInnerLoading,
  QSpinnerMat,
  Toast,
  QFixedPosition
} from "quasar-framework";

import axios from "axios";
import kToolbar from "../../components/Toolbar.vue";
import productModal from "./modals/Product.vue";
import accounting from "accounting";

export default {
  components: {
    QDataTable,
    QFixedPosition,
    QTooltip,
    QBtn,
    QIcon,
    kButton,
    productModal,
    QInnerLoading,
    QSpinnerMat,
    Toast,
    kToolbar
  },
  methods: {
    show(cell) {
      this.$router.push(`/${this.model}/${cell.row.public_id}`);
    },
    //Evento disparado al cerrar el modal de producto
    closeProductModal() {
      this.fetchData();
    },
    editProductModal(refs, cell) {
      this.openProductModal(
        refs,
        "edit",
        cell.id
      );
    },
    openProductModal(refs,  processType,itemId) {
      refs._contact.open( processType, itemId);
    },
    setProductColumn(filter) {
      this.fetchData();
      this.columns = productColumns();
    },
    fetchData() {
      var vm = this;

      vm.isProcessing = true;
      vm.config.messages.noData = "Cargando...";
      axios
        .get(`/api/${vm.path}`)
        .then(function(response) {
         // console.log(response.data);
          vm.$set(vm, "table", response.data.records);
          vm.isProcessing = false;
        })
        .catch(function(error) {
          vm.isProcessing = false;
        });

      if (vm.table.length === 0) {
        vm.config.messages.noData =
          "Aún no tienes productos o servicios creados";
      }
    },
    remove(val, filter) {
      var vm = this;
      vm.isProcessing = true;
      axios
        .delete("/api/inventory/" + val.row.id)
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
    this.columns = productColumns();
  },
  data() {
    return {
      model: "inventory",
      isProcessing: false,
      config: {
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
        messages: {
          noData: "No hay datos disponibles...",
          noDataAfterFiltering:
            "No se encontraron coincidencias con la busqueda. Porfavor revise los valores ingresados."
        }
      },
      table: [],
      columns: [],
      pagination: {
        rowsPerPage: 10,
        options: [10, 15, 30, 50, 500]
      },
      rowHeight: 50,
      bodyHeightProp: "maxHeight",
      bodyHeight: 500,
      path: "getInventorylist"
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

function productColumns() {
  return [
    {
      label: "Nombre",
      field: "name",
      width: "100px",
      sort: true,
      filter: true,
      type: "string"      
    },
    {
      label: "Referencia",
      field: "reference",
      sort: true,
      filter: true,
      width: "70px"
    },
    {
      label: "Precio",
      field: "sale_price",
      width: "70px",
      sort: true,
      filter: true,
      format(value) {
        return accounting.formatMoney(value);
      }
    },
    {
      label: "Descripción",
      field: "description",
      sort: true,
      filter: true,
      type: "string",
      width: "80px"
    },
    {
      label: "Acciones",
      field: "actions",
      type: "string",
      width: "70px"
    }
  ];
}
</script>

<style lang="stylus">
.docs-tab .q-tabs {
    margin-bottom: 15px;
}
</style>