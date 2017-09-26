<template>
    <div class="layout-padding">
            <kToolbar toolbarlabel="RECIBO DE CAJA No: " :documentId="document_id" :redirectTo="`/${model}`" @click="$router.push(`/${model}/create`)"
         icon2="add_circle_outline"></kToolbar> 

       
        <div class="row justify-center mobile-only">
            <div style="width: 500px; max-width: 90vw;">
                <q-fixed-position corner="top-right" :offset="[16, 16]">
                    <q-btn round color="secondary" @click="mobileMenu($refs)" icon="add" class="animate-pop" />
                </q-fixed-position>
            </div>
        </div>
        <q-fixed-position class="desktop-only" corner="top-right" :offset="[16, 16]">
            <q-fab color="secondary" active-icon="close" direction="down" class="animate-pop">
                <q-fab-action color="green-6" @click="email($refs)" icon="mail">
                    <q-tooltip anchor="center left" self="center right" :offset="[20, 0]">Enviar por email</q-tooltip>
                </q-fab-action>
                <q-fab-action color="green-6" @click="edit()" icon="edit">
                    <q-tooltip anchor="center left" self="center right" :offset="[20, 0]">Editar</q-tooltip>
                </q-fab-action>
                <q-fab-action color="amber-6" @click="pdf()" icon="print">
                    <q-tooltip anchor="center left" self="center right" :offset="[20, 0]">Imprimir</q-tooltip>
                </q-fab-action>

            </q-fab>
        </q-fixed-position>

        <div class="doc-container">
            <div class="row ">
                <div class="col-sm-5">
                    <q-list style="border: 0;padding: 0">
                        <q-input v-model="customerName" disable stack-label="Cliente" />
                        <q-input v-model="bankAccountName" disable stack-label="Cuenta" />
                        <q-input v-model="paymentMethod" disable stack-label="Método de pago" />
                        <q-input v-model="payment.observations" type="textarea" disable stack-label="Observaciones" />
                        <q-input v-model="payment.notes" type="textarea" disable stack-label="Notas" />

                    </q-list>
                </div>
                <div class="col-sm-1">
                </div>
                <div class="col-sm-5">
                    <q-list style="border: 0;padding: 0">
                        <q-input v-model="payment.date" disable stack-label="Fecha de creación" />
                        <q-input :value="ftotal" disable stack-label="Total Pagado" />
                        <q-field label="Estado: " :label-width="2">
                            <status :id="payment.status_id"></status>
                        </q-field>
                    </q-list>
                </div>
            </div>

        </div>
        <template v-if="checkFetchedData==true">
            <datatableShow :qData="detail" :isInvoice="payment.isInvoice"></datatableShow>
        </template>
        <sendemail ref="_sendEmail"></sendemail>
    </div>
</template>

<script>
import {
    QInput, QField, QSlider,
    QBtn, QIcon, QTooltip,
    QItemSeparator, QFixedPosition,
    QFab, QFabAction, QList, QModal,
    ActionSheet, Ripple
} from 'quasar-framework'

import totals from '../../components/tables/Total.vue'
import accounting from 'accounting'
import axios from 'axios'
import kToolbar from '../../components/Toolbar.vue'
import datatableShow from './show_datatable.vue'
import sendemail from '../../components/modals/SendEmailForm.vue'


import status from '../../components/status/PaymentIn.vue'

function showActionSheetWithIcons(vm, ref) {
    ActionSheet.create({
        title: 'Otras acciones',
        galery: true,
        actions: [
            {
                label: 'Enviar por email',
                icon: 'email',
                handler() {
                    vm.email(ref)
                }
            },
            {
                label: 'Editar',
                icon: 'edit',
                handler() {
                    vm.edit()
                }
            },
            {
                label: 'Imprimir',
                icon: 'print',
                handler() {
                    vm.pdf()
                }
            },
            {
                label: 'SALIR',
                color: 'green'
            }
        ],
        dismiss: {
            label: 'Cancel',
        }
    })
}

export default {
    directives: {
        Ripple
    },
    components: {
        datatableShow, QInput, totals,
        QSlider, QBtn, QIcon,QField,QTooltip,
        kToolbar, QItemSeparator,
        QFixedPosition, QFab, sendemail,
        QFabAction, QList, QModal, status
    },
    created() {
        this.fetchData();
    },
    data() {
        return {
            state: 'ABIERTA',
            model: 'payment-in',
            path: `payment-in/${this.$route.params.id}`,
            data: {},
            detail: [],
            total: 0,
            payment: '',
            isCategory: false,
            table: [],
            pathEmailData: 'getTemplateEmailToCustomerPaymentIn',

        }
    },
    watch: {
        '$route': 'fetchData',
    },
    computed: {
        checkFetchedData(){
            if (this.payment)
            {
                return true;
            }
            return false;
        },
        ftotal() {
            return accounting.formatMoney(this.total)
        },
        document_id() {
            return this.payment.resolution_id
        },
        bankAccountName() {
            if (this.payment.bank_account) {
                return this.payment.bank_account.bank_account_name;
            }
            return '';
        },
        customerName() {
            if (this.payment.contact) {
                return this.payment.contact.name;
            }
            return '';
        },
        paymentMethod() {
            if (this.payment.payment_method) {
                return this.payment.payment_method.name;
            }
            return '';
        }

    },
    methods: {
        mobileMenu(ref) {
            showActionSheetWithIcons(this, ref)
        },
        email(refs) {
            refs._sendEmail.open(this.$route.params.id, this.pathEmailData, this.model);
        },
        edit() {
            this.$router.push(`/${this.path}/edit`)
        },
        pdf() {
            window.open(`/api/${this.model}/${this.payment.public_id} /pdf`, '_blank');
        },
        fetchData() {
            var vm = this;
            axios.get(`/api/${vm.path}`)
                .then(function(response) {
                    vm.$set(vm, 'payment', response.data.payment)
                    vm.$set(vm, 'detail', response.data.detail)
                    vm.$set(vm, 'total', response.data.total)
                    vm.$set(vm, 'isCategory', response.data.isCategory)
                })
                .catch(function(error) {
                    console.log(error);
                })
        }

    }
}
</script>

<style>
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
