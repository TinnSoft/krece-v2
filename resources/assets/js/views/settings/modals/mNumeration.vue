<template>
  <div class="layout-padding justify-center docs-tab">
    <div style="width: 500px; max-width: 90vw;">

      <q-modal ref="numerationModal" minimized :content-css="{padding: '20px'}" @close="handleClose">

        <q-toolbar color="teal-14">
          <q-toolbar-title>
            <div class="desktop-only">
              {{toolbarLabel}}
            </div>
            <div class="mobile-only">
              <small>{{toolbarLabel}}</small>
            </div>
          </q-toolbar-title>

          <q-btn flat @click="$refs.numerationModal.close()">
            <q-icon name="exit_to_app" /></q-btn>
          <q-btn flat @click="submit">
            <q-icon name="save" /></q-btn>

        </q-toolbar>
        <q-field class="no-margin no-padding" :error="checkIfFieldHasError(errors, 'name')" error-label="Este campo es obligatorio">
          <q-input color="green" v-model="form.name" float-label="*Nombre" />
        </q-field>
        <br>

        <q-checkbox color="green" v-model="form.auto_increment" label="Numeración automática?" />

        <q-input v-if="form.auto_increment===true" color="green" v-model="form.prefix" float-label="Prefijo" />
        <q-field class="no-margin no-padding" :error="checkIfFieldHasError(errors, 'initial_number')" error-label="Este campo es obligatorio">
          <q-input v-if="form.auto_increment===true" color="green" v-model="form.initial_number" float-label="*Numero Inicial" />
        </q-field>
        <q-input v-if="form.auto_increment===true" color="green" v-model="form.final_number" float-label="Número final" />

        <q-field label="Predeterminar esta numeración">
          <q-option-group type="radio" color="green" v-model="form.isDefault" :options="[
                              { label: 'Si', value: 1, color: 'green' },
                              { label: 'No', value: 0, color: 'green' },
                            ]" />
        </q-field>

        <q-input color="green" type="textarea" v-model="form.invoice_text" float-label="Resolución" />

      </q-modal>
    </div>
  </div>
</template>

<script>
import {
  QModal, Toast, QCheckbox, QTooltip,
  QBtn, QIcon, QInput, QToolbar, QToolbarTitle,
  QField, QDataTable, QOptionGroup
} from 'quasar-framework'

import axios from 'axios'
import kButton from '../../../components/tables/Button.vue'


export default {
  data() {
    return {
      isProcessing: false,
      kindOfProcess: 'create',
      error: false,
      toolbarLabel: 'NUEVA NUMERACIÓN',
      model: 'resolution',
      form: { auto_increment: true, isDefault: 0 },
      errors: '',
      pathFetchData: '/api/resolution/create'
    }
  },
  components: {
    QModal, Toast, QCheckbox, QTooltip,
    QBtn, QIcon, QInput, QToolbar, QToolbarTitle, kButton,
    QField, QDataTable, QOptionGroup
  },
  computed: {
  },
  methods: {


    handleClose(newVal) {
      this.$emit('close', newVal)
    },

    checkIfFieldHasError(error, field) {
      try {
        if (error.errors[field]) {
          return true
        }
      } catch (err) { }

      return false
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

    //kindOfProcess= create/edit
    //id= (opcional) id del registro cuando se edita
    open(kindOfProcess, id) {

      this.$set(this.$data, 'errors', []);
      this.kindOfProcess = kindOfProcess;
      if (kindOfProcess === 'edit') {
        this.pathFetchData = `/api/resolution/${id}/edit`
        this.toolbarLabel = 'EDITAR NUMERACIÓN';
      }
      else {
        this.pathFetchData = '/api/resolution/create'
        this.toolbarLabel = 'NUEVA NUMERACIÓN';
      }
      this.fetchData();

      this.$refs['numerationModal'].open();

    },

    submit() {
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
            vm.$refs['numerationModal'].close()
          }
          vm.isProcessing = false;
        })
        .catch(function(error) {
          vm.isProcessing = false;
          vm.$set(vm.$data, 'errors', error.response.data);
          Toast.create.negative('Ooops! No fue posible guardar el registro actual, intente de nuevo.')
        });
    },

    update() {
      var vm = this;
      vm.isProcessing = true;
      axios.put('/api/resolution/' + vm.form.id, vm.form)
        .then(function(response) {
          if (response.data.updated) {
            Toast.create.positive('Se actualizó el registro satisfactoriamente')
            vm.$refs['numerationModal'].close()
          }
          vm.isProcessing = false;

        })
        .catch(function(error) {
          vm.isProcessing = false;
          vm.$set(vm.$data, 'errors', error.response.data);
          Toast.create.negative('No fue posible actualizar el registro actual, intente de nuevo.')
        })
    },

  },

}
</script>
