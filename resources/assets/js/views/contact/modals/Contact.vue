<template>
  <div class="layout-padding justify-center docs-tab">
    <div style="width: 500px; max-width: 90vw;">

      <q-modal ref="contactModal" minimized :content-css="{padding: '20px'}" @close="handleClose">

        <q-toolbar color="teal-14">
          <q-btn flat>
            <q-icon name="help_outline" />
            <q-tooltip anchor="bottom middle" self="top middle" :offset="[10, 10]">
              <div>
                <strong>Recuerda</strong>!
              </div>
              <div class="text-justify">Al seleccionar una lista de precios, vendedor<br> o término de pago, te ayudará a optimizar tu tiempo <br> al momento de realizar algúna operación.</div>
            </q-tooltip>
          </q-btn>
          <q-toolbar-title>
            <div class="desktop-only">
              {{toolbarLabel}}
            </div>
            <div class="mobile-only">
              <small>{{toolbarLabel}}</small>
            </div>
          </q-toolbar-title>

          <q-btn flat @click="$refs.contactModal.close()">
            <q-icon name="exit_to_app" /></q-btn>

          <!--Botones de guardar, dependiendo el tipo de dispositivo se muestra el correspondiente diseño-->
          <q-btn class="desktop-only" flat @click="submit">
            <q-icon name="save" />
          </q-btn>
          <q-fixed-position class="mobile-only" corner="bottom-right" :offset="[18, 18]">
            <q-btn round color="green-14" icon="save" class="animate-pop" @click="submit" />
          </q-fixed-position>

        </q-toolbar>
        <q-tabs class="shadow-2" inverted color="secondary">
          <q-tab default slot="title" name="tab-1" label="General" />
          <q-tab slot="title" name="tab-2" label="Asociar Personas" />
          <q-tab-pane name="tab-1">

            <q-field helper="Recuerda que el contacto puede ser clasificado como cliente o proveedor" label="Tipo de contacto">
              <q-checkbox v-model="form.isCustomer" color="secondary" label="Cliente" />
              <q-checkbox v-model="form.isProvider" color="secondary" label="Proveedor" />
            </q-field>

            <q-item-separator></q-item-separator>
            <br>

            <div class="doc-container">
              <div class="row ">

                <div class="col-sm-5">
                  <q-list style="border: 0;padding: 0">

                    <q-field class="no-margin no-padding" :error="checkIfFieldHasError(errors, 'name')" error-label="Este campo es obligatorio">
                      <q-input class="no-margin no-padding" color="secondary" v-model="form.name" float-label="*Nombre" />
                    </q-field>
                    <q-input class="no-margin no-padding" color="secondary" v-model="form.nit" float-label="Nit" />
                    <q-input class="no-margin no-padding" color="secondary" v-model="form.address" float-label="Dirección" />
                    <q-input class="no-margin no-padding" color="secondary" v-model="form.city" float-label="Ciudad" />
                    <q-input class="no-margin no-padding" color="secondary" v-model="form.email" float-label="Email" />
                    <q-input class="no-margin no-padding" color="secondary" v-model="form.phone1" float-label="Teléfono 1" />
                    <q-input class="no-margin no-padding" color="secondary" v-model="form.phone2" float-label="Teléfono 2" />
                  </q-list>
                </div>
                <div class="col-sm-1">
                </div>
                <div class="col-sm-5">
                  <q-list style="border: 0;padding: 0">

                    <q-input class="no-margin no-padding" color="secondary" v-model="form.fax" float-label="Fax" />
                    <q-input class="no-margin no-padding" color="secondary" v-model="form.phone_mobile" float-label="Celular" />
                    <q-select class="no-margin no-padding" color="secondary" float-label="Lista de precios" v-model="form.list_price_id" :options="base.listprice" />
                    <q-select class="no-margin no-padding" color="secondary" float-label="Vendedor" v-model="form.seller_id" :options="base.sellers" />
                    <q-select class="no-margin no-padding" color="secondary" float-label="Terminos de pago" v-model="form.payment_terms_id" :options="base.paymentterms" />
                    <q-input class="no-margin no-padding" color="secondary" type="textarea" v-model="form.observation" float-label="Observaciones" />

                  </q-list>
                </div>
              </div>
            </div>
          </q-tab-pane>
          <q-tab-pane name="tab-2">
            <div class="doc-container">
              <div class="row ">
                <div class="col-sm-5">
                  <q-list style="border: 0;padding: 0">
                    <q-input class="no-margin no-padding" color="secondary" v-model="contact_others.name" float-label="*Nombre" />
                    <q-input class="no-margin no-padding" color="secondary" v-model="contact_others.last_name" float-label="Apellido" />
                    <q-input class="no-margin no-padding" color="secondary" v-model="contact_others.email" float-label="*Email" />

                  </q-list>
                </div>
                <div class="col-sm-1">
                </div>
                <div class="col-sm-5">
                  <q-list style="border: 0;padding: 0">
                    <q-input class="no-margin no-padding" color="secondary" v-model="contact_others.phone" float-label="Teléfono" />
                    <q-input class="no-margin no-padding" color="secondary" v-model="contact_others.phone_mobile" float-label="Celular" />
                    <br>
                    <q-checkbox color="secondary" v-model="contact_others.notify" label="Notificar">
                      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                        <q-icon name="help_outline" />
                        <strong>Marque esta opción</strong>
                        <div>Solo si requiere que este contacto reciba correos</div>
                        <div>o alertas de facturas disponibles y/o vencidas.</div>
                      </q-tooltip>
                    </q-checkbox>

                  </q-list>
                </div>
              </div>
              <br>
              <template v-if="isEditActive===false">
                <q-btn color="primary" @click="associateContact" :disabled="hasName">
                  <q-icon name="add" />Agregar nuevo
                </q-btn>
              </template>
              <template v-if="isEditActive===true">
                <q-btn color="primary" @click="updateAssociate">
                  <q-icon name="update" />Actualizar
                </q-btn>
                <q-btn flat color="primary" @click="cancelUpdateAssociate">
                  Cancelar
                </q-btn>
              </template>
              <br>
              <br>
              <q-alert key="info" color="info" style="margin-bottom: 1.5rem">
                <small> Puedes agregar tantos contactos como desees, una vez hayas terminado no olvides dar click en el boton GUARDAR</small>
              </q-alert>

              <q-item-separator color="secondary" />
              <q-data-table :data="form.contact_others" :config="config" :columns="columns">
                <template slot="col-notify" scope="cell">
                  <q-checkbox v-model="cell.row.notify" color="secondary" />
                </template>
                <template slot="col-actions" scope="cell">

                  <kButton color="secondary" iconname="edit" tooltiplabel="Editar" @click="editAssociate(cell)"></kButton>
                  <kButton color="red" iconname="delete" tooltiplabel="Eliminar" @click="deleteAssociate(cell)"></kButton>

                </template>
              </q-data-table>
            </div>
          </q-tab-pane>
          <q-inner-loading :visible="isProcessing">
            <q-spinner-mat size="50px" color="teal-4" />Espere por favor...
          </q-inner-loading>
        </q-tabs>

      </q-modal>
    </div>
  </div>
</template>

<script>
import {
  QModal, QSpinner, QItem, Toast, QItemSeparator, QTabs, QTab, QTabPane, QSelect, QCheckbox, QTooltip,
  QItemSide, QItemMain, QItemTile, QBtn, QIcon, QList, QInput, QToolbar, QToolbarTitle,
  QField, QDataTable, QFixedPosition, QAlert, QInnerLoading, QSpinnerMat
} from 'quasar-framework'

import axios from 'axios'
import kButton from '../../../components/tables/Button.vue'


export default {
  data() {
    return {
      editIdAssociate: null,
      isEditActive: false,
      isProcessing: false,
      kindOfProcess: 'create',
      error: false,
      toolbarLabel: 'NUEVO CONTACTO',
      model: 'contact',
      contact_others: { name: '', last_name: '', email: null, phone: null, phone_mobile: null, notify: false },
      form: { contact_others: [], isCustomer: false, isProvider: false },
      base: {
        listprice: [{
          label: '',
          value: ''
        }],
        sellers: [{
          label: '',
          value: ''
        }],
        paymentterms: [{
          label: '',
          value: ''
        }]
      },
      config: {
        refresh: false,
        noHeader: false,
        columnPicker: false,
        leftStickyColumns: 0,
        rightStickyColumns: 0,
        bodyStyle: {
          maxHeight: '300px'
        },
        rowHeight: '45px',
        responsive: true,
        labels: {
          columns: 'Columnas',
          allCols: 'Todas',
          rows: 'Mostrar ',
          selected: {
            singular: 'item seleccionado.',
            plural: 'items seleccionados.'
          },
          clear: 'Limpiar',
          search: 'Buscar',
          all: 'Todo'
        },
        messages: {
          noData: 'No hay datos disponibles...',
          noDataAfterFiltering: 'No se encontraron coincidencias con la busqueda. Porfavor revise los valores ingresados.'
        },
      },
      columns: [
        {
          label: 'Nombre',
          field: 'name',
          width: '50px',
          sort: true,
          type: 'string'
        },
        {
          label: 'Apellido',
          field: 'last_name',
          width: '40px',
          sort: true,
          type: 'string'
        },
        {
          label: 'email',
          field: 'email',
          width: '60px',
          sort: true,
          type: 'string'
        },
        {
          label: 'Telefono',
          field: 'phone',
          width: '40px',
          sort: true,
          type: 'string'
        },
        {
          label: 'Celular',
          field: 'phone_mobile',
          width: '40px',
          sort: true,
          type: 'string'
        },
        {
          label: 'Notificar?',
          field: 'notify',
          width: '40px',
          sort: true,
          type: 'string'
        },
        {
          label: 'Acciones',
          field: 'actions',
          width: '40px',
          sort: true,
          type: 'string'
        }
      ],
      pagination: true,
      rowHeight: 50,
      bodyHeightProp: 'maxHeight',
      bodyHeight: 300,
      pathFetchData: '/api/contact/create'
    }
  },
  components: {
    QModal, QSpinner, QItem, Toast, QItemSeparator, QTabs, QTab, QTabPane, QSelect, QCheckbox, QTooltip,
    QItemSide, QItemMain, QItemTile, QBtn, QIcon, QList, QInput, QToolbar, QToolbarTitle, kButton,
    QField, QDataTable, QFixedPosition, QAlert, QInnerLoading, QSpinnerMat
  },
  computed: {
    hasName() {
      if (this.contact_others.name.length > 0) {
        if (this.contact_others.email != null && this.contact_others.email != '') {
          return false
        }
      }
      return true
    }
  },
  methods: {
    cancelUpdateAssociate() {
      var vm = this;
      vm.isEditActive = false;
      vm.contact_others.id = '';
      vm.contact_others.name = '';
      vm.contact_others.last_name = '';
      vm.contact_others.email = '';
      vm.contact_others.phone = '';
      vm.contact_others.phone_mobile = '';
      vm.contact_others.notify = false;
    },
    updateAssociate() {
      let vm = this;

      if (vm.editIdAssociate >= 0) {
        vm.form.contact_others[vm.editIdAssociate].name = vm.contact_others.name;
        vm.form.contact_others[vm.editIdAssociate].last_name = vm.contact_others.last_name;
        vm.form.contact_others[vm.editIdAssociate].email = vm.contact_others.email;
        vm.form.contact_others[vm.editIdAssociate].phone = vm.contact_others.phone;
        vm.form.contact_others[vm.editIdAssociate].phone_mobile = vm.contact_others.phone_mobile;
        vm.form.contact_others[vm.editIdAssociate].notify = vm.contact_others.notify;
        vm.editIdAssociate = null;
        this.cancelUpdateAssociate();
      }
      vm.isEditActive = false;
    },
    editAssociate(val) {
      var vm = this;
      vm.isEditActive = true;
      vm.editIdAssociate = val.row.__index;

      vm.contact_others.name = val.row.name;
      vm.contact_others.last_name = val.row.last_name;
      vm.contact_others.email = val.row.email;
      vm.contact_others.phone = val.row.phone;
      vm.contact_others.phone_mobile = val.row.phone_mobile;
      vm.contact_others.notify = val.row.notify;
    },
    deleteAssociate(val) {
      this.form.contact_others.splice(val.row.__index, 1)
    },
    handleClose(newVal) {
      this.$emit('close', newVal)
    },
    associateContact() {
      var vm = this;

      vm.form.contact_others.push(
        {
          name: vm.contact_others.name,
          last_name: vm.contact_others.last_name,
          email: vm.contact_others.email,
          phone: vm.contact_others.phone,
          phone_mobile: vm.contact_others.phone_mobile,
          notify: vm.contact_others.notify
        }

      )
    },
    errors() {
      return this.$store.getters.errors
    },
    checkIfFieldHasError(error, field) {
      try {
        if (error.errors[field]) {
          return true
        }
      } catch (err) { }

      return false
    },
    fetchData(isCustomer, isProvider) {
      var vm = this;
      axios.get(vm.pathFetchData)
        .then(function(response) {
          console.log(response.data);
          vm.$set(vm.$data, 'form', response.data.form);
          vm.$set(vm.$data.base, 'listprice', response.data.base.listprice);
          vm.$set(vm.$data.base, 'sellers', response.data.base.sellers);
          vm.$set(vm.$data.base, 'paymentterms', response.data.base.paymentterms);

          if (vm.kindOfProcess === 'create') {
            vm.form.isCustomer = isCustomer;
            vm.form.isProvider = isProvider;
            vm.$set(vm.form, 'contact_others', [])
          }
        })
        .catch(function(error) {
          console.log(error.response)
        })

    },

    //isCustomer= check si es cliente
    //isProvidre= check si es proveedor
    //kindOfProcess= create/edit
    //customerId= (opcional) id del contacto cuando se edita
    open(isCustomer, isProvider, kindOfProcess, customerId) {

      this.isEditActive = false;
      this.kindOfProcess = kindOfProcess;
      if (kindOfProcess === 'edit') {
        this.pathFetchData = `/api/contact/${customerId}/edit`
        this.toolbarLabel = 'EDITAR CONTACTO';
      }
      else {
        this.pathFetchData = '/api/contact/create'
        this.toolbarLabel = 'NUEVO CONTACTO';
      }

      this.fetchData(isCustomer, isProvider);

      this.$refs['contactModal'].open();

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
      axios.put('/api/contact/' + vm.form.id, vm.form)
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

  },
  watch: {
    pagination(value) {
      if (!value) {
        this.oldPagination = clone(this.config.pagination)
        this.config.pagination = false
        return
      }
      this.config.pagination = this.oldPagination
    },
    rowHeight(value) {
      this.config.rowHeight = value + 'px'
    },
    bodyHeight(value) {
      let style = {}
      if (this.bodyHeightProp !== 'auto') {
        style[this.bodyHeightProp] = value + 'px'
      }
      this.config.bodyStyle = style
    },
    bodyHeightProp(value) {
      let style = {}
      if (value !== 'auto') {
        style[value] = this.bodyHeight + 'px'
      }
      this.config.bodyStyle = style
    }
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