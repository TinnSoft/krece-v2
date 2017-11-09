<template>
  <div class="layout-padding justify-center docs-tab">


      <q-modal ref="sellerModal" minimized :content-css="{padding: '10px'}" @close="handleClose">
        <q-toolbar color="teal-14">
          <q-toolbar-title>
            {{toolbarLabel}}
          </q-toolbar-title>

          <q-btn flat @click="$refs.sellerModal.close()">
            <q-icon name="exit_to_app" /></q-btn>
          <q-btn flat @click="_submit">
            <q-icon name="save" /></q-btn>
        </q-toolbar>

        <div class="doc-container">
       
            <q-list style="border: 0;padding: 0">
              <q-input clearable class="no-margin no-padding" color="secondary" v-model="form.name" float-label="*Nombre" />
              <q-input clearable class="no-margin no-padding" color="secondary" v-model="form.dni" float-label="# Identificación" />
              <q-input clearable class="no-margin no-padding" color="secondary" v-model="form.work_phone" float-label="Teléfono Trabajo" />
              <q-input clearable class="no-margin no-padding" color="secondary" v-model="form.private_phone" float-label="Teléfono Privado" />
              <q-input clearable class="no-margin no-padding" color="secondary" type="textarea" v-model="form.observations" float-label="Observaciones" />
            </q-list>
       
        </div>
      </q-modal>
 
  </div>
</template>

<script>
import {
  QModal, QSpinner, Toast,
  QSpinnerGears, QItemTile, QBtn, QIcon, QList, QInput, QToolbar, QToolbarTitle
} from 'quasar-framework'

import axios from 'axios'

export default {
  data() {
    return {
      toolbarLabel: '',
      pathFetchData: '/api/seller/create',
      error: false,
      model: 'seller',
      checked: false,
      additionalfields: [],
      form: {},
      base: {
        products: [{
          label: '',
          value: ''
        }]
      },
    }
  },
  components: {
    QModal, QSpinner, Toast,
    QSpinnerGears, QItemTile, QBtn, QIcon, QList, QInput, QToolbar, QToolbarTitle
  },

  methods: {
    handleClose(newVal) {
      this.$emit('close', newVal)
    },
    fetchData() {
      var vm = this;
      axios.get(vm.pathFetchData)
        .then(function(response) {
          vm.$set(vm.$data, 'form', response.data.form);
        })
        .catch(function(error) {
        })

    },
    open(kindOfProcess, sellerId) {
      this.kindOfProcess = kindOfProcess;
      if (kindOfProcess === 'edit') {
        this.pathFetchData = `/api/seller/${sellerId}/edit`
        this.toolbarLabel = 'EDITAR VENDEDOR';
      }
      else {
        this.pathFetchData = '/api/seller/create'
        this.toolbarLabel = 'NUEVO VENDEDOR';
      }
      this.fetchData();

      this.$refs['sellerModal'].open();
    },

    _submit() {
      if (this.kindOfProcess === 'edit') {
        this.update();
      }
      else {
        this.create();
      }
    },
    create() {
      var vm = this;
      vm.isProcessing = true;
      axios.post(`/api/${vm.model}`, vm.form)
        .then(function(response) {
          if (response.data.created) {
            Toast.create.positive('Se guardó el registro satisfactoriamente')
          }
          vm.isProcessing = false;
        })
        .catch(function(error) {
          vm.isProcessing = false;
          Toast.create.negative('Ooops! No fue posible guardar el registro actual, intente de nuevo.')
        });
    },

    update() {
      var vm = this;
      vm.isProcessing = true;
      axios.put('/api/seller/' + vm.form.id, vm.form)
        .then(function(response) {
          if (response.data.updated) {
            Toast.create.positive('Se actualizó el registro satisfactoriamente')
          }
          vm.isProcessing = false;

        })
        .catch(function(error) {
          vm.isProcessing = false;
          Toast.create.negative('No fue posible actualizar el registro actual, intente de nuevo.')
        })
    },


  }
}
</script>
<style>
.inputfile+label {
  font-size: 1.25em;
  font-weight: 700;
  color: white;
  background-color: black;
  display: inline-block;
}

.inputfile:focus+label,
.inputfile+label:hover {
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

.flex-row-docs .row>div {
  padding: 10px 15px;
  background: rgba(86, 61, 124, 0.15);
  border: 1px solid rgba(86, 61, 124, 0.2);
}

.flex-row-docs .row+.row {
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
  margin-bottom: 15px
}
</style>