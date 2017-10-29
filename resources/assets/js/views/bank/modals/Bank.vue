<template>
  <div class="layout-padding justify-center docs-tab">
    <div style="width: 400px; max-width: 90vw;">

      <q-modal ref="bankModal" minimized :content-css="{padding: '10px'}" @close="handleClose">
        <q-toolbar color="teal-14">
          <q-toolbar-title>
            {{toolbarLabel}}
          </q-toolbar-title>

          <q-btn flat @click="$refs.bankModal.close()">
            <q-icon name="exit_to_app" /></q-btn>
          <q-btn flat @click="_submit">
            <q-icon name="save" /></q-btn>
        </q-toolbar>

        <div class="doc-container">

          <q-list style="border: 0;padding: 0">
            <q-field :error="checkIfFieldHasError(errors, 'bank_account_type_id')" error-label="Este campo es obligatorio">
              <q-select color="secondary" autofocus-filter filter filter-placeholder="Buscar" float-label="*Tipo de cuenta" v-model="form.bank_account_type_id" :options="base.banks" />
            </q-field>
            <q-field :error="checkIfFieldHasError(errors, 'bank_account_name')" error-label="Este campo es obligatorio">
              <q-input class="no-margin no-padding" color="secondary" v-model="form.bank_account_name" float-label="*Nombre de la cuenta" />
            </q-field>
            <q-input class="no-margin no-padding" color="secondary" v-model="form.bank_account_number" float-label="Número de cuenta" />
            <q-field :error="checkIfFieldHasError(errors, 'initial_balance')" error-label="Este campo es obligatorio">
              <q-input class="no-margin no-padding" color="secondary"  type="number" v-model="form.initial_balance" float-label="*Saldo Inicial ($)" />
            </q-field>
            <q-input class="no-margin no-padding" color="secondary" type="textarea" v-model="form.description" float-label="Descripción" />
          </q-list>

        </div>
      </q-modal>
    </div>
  </div>
</template>

<script>
import {
  QModal, QSpinner, Toast, QSelect, QField,
  QSpinnerGears, QItemTile, QBtn, QIcon, QList, QInput, QToolbar, QToolbarTitle
} from 'quasar-framework'

import axios from 'axios'

export default {
  data() {
    return {
      toolbarLabel: '',
      pathFetchData: '/api/bank/create',
      error: false,
      errors: '',
      model: 'bank',
      checked: false,
      additionalfields: [],
      form: { },
      base: {
        banks: [{
          label: '',
          value: ''
        }]
      },
    }
  },
  components: {
    QModal, QSpinner, Toast, QSelect, QField,
    QSpinnerGears, QItemTile, QBtn, QIcon, QList, QInput, QToolbar, QToolbarTitle
  },

  methods: {
    checkIfFieldHasError(error, field) {
      try {
        if (error.errors[field]) {
          return true
        }
      } catch (err) { }

      return false
    },
    handleClose(newVal) {
      this.$emit('close', newVal)
    },
    fetchData() {
      var vm = this;
      axios.get(vm.pathFetchData)
        .then(function(response) {
          vm.$set(vm.$data, 'form', response.data.form);
          vm.$set(vm.$data.base, 'banks', response.data.base['bankaccountlist']);
        })
        .catch(function(error) {
            
        })

    },
    open(kindOfProcess, bankId) {
      this.kindOfProcess = kindOfProcess;

      if (kindOfProcess === 'edit') {
        this.pathFetchData = `/api/bank/${bankId}/edit`
        this.toolbarLabel = 'EDITAR BANCO';
      }
      else {
        this.pathFetchData = '/api/bank/create'
        this.toolbarLabel = 'NUEVO BANCO';
      }
      this.fetchData();

      this.$refs['bankModal'].open();
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
            Toast.create.positive('Se creó el registro satisfactoriamente')
          }
          vm.isProcessing = false;
          vm.$refs['bankModal'].close();
        })
        .catch(function(error) {
          vm.errors = error.response.data;
          vm.isProcessing = false;
          Toast.create.negative('Ooops! No fue posible guardar el registro actual, intente de nuevo o revise los campos obligatorios(*).')
        });
    },

    update() {
      var vm = this;
      vm.isProcessing = true;
      axios.put(`/api/${vm.model}/${vm.form.id}`, vm.form)
        .then(function(response) {
          if (response.data.updated) {
            Toast.create.positive('Se actualizó el registro satisfactoriamente')
          }
          vm.isProcessing = false;
           vm.$refs['bankModal'].close();
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