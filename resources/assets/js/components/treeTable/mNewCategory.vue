<template>
  <div class="layout-padding justify-center docs-tab">  
    <div style="width: 500px; max-width: 90vw;">
      
      <q-modal ref="categoryModal" minimized :content-css="{padding: '20px'}" @close="handleClose">
     
        <q-toolbar color="green" >  
          <q-toolbar-title >  
            <div class="desktop-only">  
              {{toolbarLabel}}  
            </div>
  
            <div class="mobile-only">  
              <small>{{toolbarLabel}}</small>  
            </div>  
          </q-toolbar-title>   
  
          <q-btn flat @click="$refs.categoryModal.close()">  
            <q-icon name="exit_to_app" />  
            <q-tooltip>  
              Cancelar  
            </q-tooltip>  
          </q-btn>
  
          <q-btn flat @click="submit">  
            <q-icon name="save" />  
            <q-tooltip>  
              Guardar  
            </q-tooltip>  
          </q-btn>
  
        </q-toolbar>
  
        <div>  
        <br>
          <q-field class="no-margin no-padding" :error="checkIfFieldHasError(errors, 'name')" error-label="Este campo es obligatorio">  
            <q-input color="green" clearable v-model="form.name" float-label="*Nombre" />  
          </q-field>
  
          <q-input color="green" type="textarea" clearable v-model="form.description" float-label="Descripción" />  
          <q-input color="green" clearable v-model="form.niif_account" float-label="Cuenta NIIF" />  
          <br>
  
        </div>
  
        <div>  
          <blockquote class="green">  
            <small>  
               <div>Las categorías te permiten clasificar </div>  
               <div>toda la información y movimientos de tu empresa</div>  
               <div>de manera inteligente.</div>  
              </small>  
          </blockquote>  
        </div>
  
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
  QInput,
  QToolbar,
  QToolbarTitle,
  QField,
  QDataTable,
  QOptionGroup
} from "quasar-framework";

import axios from "axios";

import kButton from "../../components/tables/Button.vue";

export default {
  data() {
    return {
      treeParentID: null,
      isProcessing: false,
      kindOfProcess: "create",
      error: false,
      toolbarLabel: "NUEVA CATEGORÍA",
      model: "category",
      form: {
        auto_increment: true,
        isDefault: 0
      },
      errors: "",
      pathFetchData: "/api/category/create"
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
    QInput,
    QToolbar,
    QToolbarTitle,
    kButton,
    QField,
    QDataTable,
    QOptionGroup
  },

  computed: {},

  methods: {
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
      axios
        .get(vm.pathFetchData)
        .then(function(response) {
          vm.$set(vm.$data, "form", response.data.form);
        })
        .catch(function(error) {});
    },

    //kindOfProcess= create/edit
    //id= (opcional) id del registro cuando se edita

    open(kindOfProcess, id) {
      this.$set(this.$data, "errors", []);
      this.kindOfProcess = kindOfProcess;

      if (kindOfProcess === "edit") {
        this.pathFetchData = `/api/category/${id}/edit`;
        this.toolbarLabel = "EDITAR CATEGORÍA";
      } else {
        this.pathFetchData = "/api/category/create";
        this.toolbarLabel = "NUEVA CATEGORÍA";
      }
      this.fetchData();
      this.treeParentID = id;
      this.$refs["categoryModal"].open();
    },

    submit() {
      if (this.kindOfProcess === "edit") {
        this.update();
      } else {
        this.create();
      }
    },

    create() {
      var vm = this;

      vm.isProcessing = true;
      vm.form.parent_id = vm.treeParentID;
      axios
        .post(`/api/${vm.model}`, vm.form)
        .then(function(response) {
          if (response.data.created) {
            Toast.create.positive("Se guardó el registro satisfactoriamente");
            vm.$refs["categoryModal"].close();
          }

          vm.isProcessing = false;
        })
        .catch(function(error) {
          vm.isProcessing = false;
          vm.$set(vm.$data, "errors", error.response.data);

          Toast.create.negative(
            "Ooops! No fue posible guardar el registro actual, intente de nuevo."
          );
        });
    },

    update() {
      var vm = this;

      vm.isProcessing = true;

      axios
        .put("/api/category/" + vm.form.id, vm.form)
        .then(function(response) {
          if (response.data.updated) {
            Toast.create.positive(
              "Se actualizó el registro satisfactoriamente"
            );

            vm.$refs["categoryModal"].close();
          }

          vm.isProcessing = false;
        })
        .catch(function(error) {
          vm.isProcessing = false;

          vm.$set(vm.$data, "errors", error.response.data);

          Toast.create.negative(
            "No fue posible actualizar el registro actual, intente de nuevo."
          );
        });
    }
  }
};
</script>
