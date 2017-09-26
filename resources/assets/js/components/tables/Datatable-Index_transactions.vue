<template>

        <q-data-table ref="_mainTable" :data="dataFinal" :config="config" :columns="columns" @refresh="refresh">
            <template slot="col-status_id" scope="cell">
                <Remision_Status v-if="kmodule === 'remision'" :id="cell.row.status_id"></Remision_Status>
                <PaymentInStatus v-if="kmodule === 'payment'" :id="cell.row.status_id"></PaymentInStatus>
                <PaymentOutStatus v-if="kmodule === 'payment-out'" :id="cell.row.status_id"></PaymentOutStatus>
                <InvoiceStatus v-if="kmodule === 'invoice'" :id="cell.row.status_id"></InvoiceStatus>
                <BillStatus v-if="kmodule === 'bill'" :id="cell.row.status_id"></BillStatus>
                <PurchaseOrderStatus v-if="kmodule === 'purchase-order'" :id="cell.row.status_id"></PurchaseOrderStatus>
            </template>

        </q-data-table>
   
</template>
<script type="text/javascript">

import Remision_Status from '../../components/status/Remision.vue'
import PaymentInStatus from '../../components/status/PaymentIn.vue'
import PaymentOutStatus from '../../components/status/PaymentOut.vue'
import InvoiceStatus from '../../components/status/Invoice.vue'
import BillStatus from '../../components/status/Bill.vue'
import PurchaseOrderStatus from '../../components/status/Po.vue'
import Toggle from '../tables/Toggle.vue'
import kButton from '../tables/Button.vue'

import {
    QDataTable, Dialog
} from 'quasar-framework'

import accounting from 'accounting'
import axios from 'axios'
import moment from 'moment'
moment.locale('es');


export default {
    mixin: [QDataTable],
    components: {
        QDataTable, kButton, Toggle,
        Remision_Status, PaymentInStatus, InvoiceStatus, BillStatus, PurchaseOrderStatus, PaymentOutStatus
    },
    props: ['path', 'kmodule', 'model'],
    methods: {
        refresh(done) {
            this.timeout = setTimeout(() => {
                 this.fetchData();
                done()
            }, 1000)
        },
        refreshInBackground(val, id) {
            //this.kmodule='payment'

            this.setColumns(val, id)

        },

        fetchData(path) {

            let vm = this;

            vm.config.messages.noData = 'Cargando...'
            axios.get(`/api/${path}`)
                .then(function(response) {
                    // console.log('responde desde:', response.data)
                    vm.$set(vm, 'table', response.data)
                })
                .catch(function(error) {
                    console.log(error.response)
                })

            if (vm.table.length === 0) {
                vm.config.messages.noData = 'Aún no tienes registros creados'
            }
        },
        setColumns(kmodule, id) {

            let vm = this;
            let cols = this.columns;
            this.children=null;
            this.clear;
            console.log('asasasa')
            if (kmodule === 'estimate') {
                console.log('llego a estimate')
                cols = estimateColumns();
            }
            else if (kmodule === 'remision') {
                console.log('llego a remision')
                cols = remisionColumns();
            }
            else if (kmodule === 'invoice') {
                console.log('llego a invoice')
                //cols = invoiceColumns();

                vm.$set(vm, 'columns', invoiceColumns());
                // vm.regularCols=invoiceColumns();
                //  vm.$set(vm._data, 'columnSelection', invoiceColumns());
                console.log('indexxx', this.$refs['_mainTable'])
                  console.log('este', this)
                // vm.$set(vm, 'cols', invoiceColumns());

            }
            else if (kmodule === 'purchase-order') {
                cols = poColumns();
            }
            else if (kmodule === 'bill') {
                cols = billColumns();
            }
            else if (kmodule === 'credit_note') {
                cols = creditNoteColumns();
            }
            else if (kmodule === 'debit_note') {
                cols = debitNoteColumns();
            }
            else if (kmodule === 'payment') {
                console.log('llego a payment')
                 vm.$set(vm, 'columns', paymentInColumns());
                //cols = paymentInColumns();
            }
            
            this.fetchData(`getContactReports/${kmodule}/${id}`);

        },
        xColumns() {
            
            let kmodule=this.kmodule;

             console.log('indexxx', this.$refs['_mainTable'])

            if (kmodule === 'estimate') {
                return estimateColumns();
            }
            else if (kmodule === 'remision') {
                returnremisionColumns();
            }
            else if (kmodule === 'invoice') {
                return invoiceColumns();
            }
            else if (kmodule === 'purchase-order') {
                return poColumns();
            }
            else if (kmodule === 'bill') {
                return billColumns();
            }
            else if (kmodule === 'credit_note') {
                return creditNoteColumns();
            }
            else if (kmodule === 'debit_note') {
                return debitNoteColumns();
            }
            else if (kmodule === 'payment') {
                return paymentInColumns();
            }


        }

    },
    beforeDestroy() {
        clearTimeout(this.timeout)
    },
    data() {
        return {
            table: [],
            config: {
                refresh: true,
                noHeader: false,
                columnPicker: false,
                leftStickyColumns: 0,
                rightStickyColumns: 0,
                bodyStyle: {
                    maxHeight: '500px'
                },
                rowHeight: '40px',
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
            columns: null,
            pagination: true,
            rowHeight: 50,
            bodyHeightProp: 'maxHeight',
            bodyHeight: 500,
        }
    },
    created() {
        this.columns = paymentInColumns();
        this.fetchData(this.path);


    },
    mounted() {

    },
    computed: {
        dataFinal() {
            return this.table;
        },
        columnsFinal() {
            return this.columns;
        }
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
            label: 'Detalle',
            field: 'detail',
            sort: true,
            filter: true,
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
            label: 'Salidas',
            field: 'total_outcome',
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
            label: 'Entradas',
            field: 'total_income',
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
            label: 'Estado',
            field: 'status_id',
            width: '60px',
            sort: true,
            filter: true,
        },
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
            width: '40px',
            sort: true,
            filter: true,
            type: 'text'
        },
        {
            label: 'Cliente',
            field: 'name',
            width: '70px',
            sort: true,
            filter: true,
            type: 'text'
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
            label: 'Vencimiento',
            field: 'due_date',
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
            label: 'Salidas',
            field: 'total_outcome',
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
            label: 'Entradas',
            field: 'total_income',
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
            label: 'Estado',
            field: 'status_id',
            width: '60px',
            sort: true,
            filter: true,
        },
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
