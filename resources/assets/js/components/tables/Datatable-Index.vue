<template>
    <div>
        <q-data-table ref="mainTable" :data="table" :config="config" :columns="columns" @refresh="refresh">
            <template slot="col-public_id" slot-scope="cell">
                <u style="color: green;cursor: pointer " @click="show(cell)">{{cell.row.public_id}}</u>
            </template>

            <template v-if="hasStatus===true" slot="col-status_id" slot-scope="cell">
                <Remision_Status v-if="kmodule === 'remision'" :id="cell.row.status_id"></Remision_Status>
                <PaymentInStatus v-if="kmodule === 'payment-in'" :id="cell.row.status_id"></PaymentInStatus>
                <PaymentOutStatus v-if="kmodule === 'payment-out'" :id="cell.row.status_id"></PaymentOutStatus>
                <InvoiceStatus v-if="kmodule === 'invoice'" :id="cell.row.status_id"></InvoiceStatus>
                <BillStatus v-if="kmodule === 'bill'" :id="cell.row.status_id"></BillStatus>
                <PurchaseOrderStatus v-if="kmodule === 'purchase-order'" :id="cell.row.status_id"></PurchaseOrderStatus>
            </template>

            <template slot="col-actions" slot-scope="cell">

                <template v-if="hasLockedBtn===true">
                    <Toggle @blur="lockUnlock(cell.row, $refs)" :id="cell.row.status_id"></Toggle>
                </template>

                <kButton color="secondary" :statusID="cell.row.status_id" iconname="edit" tooltiplabel="Editar" @click="edit(cell)"></kButton>

                <kButton color="secondary" v-if="showPaymentBtn===true" :statusID="cell.row.status_id" iconname="attach_money" tooltiplabel="Agregar pago" @click="edit(cell)"></kButton>

                <kButton color="secondary" iconname="print" tooltiplabel="Imprimir" @click="pdf(cell)"></kButton>

                <kButton color="secondary" v-if="showEmailBtn===true" iconname="email" tooltiplabel="Enviar por email" @click="email($refs, cell)"></kButton>

                <kButton color="secondary" iconname="remove_red_eye" tooltiplabel="Ver" @click="show(cell)"></kButton>

                <kButton color="red" :statusID="cell.row.status_id" iconname="delete" tooltiplabel="Eliminar" @click="deleteRow(cell)"></kButton>

            </template>

        </q-data-table>
        <sendemail ref="_sendEmail"></sendemail>
        <q-inner-loading :visible="isProcessing">
            <q-spinner-mat size="50px" color="teal-4" />Espere por favor...
        </q-inner-loading>
    </div>
</template>
<script type="text/javascript">
import sendemail from '../../components/modals/SendEmailForm.vue'
import Remision_Status from '../../components/status/Remision.vue'
import PaymentInStatus from '../../components/status/PaymentIn.vue'
import PaymentOutStatus from '../../components/status/PaymentOut.vue'
import InvoiceStatus from '../../components/status/Invoice.vue'
import BillStatus from '../../components/status/Bill.vue'
import PurchaseOrderStatus from '../../components/status/Po.vue'
import Toggle from '../tables/Toggle.vue'
import kButton from '../tables/Button.vue'

import {
    QDataTable, Dialog, QInnerLoading, QSpinnerMat
} from 'quasar-framework'

import accounting from 'accounting'
import axios from 'axios'
import moment from 'moment'
moment.locale('es');


export default {
    components: {
        QDataTable, kButton, Toggle, QInnerLoading, QSpinnerMat,
        sendemail, Remision_Status, PaymentInStatus, InvoiceStatus, BillStatus,
        PurchaseOrderStatus, PaymentOutStatus
    },
    props: ['path', 'kmodule', 'mwarning', 'pathemaildata', 'model', 'pathToUpdateState'],
    methods: {
        lockUnlock(cell, ref) {

            if (cell.status_id === 2) {
                this.updateStatus(cell.public_id, 1, ref);
            }
            else {
                this.updateStatus(cell.public_id, 2, ref);
            }
        },
        email(refs, cell) {
            refs._sendEmail.open(cell.row.public_id, this.pathemaildata, this.kmodule);
        },
        show(cell) {
            this.$router.push(`/${this.kmodule}/${cell.row.public_id}`)
        },
        edit(cell) {
            this.$router.push(`/${this.kmodule}/${cell.row.public_id}/edit`)
        },
        pdf(cell) {
            window.open('/api/' + this.kmodule + '/' + cell.row.public_id + '/pdf', '_blank');
        },
        deleteRow(cell) {
            var vm = this;
            Dialog.create({
                title: 'Tenga Cuidado',
                message: this.mwarning + cell.row.public_id + ', desea continuar?',
                buttons: [
                    {
                        label: 'Cancelar',
                        color: 'orange'
                    },
                    {
                        label: 'Si, estoy seguro',
                        color: 'positive',
                        style: 'text-decoration: underline',
                        handler() {
                            vm.submit(cell.row.public_id);
                            vm.table.splice(cell.row.__index, 1)
                        }
                    }
                ]
            })
        },
        refresh(done) {
            this.timeout = setTimeout(() => {
                this.fetchData();
                done()
            }, 1000)
        },
        fetchData() {
            var vm = this;
            vm.isProcessing = true;
            vm.$set(vm, 'returnData', true)
            vm.config.messages.noData = 'Cargando...'
            axios.get(`/api/${vm.path}`)
                .then(function(response) {
                    vm.$set(vm, 'table', response.data.records)
                    vm.isProcessing = false;
                })
                .catch(function(error) {
                    vm.isProcessing = false;
                })
            vm.$set(vm, 'returnData', false)
            if (vm.table.length === 0) {
                vm.config.messages.noData = 'Aún no tienes registros creados'
            }
        },
        submit(itemID) {
            this.$nextTick(function() {
                this.$store.dispatch('storeById', {
                    store: `${this.kmodule}/${itemID}`,
                    method: 'delete',
                    router: this.$router
                })
            })
        },
        updateStatus(itemID, status, ref) {
            var vm=this;
            var xstatus = { status_id: status };
            vm.isProcessing = true;
            axios.put(`/api/${vm.pathToUpdateState}/${itemID}`, xstatus)
                .then(function(response) {
                    if (response.data.updated) {
                        ref.mainTable.refresh();
                    }
                    vm.isProcessing = false;
                })
                .catch(function(error) {
                    vm.isProcessing = false;
                })
        }

    },
    beforeDestroy() {
        clearTimeout(this.timeout)
    },
    data() {
        return {
            isProcessing: false,
            returnData: true,
            hasLockedBtn: false,
            hasStatus: false,
            editDisabledBtn: false,
            table: [],
            config: {
                refresh: true,
                noHeader: false,
                columnPicker: false,
                leftStickyColumns: 0,
                rightStickyColumns: 1,
                bodyStyle: {
                    maxHeight: '500px'
                },
                rowHeight: '45px',
                responsive: true,
                pagination: {
                    rowsPerPage: 10,
                    options: [5, 10, 15, 30, 50, 500]
                },
                //selection: 'multiple',
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
                    noData: 'Cargando...',
                    noDataAfterFiltering: 'No se encontraron coincidencias con la busqueda. Porfavor revise los valores ingresados.'
                },
            },
            columns: {},
            pagination: true,
            rowHeight: 50,
            bodyHeightProp: 'maxHeight',
            bodyHeight: 500,
            showEmailBtn: true,
            showPaymentBtn: false
        }
    },
    created() {
        if (this.kmodule == 'estimate') {
            this.columns = estimateColumns();
        }
        else if (this.kmodule == 'remision') {
            this.columns = remisionColumns();
            this.hasLockedBtn = true;
            this.hasStatus = true;
        }
        else if (this.kmodule == 'invoice') {
            this.columns = invoiceColumns();
            this.hasLockedBtn = true;
            this.hasStatus = true;
            this.showPaymentBtn = true;
        }
        else if (this.kmodule == 'purchase-order') {
            this.columns = poColumns();
        }
        else if (this.kmodule == 'bill') {
            this.columns = billColumns();
            this.hasLockedBtn = true;
            this.hasStatus = true;
            this.showEmailBtn = false;
            this.showPaymentBtn = true;
        }
        else if (this.kmodule == 'credit-note') {
            this.columns = creditNoteColumns();
        }
        else if (this.kmodule == 'debit-note') {
            this.columns = debitNoteColumns();
            this.showEmailBtn = false;
        }
        else if (this.kmodule == 'payment-in') {
            this.columns = paymentInColumns();
            this.hasLockedBtn = true;
            this.hasStatus = true;
        }
        else if (this.kmodule == 'payment-out') {
            this.columns = paymentOutColumns();
            this.hasLockedBtn = true;
            this.hasStatus = true;
        }


        this.fetchData();
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

function estimateColumns() {
    return [
        {
            label: 'No',
            field: 'public_id',
            width: '40px',
            sort: true,

            filter: true,
            type: 'text'
        },
        {
            label: 'Cliente',
            field: 'contact',
            sort(a) {
                return a.name
            },
            format(value) {
                return value.name
            },
            filter: true,
            width: '150px',
            type: 'string',
        },
        {
            label: 'Creación',
            field: 'created_at',
            width: '80px',
            sort(a, b) {
                return (new Date(a.date)) - (new Date(b.date))
            },
            format(value) {
                return moment(value.date).fromNow();
            },
            filter: true,
        },
        {
            label: 'Actualización',
            field: 'updated_at',
            width: '80px',
            sort(a, b) {
                return (new Date(a.date)) - (new Date(b.date))
            },
            format(value) {
                return moment(value.date).fromNow();
            },
            filter: true,
        },
        {
            label: 'Total',
            field: 'total',
            filter: false,
            sort(t) {
                return t
            },
            format(value) {
                return accounting.formatMoney(value);
            },
            type: 'string',
            width: '70px'
        },
        {
            label: 'Acciones',
            field: 'actions',
            sort: false,
            filter: false,
            width: '100px'
        }
    ]
}
function remisionColumns() {
    return [
        {
            label: 'No',
            field: 'public_id',
            width: '35px',
            sort: true,
            filter: true,
            type: 'text'
        },
        {
            label: 'Cliente',
            field: 'contact',
            sort(a) {
                return a.name
            },
            format(value) {
                return value.name
            },
            filter: true,
            width: '140px',
            type: 'string',
        },
        {
            label: 'Creación',
            field: 'created_at',
            width: '80px',
            sort(a, b) {
                return (new Date(a.date)) - (new Date(b.date))
            },
            format(value) {
                return moment(value.date).fromNow();
            },
            filter: true,
        },
        {
            label: 'Vence en',
            field: 'due_date',
            width: '80px',
            sort(a, b) {
                return (new Date(a.due_date)) - (new Date(b.due_date))
            },
            format(value) {
                return moment(value.due_date).format('MMMM Do YYYY');
            },
            filter: true,
        },
        {
            label: 'Estado',
            field: 'status_id',
            width: '60px',
            sort: true,
            filter: true,
        },
        {
            label: 'Total',
            field: 'total',
            filter: false,
            sort(t) {
                return t
            },
            format(value) {
                return accounting.formatMoney(value);
            },
            type: 'string',
            width: '80px'
        },
        {
            label: 'Acciones',
            field: 'actions',
            sort: false,
            filter: false,
            width: '150px'
        }
    ]
}
function debitNoteColumns() {
    return [
        {
            label: 'No',
            field: 'public_id',
            width: '40px',
            sort: true,

            filter: true,
            type: 'text'
        },
        {
            label: 'Cliente',
            field: 'contact',
            sort(a) {
                return a.name
            },
            format(value) {
                return value.name
            },
            filter: true,
            width: '150px',
            type: 'string',
        },
        {
            label: 'Creación',
            field: 'created_at',
            width: '80px',
            sort(a, b) {
                return (new Date(a.date)) - (new Date(b.date))
            },
            format(value) {
                return moment(value.date).fromNow();
            },
            filter: true,
        },
        {
            label: 'Actualización',
            field: 'updated_at',
            width: '80px',
            sort(a, b) {
                return (new Date(a.date)) - (new Date(b.date))
            },
            format(value) {
                return moment(value.date).fromNow();
            },
            filter: true,
        },
        {
            label: 'Total',
            field: 'total',
            filter: false,
            sort(t) {
                return t
            },
            format(value) {
                return accounting.formatMoney(value);
            },
            type: 'string',
            width: '70px'
        },
        {
            label: 'Por aplicar',
            field: 'amount_pending_to_apply',
            filter: false,
            sort(t) {
                return t
            },
            format(value) {
                return accounting.formatMoney(value);
            },
            type: 'string',
            width: '70px'
        },
        {
            label: 'Acciones',
            field: 'actions',
            sort: false,
            filter: false,
            width: '100px'
        }
    ]
}

function creditNoteColumns() {
    return [
        {
            label: 'No',
            field: 'public_id',
            width: '40px',
            sort: true,

            filter: true,
            type: 'text'
        },
        {
            label: 'Cliente',
            field: 'contact',
            sort(a) {
                return a.name
            },
            format(value) {
                return value.name
            },
            filter: true,
            width: '150px',
            type: 'string',
        },
        {
            label: 'Creación',
            field: 'created_at',
            width: '80px',
            sort(a, b) {
                return (new Date(a.date)) - (new Date(b.date))
            },
            format(value) {
                return moment(value.date).fromNow();
            },
            filter: true,
        },
        {
            label: 'Actualización',
            field: 'updated_at',
            width: '80px',
            sort(a, b) {
                return (new Date(a.date)) - (new Date(b.date))
            },
            format(value) {
                return moment(value.date).fromNow();
            },
            filter: true,
        },
        {
            label: 'Total',
            field: 'total',
            filter: false,
            sort(t) {
                return t
            },
            format(value) {
                return accounting.formatMoney(value);
            },
            type: 'string',
            width: '70px'
        },
        {
            label: 'Por aplicar',
            field: 'amount_pending_to_apply',
            filter: false,
            sort(t) {
                return t
            },
            format(value) {
                return accounting.formatMoney(value);
            },
            type: 'string',
            width: '70px'
        },
        {
            label: 'Acciones',
            field: 'actions',
            sort: false,
            filter: false,
            width: '100px'
        }
    ]
}
function paymentInColumns() {
    return [
        {
            label: 'No',
            field: 'public_id',
            width: '40px',
            sort: true,

            filter: true,
            type: 'text'
        },
        {
            label: 'Cliente',
            field: 'contact',
            sort: true,
            filter: true,
            width: '110px',
            type: 'string',
        },
        {
            label: 'Asociado a',
            field: 'IsCategory',
            sort: true,
            filter: true,
            format(value) {
                if (value === 0) {
                    return 'Factura de venta'
                }
                return 'Categoría'
            },
            width: '130px'
        },
        {
            label: 'Fecha',
            field: 'date',
            width: '90px',
            sort(a, b) {
                return (new Date(a)) - (new Date(b))
            },
            format(value) {
                return moment(value).format('MMMM Do YYYY');
            },
            filter: true,
        },
        {
            label: 'Cuenta',
            field: 'bank_account_name',
            sort: true,
            filter: true,
            width: '100px',
            type: 'string',
        },
        {
            label: 'Estado',
            field: 'status_id',
            width: '60px',
            sort: true,
            filter: true,
        },
        {
            label: 'Monto',
            field: 'total',
            filter: false,
            sort(t) {
                return t
            },
            format(value) {
                return accounting.formatMoney(value);
            },
            type: 'string',
            width: '70px'
        },
        {
            label: 'Acciones',
            field: 'actions',
            sort: false,
            filter: false,
            width: '170px'
        }
    ]
}

function paymentOutColumns() {
    return [
        {
            label: 'No',
            field: 'public_id',
            width: '40px',
            sort: true,

            filter: true,
            type: 'text'
        },
        {
            label: 'Cliente',
            field: 'contact',
            sort: true,
            filter: true,
            width: '110px',
            type: 'string',
        },
        {
            label: 'Tipo de proceso',
            field: 'IsCategory',
            sort: true,
            filter: true,
            format(value) {
                if (value === 0) {
                    return 'Factura de compra'
                }
                return 'Categoría'
            },
            width: '130px'
        },
        {
            label: 'Fecha',
            field: 'date',
            width: '90px',
            sort(a, b) {
                return (new Date(a)) - (new Date(b))
            },
            format(value) {
                return moment(value).format('MMMM Do YYYY');
            },
            filter: true,
        },
        {
            label: 'Cuenta',
            field: 'payment_method',
            sort: true,
            filter: true,
            width: '100px',
            type: 'string',
        },
        {
            label: 'Estado',
            field: 'status_id',
            width: '60px',
            sort: true,
            filter: true,
        },
        {
            label: 'Monto',
            field: 'total',
            filter: false,
            sort(t) {
                return t
            },
            format(value) {
                return accounting.formatMoney(value);
            },
            type: 'string',
            width: '70px'
        },
        {
            label: 'Acciones',
            field: 'actions',
            sort: false,
            filter: false,
            width: '170px'
        }
    ]
}

function invoiceColumns() {
    return [
        {
            label: 'No',
            field: 'public_id',
            width: '35px',
            sort: true,
            filter: true,
            type: 'text'
        },
        {
            label: 'Cliente',
            field: 'contact_name',
            sort: true,
            filter: true,
            width: '120px',
            type: 'string',
        },
        {
            label: 'Creación',
            field: 'created_at',
            width: '80px',
            sort(a, b) {
                return (new Date(a)) - (new Date(b))
            },
            format(value) {
                return moment(value).fromNow();
            },
            filter: true,
        },
        {
            label: 'Vence en',
            field: 'due_date',
            width: '80px',
            sort(a, b) {
                return (new Date(a)) - (new Date(b))
            },
            format(value) {
                return moment(value).format('MMMM Do YYYY');
            },
            filter: true,
        },
        {
            label: 'Estado',
            field: 'status_id',
            width: '60px',
            sort: true,
            filter: true,
        },
        {
            label: 'Total',
            field: 'total',
            filter: false,
            sort(t) {
                return t
            },
            format(value) {
                return accounting.formatMoney(value);
            },
            type: 'string',
            width: '80px'
        },
        {
            label: 'Pagado',
            field: 'total_payed',
            filter: false,
            sort(t) {
                return t
            },
            format(value) {
                return accounting.formatMoney(value);
            },
            type: 'string',
            width: '80px'
        },
        {
            label: 'Por Pagar',
            field: 'pending_to_pay',
            filter: false,
            sort(t) {
                return t
            },
            format(value) {
                return accounting.formatMoney(value);
            },
            type: 'string',
            width: '80px'
        },
        {
            label: 'Acciones',
            field: 'actions',
            sort: false,
            filter: false,
            width: '150px'
        }
    ]
}

function billColumns() {
    return [
        {
            label: 'No',
            field: 'public_id',
            width: '35px',
            sort: true,
            filter: true,
            type: 'text'
        },
        {
            label: 'Proveedor',
            field: 'contact_name',
            sort: true,
            filter: true,
            width: '120px',
            type: 'string',
        },
        {
            label: 'Creación',
            field: 'created_at',
            width: '80px',
            sort(a, b) {
                return (new Date(a)) - (new Date(b))
            },
            format(value) {
                return moment(value).fromNow();
            },
            filter: true,
        },
        {
            label: 'Vence en',
            field: 'due_date',
            width: '80px',
            sort(a, b) {
                return (new Date(a)) - (new Date(b))
            },
            format(value) {
                return moment(value).format('MMMM Do YYYY');
            },
            filter: true,
        },
        {
            label: 'Estado',
            field: 'status_id',
            width: '60px',
            sort: true,
            filter: true,
        },
        {
            label: 'Total',
            field: 'total',
            filter: false,
            sort(t) {
                return t
            },
            format(value) {
                return accounting.formatMoney(value);
            },
            type: 'string',
            width: '80px'
        },
        {
            label: 'Pagado',
            field: 'total_payed',
            filter: false,
            sort(t) {
                return t
            },
            format(value) {
                return accounting.formatMoney(value);
            },
            type: 'string',
            width: '80px'
        },
        {
            label: 'Por Pagar',
            field: 'pending_to_pay',
            filter: false,
            sort(t) {
                return t
            },
            format(value) {
                return accounting.formatMoney(value);
            },
            type: 'string',
            width: '80px'
        },
        {
            label: 'Acciones',
            field: 'actions',
            sort: false,
            filter: false,
            width: '150px'
        }
    ]
}

function poColumns() {
    return [
        {
            label: 'No',
            field: 'public_id',
            width: '35px',
            sort: true,
            filter: true,
            type: 'text'
        },
        {
            label: 'Cliente',
            field: 'contact',
            sort: true,
            format(value) {
                return value.name;
            },
            filter: true,
            width: '120px',
            type: 'string',
        },
        {
            label: 'Creación',
            field: 'created_at',
            width: '80px',
            sort(a, b) {
                return (new Date(a.date)) - (new Date(b.date))
            },
            format(value) {
                return moment(value.date).fromNow();
            },
            filter: true,
        },
        {
            label: 'Estado',
            field: 'status_id',
            width: '60px',
            sort: true,
            filter: true,
        },
        {
            label: 'Total',
            field: 'total',
            filter: false,
            sort(t) {
                return t
            },
            format(value) {
                return accounting.formatMoney(value);
            },
            type: 'string',
            width: '80px'
        },
        {
            label: 'Acciones',
            field: 'actions',
            sort: false,
            filter: false,
            width: '150px'
        }
    ]
}

</script>
