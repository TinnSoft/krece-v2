<template>
    <div class="layout-padding">

        <q-toolbar inverted color="secondary">
            <q-toolbar-title>
                <h5>
                    <b>{{toolbarlabel}} {{form.resolution_id}}</b>
                </h5>
            </q-toolbar-title>

            <q-btn class="within-iframe-hide" color="orange" flat @click="$router.replace('/payment-out')">
                <q-icon name="keyboard_arrow_left" />REGRESAR
            </q-btn>
        </q-toolbar>

        <q-item-separator color="secondary" />

        <div>

            <q-stepper flat ref="stepper" v-model="step" color="secondary" :contractable="contractable">
                <q-step default name="general" title="Datos Generales">
                    <p>
                        Este formulario te guiará atraves del proceso de relacion de comprobantes de egreso. Para comenzar, empieze llenando los siguientes campos.
                    </p>

                    <div class="doc-container">
                        <div class="row ">
                            <div class="col-sm-5">
                                <q-list style="border: 0;padding: 0">
                                    <q-field :error="checkIfFieldHasError(errors.customer_id)" error-label="Este campo es obligatorio">
                                        <q-select filter filter-placeholder="Buscar" v-model="form.customer_id" float-label="*Cliente" :options="base.contacts" />
                                    </q-field>

                                    <q-field :error="checkIfFieldHasError(errors.bank_account)" error-label="Este campo es obligatorio">
                                        <multiselect v-model="form.bank_account" :options="base.bank" :multiple="false" group-values="bank" group-label="description" placeholder="*Cuenta" track-by="bank_account_name" label="bank_account_name" @input="onInputBank" :max-height="250">
                                        </multiselect>
                                    </q-field>

                                    <q-field :error="checkIfFieldHasError(errors.payment_method_id)" error-label="Este campo es obligatorio">
                                        <q-select filter filter-placeholder="Buscar" v-model="form.payment_method_id" float-label="*Método de pago" :options="base.paymentmethod" />
                                    </q-field>

                                    <q-field :error="checkIfFieldHasError(errors.date)" error-label="Seleccione una fecha válida">
                                        <kDateTime v-model="form.date" stackLabel="*Fecha"></kDateTime>
                                    </q-field>
                                </q-list>
                            </div>
                            <div class="col-sm-1">
                            </div>
                            <div class="col-sm-5">
                                <q-list style="border: 0;padding: 0">
                                    <q-input type="textarea" v-model="form.observations" stack-label="Observaciones" />

                                    <q-field :error="checkIfFieldHasError(errors.notes)" error-label="Este campo es obligatorio">
                                        <q-input type="textarea" v-model="form.notes" stack-label="*Notas del comprobante" />
                                    </q-field>
                                </q-list>
                            </div>
                        </div>
                    </div>

                    <q-stepper-navigation>
                        <q-btn color="secondary" @click="$refs.stepper.next()" :disabled="generalDataNextStep">Siguiente paso</q-btn>
                    </q-stepper-navigation>
                </q-step>

                <q-step name="transactiontype" title="Tipo de transacción">
                    <p>Elija el tipo de transacción que desea asociar a su pago </p>

                    <q-list link>
                        <q-item tag="label">
                            <q-item-side>
                                <q-radio color="amber" v-model="isInvoice" val="1" />
                            </q-item-side>
                            <q-item-main>
                                <q-item-tile label>Asociar pago a Factura de compra</q-item-tile>
                                <q-item-tile sublabel lines="2">Esta opción te permite adicionar el pago a cada una de las facturas que se encuentren en estado abierto</q-item-tile>
                            </q-item-main>
                        </q-item>
                        <q-item multiline tag="label">
                            <q-item-side>
                                <q-radio color="amber" v-model="isInvoice" val="0" />
                            </q-item-side>
                            <q-item-main>
                                <q-item-tile label>Asociar pago a Categoría</q-item-tile>
                                <q-item-tile sublabel lines="2">Al seleccionar esta opción, podrás relacionar el pago a una categoría</q-item-tile>
                            </q-item-main>
                        </q-item>
                    </q-list>

                    <q-stepper-navigation>
                        <q-btn color="secondary" flat @click="$refs.stepper.previous()">Regresar</q-btn>
                        <q-btn color="secondary" :disabled="transactionTypeNextStep" @click="gotPaymentStep($refs.stepper)">Siguiente paso</q-btn>
                    </q-stepper-navigation>
                </q-step>

                <q-step name="pay" icon="attach_money" title="Pago">
                    <template v-if="isInvoice=='1'">
                        <p>
                            <small>
                                Facturas de venta pendientes por relacionar pago
                            </small>
                        </p>

                        <paymentInvoice :qdata="form.pending_payment_in" :refstepper="$refs.stepper" :sourceForm="this.form" :isInvoice="isInvoice"></paymentInvoice>
                    </template>
                    <template v-if="isInvoice=='0'">
                        <p>
                            <small>
                                Seleccione la Categoría a la que pertenece el gasto
                            </small>
                        </p>
                        <paymentInvoice :qdata="form.payment_in_to_category" 
                        :refstepper="$refs.stepper" 
                        :sourceForm="this.form" :isInvoice="isInvoice"
                        :categorylist="category_list"
                        :taxlist="taxes"></paymentInvoice>
                    </template>

                </q-step>

                <q-inner-loading :visible="showWait">
                    <q-spinner-mat size="50px" color="teal-4" />Espere por favor...
                </q-inner-loading>
            </q-stepper>
        </div>

    </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import moment from 'moment'
moment.locale('es');

import {
    QStepper, QStepperNavigation, QStep, QInnerLoading, QSpinnerMat,
    QDataTable, QInput, QSlider, QBtn,
    QIcon, QTooltip, clone, QToolbar, QToolbarTitle,
    QItemSeparator, QFixedPosition, QFab, QFabAction,
    QList, date, QSelect, QItemSide, QSpinner, QRadio,
    QItemMain, Ripple, Toast, QItem, QItemTile, QField, QSpinnerGears, Loading
} from 'quasar-framework'

import axios from 'axios'
const { addToDate } = date

import kDateTime from '../../components/DateTime.vue'
import accounting from 'accounting'
import paymentInvoice from '../payment-out/payment_datatable.vue'


export default {

    data() {
        return {
            options2: ['contractable'],
            step: 'first',
            step2: 'first',
            form: {},
            base: {
                contacts: [{
                    label: '',
                    value: ''
                }],
                paymentmethod: [{
                    label: '',
                    value: ''
                }],
                bank: []
            },
            select: null,
            value: null,
            options: [
                {
                    label: 'Crear cliente',
                    value: ''
                },
                {
                    label: 'Facebook',
                    value: 'fb'
                },
                {
                    label: 'Twitter',
                    value: 'twtr'
                },
                {
                    label: 'Apple Inc.',
                    value: 'appl'
                },
                {
                    label: 'Oracle',
                    value: 'ora'
                }
            ],
            redirect: '/payment-out',
            toolbarlabel: 'COMPROBANTE DE EGRESO No: ',
            path: 'payment-out/create',
            store: 'payment-out',
            processType: 'create',
            isInvoice: '',
            showWait: false,
            category_list:[{label:'',value:''}],
            taxes:[{label:'',value:''}]
        }
    },
    components: {
        QStepper, QStepperNavigation, QStep, QInnerLoading, QSpinnerMat,
        QInput, QField, QSlider, QBtn,
        QIcon, QTooltip, QToolbar, QToolbarTitle,
        QItemSeparator, QFixedPosition, QItem, QItemTile,
        QFab, QFabAction, QList, Multiselect, QSpinner,
        QSelect, kDateTime, QDataTable, QItemSide, QItemMain,
        Ripple, QSpinnerGears, QRadio, paymentInvoice
    },
    created() {
        if (this.$route.meta.mode === 'edit') {
            this.path = `payment-out/${this.$route.params.id}/edit`
        }
        this.fetchData();
    },
    computed: {
        transactionTypeNextStep() {
            if ((this.isInvoice) && (this.isInvoice != '')) {
                return false;
            }
            return true;
        },
        generalDataNextStep() {

            if ((this.form.customer_id) && (this.form.bank_account_id)
                && (this.form.date) && (this.form.payment_method_id)
                && (this.form.notes)) {

                return false;
            }
            return true;
        },
        errors() {
            return this.$store.getters.errors
        },
        contractable() {
            return this.options2.includes('contractable')
        },
        stepError() {
            return this.options2.includes('step_error')
        },
    },
    methods: {
        gotPaymentStep(ref) {
            ref.next()
            this.getInvoiceSale();
        },
        getInvoiceSale() {
            var vm = this;
            var procedure_path = '';

            vm.showWait = true;

            vm.hasPendingPayment = 1;
            if (vm.isInvoice == 1) {
                vm.$delete(vm.$data.form, 'payment_out_to_category', []);

                if (this.$route.meta.mode === 'edit') {
                    procedure_path = '/api/getInvoicePendingtoPay_edit_out/'
                }
                else {
                    procedure_path = '/api/getInvoicePendingtoPay_out/'
                }

                axios.get(procedure_path + vm.form.customer_id)
                    .then(function(response) {
                        vm.$set(vm.$data.form, 'pending_payment_out', response.data.PendingByPayment);

                        if (response.data.PendingByPayment.length == 0) {
                            vm.hasPendingPayment = 0;
                        }
                        vm.showWait = false;

                    })
                    .catch(function(error) {
                        vm.showWait = false;
                        vm.$set(vm.$data, 'errors', error);
                    })
            }
            else if (vm.isInvoice == 0) {

                var categoryData = [{
                    category_id: '',
                    unit_price:0,
                    tax_id: '',
                    quantity: 1,
                    observations: '',
                    total:0,
                }];
                
                vm.$delete(vm.$data.form, 'pending_payment_out', []);
                vm.$set(vm.$data.form, 'payment_out_to_category', categoryData);
                procedure_path = '/api/payment_out_ToCategorySection/'

                axios.get(procedure_path)
                    .then(function(response) {                   
                        vm.$set(vm.$data, 'category_list', response.data.category);
                        vm.$set(vm.$data, 'taxes', response.data.taxes);
                        vm.showWait = false;
                        
                    })
                    .catch(function(error) {
                        vm.$set(vm.$data, 'errors', error);
                        vm.showWait = false;
                    })

            }
        },
        onInputBank(val) {
            var vm = this;
            if (val) {
                vm.$set(vm.$data.form, 'bank_account_id', val.id)
            }
            else
            { vm.$set(vm.$data.form, 'bank_account_id', null) }
        },
        checkIfFieldHasError(val) {
            if (val) {
                return true
            }
            return false
        },
        getCurrentDate() {
            var vm = this;
            if (vm.form.date == null) {
                const today = new Date()
                vm.form.date = today
            }
        },
        fetchData() {
            var vm = this;
            axios.get(`/api/${vm.path}`)
                .then(function(response) {
                    vm.$set(vm, 'form', response.data.form)
                    // console.log(response.data)
                    if (response.data.base.contacts) {
                        vm.$set(vm.$data.base, 'contacts', response.data.base.contacts)
                    }
                    if (response.data.base.paymentmethod) {
                        vm.$set(vm.$data.base, 'paymentmethod', response.data.base.paymentmethod)
                    }

                    if (response.data.base.bank) {
                        vm.$set(vm.$data.base, 'bank', response.data.base.bank)
                    }


                    if (vm.$route.meta.mode === 'edit') {
                        vm.$set(vm.$data, 'isInvoice', '' + response.data.form.isInvoice + '')
                    }
                    else {
                        vm.getCurrentDate();
                    }
                })
                .catch(function(error) {
                    if (error.response.data.message) {
                        Toast.create.negative(error.response.data.message)
                    }
                    if (error.response.data.redirectTo) {
                        vm.$router.replace(`${error.response.data.redirectTo}`)
                    }
                })

        }
    },
    watch: {
        '$route': 'fetchData'
    },
}
</script>

<style>
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
</style>
