<template>
  <div class="layout-padding justify-center docs-tab">
    <div style="width: 500px; max-width: 90vw;">

      <q-modal ref="productModal" minimized :content-css="{padding: '20px'}" @close="handleClose">
 
        <q-toolbar color="green">
         
          <q-toolbar-title>
            <div class="desktop-only">
              {{toolbarLabel}}
            </div>
            <div class="mobile-only">
              <small>{{toolbarLabel}}</small>
            </div>
          </q-toolbar-title>

          <q-btn flat @click="$refs.productModal.close()">
            <q-icon name="exit_to_app" />
            
             <q-tooltip>                       
                        Cancelar
                      </q-tooltip>

            </q-btn>

          <!--Botones de guardar, dependiendo el tipo de dispositivo se muestra el correspondiente diseño-->
          <q-btn class="desktop-only" flat @click="submit">
            <q-icon name="save" />
            <q-tooltip>                       
                        Guardar
                      </q-tooltip>
          </q-btn>
          <q-fixed-position class="mobile-only" corner="bottom-right" :offset="[18, 18]">
            <q-btn round color="green-14" icon="save" class="animate-pop" @click="submit" />
          </q-fixed-position>

        </q-toolbar>

<div class="doc-container">
              <div class="row" >
                <div class="col-sm-5">
                  <q-list style="border: 0;padding: 0">

                    <q-field :error="checkIfFieldHasError(errors,'name')" error-label="Este campo es obligatorio">
                            <q-input clearable class="no-margin no-padding" :color="themeColor" v-model="form.name" float-label="*Nombre" />
                        </q-field>

                    
                    <q-input clearable class="no-margin no-padding"  :color="themeColor" v-model="form.reference" float-label="Referencia" />
                    <q-input clearable class="no-margin no-padding"  :color="themeColor" v-model="form.description" float-label="Descripción" />
                     <q-field :error="checkIfFieldHasError(errors,'sale_price')" error-label="Este campo es obligatorio">
                        <q-input clearable type="number"  prefix="$"  class="no-margin no-padding"  :color="themeColor" v-model="form.sale_price" float-label="*Precio de venta" />
                     </q-field>
                    <q-select filter autofocus-filter filter-placeholder="Buscar" clearable class="no-margin no-padding" :options="base.listPrice"  :color="themeColor" v-model="form.list_price_id" float-label="Lista de Precios" />                    
                  </q-list>
                </div>
                <div class="col-sm-2">
                </div>
                <div class="col-sm-5">
                  <q-list style="border: 0;padding: 0">
                    <q-field :error="checkIfFieldHasError(errors,'tax_id')" error-label="Este campo es obligatorio">
                     <q-select filter autofocus-filter filter-placeholder="Buscar" clearable class="no-margin no-padding" :options="base.taxes"  :color="themeColor" v-model="form.tax_id" float-label="*Impuesto" />                    
                    </q-field>
                    <br>
                    <q-checkbox  :color="themeColor" v-model="form.inv_inStock" label="Ítem inventariable?">
                      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                        <q-icon name="help_outline" />
                        <strong>Marque esta opción</strong><div>si desea que la herramienta lleve el inventario de manera automática para este ítem</div>
                      </q-tooltip>
                    </q-checkbox>
                    
                     <template v-if="form.inv_inStock===true">
                       <q-field
                          icon="playlist_add"
                          label="DETALLE"
                          error-label="Estos campos son obligatorios"
                        >
                        <q-field :error="checkIfFieldHasError(errors,'inv_type_id')" error-label="Este campo es obligatorio">
                          <q-select filter autofocus-filter filter-placeholder="Buscar" clearable class="no-margin no-padding" :options="base.measureUnit"  :color="themeColor" v-model="form.inv_type_id" float-label="*Unidad de Medida" />    
                        </q-field>
                          <q-field :error="checkIfFieldHasError(errors,'inv_quantity_initial')" error-label="Este campo es obligatorio">
                          <q-input clearable type="number" class="no-margin no-padding"  :color="themeColor" v-model="form.inv_quantity_initial" float-label="*Cantidad Inicial" />    
                          </q-field>
                          <q-field :error="checkIfFieldHasError(errors,'inv_unit_cost')" error-label="Este campo es obligatorio">
                          <q-input clearable type="number" prefix="$" class="no-margin no-padding"  :color="themeColor" v-model="form.inv_unit_cost" float-label="*Precio de Compra" /> 
                          </q-field>
                    </q-field>

                      
                     </template>
                  </q-list>
                </div>
              </div>
              <br>
        
             
            <blockquote>
            <small>
              No te olvides de seleccionar la categoría a la cual pertenece el ítem             
              que estás creando.
              Esto ayudará a que la herramienta te genere los reportes de una manera más precisa.
            </small>
          </blockquote>
          <q-field :error="checkIfFieldHasError(errors,'category_id')" error-label="Seleccione una categoría">
               <treetable :route="pathCatehory" @click="handleClick" :selectedIDRow="form.category_id"/>    
          </q-field>
            </div>

           <q-inner-loading :visible="isProcessing">
            <q-spinner-mat size="50px" color="teal-4" />{{spinnerText}}
          </q-inner-loading>
    
      </q-modal>

    </div>
  </div>
</template>

<script>
import {
  QModal,
  Toast,
  QSelect,
  QCheckbox,
  QTooltip,
  QBtn,
  QIcon,
  QList,
  QInput,
  QToolbar,
  QToolbarTitle,
  QField,
  QFixedPosition,
  QAlert,
  QInnerLoading,
  QSpinnerMat
} from "quasar-framework";

import treetable from "../../../components/treeTable/TreeTable.vue";
import axios from "axios";

export default {
  data() {
    return {
      spinnerText: "Cargando...",
      errors: null,
      themeColor: "secondary",
      editIdAssociate: null,
      isEditActive: false,
      isProcessing: false,
      kindOfProcess: "create",
      error: false,
      toolbarLabel: "NUEVO ÍTEM",
      model: "inventory",
      form: { inv_inStock: false },
      base: {
        measureUnit: [
          {
            label: "",
            value: ""
          }
        ],
        taxes: [
          {
            label: "",
            value: ""
          }
        ],
        listPrice: [
          {
            label: "",
            value: ""
          }
        ]
      },
      config: {
        refresh: false,
        noHeader: false,
        columnPicker: false,
        leftStickyColumns: 0,
        rightStickyColumns: 0,
        bodyStyle: {
          maxHeight: "300px"
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
      columns: [
        {
          label: "Nombre",
          field: "name",
          width: "50px",
          sort: true,
          type: "string"
        },
        {
          label: "Apellido",
          field: "last_name",
          width: "40px",
          sort: true,
          type: "string"
        },
        {
          label: "email",
          field: "email",
          width: "60px",
          sort: true,
          type: "string"
        },
        {
          label: "Telefono",
          field: "phone",
          width: "40px",
          sort: true,
          type: "string"
        },
        {
          label: "Celular",
          field: "phone_mobile",
          width: "40px",
          sort: true,
          type: "string"
        },
        {
          label: "Notificar?",
          field: "notify",
          width: "40px",
          sort: true,
          type: "string"
        },
        {
          label: "Acciones",
          field: "actions",
          width: "40px",
          sort: true,
          type: "string"
        }
      ],
      pagination: true,
      rowHeight: 50,
      bodyHeightProp: "maxHeight",
      bodyHeight: 300,
      pathFetchData: "/api/inventory/create",
      pathCatehory: "getCategoryIncome"
    };
  },
  components: {
    QModal,
    Toast,
    QSelect,
    QCheckbox,
    QTooltip,
    QBtn,
    QIcon,
    QList,
    QInput,
    QToolbar,
    QToolbarTitle,
    QField,
    QFixedPosition,
    QAlert,
    QInnerLoading,
    QSpinnerMat,
    treetable
  },
  methods: {
    handleClick(row) {
      this.form.category_id = row.id;
    },
    handleClose(newVal) {
      this.$emit("close", newVal);
    },
    checkIfFieldHasError(error, field) {
      try {
        if (error.errors[field]) {
          return true;
        }
      } catch (err) {}

      return false;
    },
    fetchData() {
      var vm = this;
      vm.spinnerText = "Cargando...";
      vm.isProcessing = true;
      axios
        .get(vm.pathFetchData)
        .then(function(response) {
         // console.log(response.data.form);
          vm.$set(vm.$data, "form", response.data.form);
          vm.$set(vm.$data.base, "taxes", response.data.base.taxes);
          vm.$set(vm.$data.base, "listPrice", response.data.base.listprice);
          vm.$set(
            vm.$data.base,
            "measureUnit",
            response.data.base.measure_unit
          );
          vm.isProcessing = false;
        })
        .catch(function(error) {
          vm.isProcessing = false;
          //console.log(error.response);
        });
    },

    //kindOfProcess= create/edit
    //customerId= (opcional) id del producto cuando se edita
    open(kindOfProcess, customerId) {
      let vm=this;
      vm.isEditActive = false;
      vm.kindOfProcess = kindOfProcess;
      vm.category_id=null;
     
      if (kindOfProcess === "edit") {
        vm.pathFetchData = `/api/${vm.model}/${customerId}/${kindOfProcess}`;
        vm.toolbarLabel = "EDITAR ÍTEM";
      } else {
        vm.pathFetchData = `/api/${vm.model}/${kindOfProcess}`;
        vm.toolbarLabel = "NUEVO ÍTEM";
      }

      vm.fetchData();

      vm.$refs["productModal"].open();
    },

    submit() {
      if (this.kindOfProcess === "edit") {
        this.spinnerText = "Actualizando...";
        this.update();
      } else {
        this.spinnerText = "Guardando...";
        this.create();
      }
    },
    create() {
      var vm = this;
      vm.$set(vm.$data, "errors", null);
      vm.isProcessing = true;
      axios
        .post(`/api/${vm.model}`, vm.form)
        .then(function(response) {
          //console.log("creadooo");
          if (response.data.created) {
            Toast.create.positive("El registro se creó satisfactoriamente");
          }
          vm.isProcessing = false;
          vm.$refs["productModal"].close();
        })
        .catch(function(error) {
          // console.log("error", error.response.data);
          vm.$set(vm.$data, "errors", error.response.data);
          vm.isProcessing = false;
          Toast.create.negative(
            "Ooops! No fue posible guardar el registro actual, intente de nuevo."
          );
        });
    },

    update() {
      var vm = this;
      vm.errors = null;
      vm.isProcessing = true;
     
      axios
        .put(`/api/${vm.model}/${vm.form.id}`, vm.form)
        .then(function(response) {
          if (response.data.updated) {
            Toast.create.positive(
              "Se actualizó el registro satisfactoriamente"
            );
          }
          vm.isProcessing = false;
        })
        .catch(function(error) {
          vm.errors = error.response.data;
          vm.isProcessing = false;
          Toast.create.negative(
            "No fue posible actualizar el registro actual, intente de nuevo."
          );
        });
    }
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
</script>
<style>
.inputfile + label {
  font-size: 1.25em;
  font-weight: 700;
  color: white;
  background-color: black;
  display: inline-block;
}

.inputfile:focus + label,
.inputfile + label:hover {
  background-color: red;
}

::-webkit-input-placeholder {
  /* Chrome/Opera/Safari */
  font-size: 80%;
}

::-moz-placeholder {
  /* Firefox 19+ */
  font-size: 80%;
}

:-ms-input-placeholder {
  /* IE 10+ */
  font-size: 80%;
}

:-moz-placeholder {
  /* Firefox 18- */
  font-size: 80%;
}

.flex-row-docs h3 {
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

.flex-row-docs .row > div {
  padding: 10px 15px;
  background: rgba(86, 61, 124, 0.15);
  border: 1px solid rgba(86, 61, 124, 0.2);
}

.flex-row-docs .row + .row {
  margin-top: 1rem;
}

.flex-row-docs .doc-container {
  padding: 15px;
  max-height: 1000px;
}

.flex-row-docs .minheight-rows .row {
  min-height: 5rem;
}

.flex-row-docs .with-bg .row {
  background: rgba(255, 0, 0, 0.1);
}

.docs-tab .q-tabs {
  margin-bottom: 15px;
}
</style>