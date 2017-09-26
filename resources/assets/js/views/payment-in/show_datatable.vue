<template>
    <q-data-table :data="qData" :config="config" :columns="columns">

    </q-data-table>
</template>

<script>
import {
    QDataTable
} from 'quasar-framework'

import accounting from 'accounting'
import moment from 'moment'
moment.locale('es');


export default {
    props: {
        qData: {
            type: Array,
        },
        isInvoice: {}
    },
    data() {
        return {
            config: {
                refresh: false,
                noHeader: false,
                columnPicker: false,
                leftStickyColumns: 0,
                rightStickyColumns: 1,
                bodyStyle: {
                    maxHeight: '500px'
                },
                rowHeight: '35px',
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
            columns: [],
            pagination: true,
            rowHeight: 50,
            bodyHeightProp: 'maxHeight',
            bodyHeight: 500,
        }
    },
    components: {
        QDataTable
    },
    computed: {
        dataTable() {
            if (this.qData) {
                return this.qData
            }
            return [];
        }
    },
    created() {
        if (this.isInvoice === 1) {
            this.columns = invoiceColumns();
        }
        else {
            this.columns = categoryColumns();
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

function invoiceColumns() {
    return [
        {
            label: 'No Factura',
            field: 'public_id',
            width: '40px',
            sort: true,
            type: 'string'
        },
        {
            label: 'Fecha',
            field: 'date',
            width: '80px',
            sort(a, b) {
                return (new Date(a.date)) - (new Date(b.date))
            },
            format(value) {
                return moment(value.date).format('MMMM Do YYYY');
            },
        },
        {
            label: 'Vencimiento',
            field: 'due_date',
            width: '80px',
            sort(a, b) {
                return (new Date(a.due_date)) - (new Date(b.due_date))
            },
            format(value) {
                return moment(value.due_date).format('MMMM Do YYYY');
            },
        },
        {
            label: 'Total',
            field: 'total',
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
            label: 'Pago Acumulado',
            field: 'total_pending_by_payment2',
            format(value) {
                return accounting.formatMoney(value);
            },
            width: '90px',
            type: 'string',
        },
        {
            label: 'Pagado',
            field: 'total_payed',
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
            label: 'Por Pagar',
            field: 'total_pending_by_payment',
            sort(t) {
                return t
            },
            format(value) {
                return accounting.formatMoney(value);
            },
            type: 'string',
            width: '70px'
        }
    ]
}

function categoryColumns() {
    return [
        {
            label: 'Categoría',
            field: 'category',
            width: '100px',
            format(value) {
                return value.type.description + ': ' + value.name;
            },
            sort: true,
            type: 'string'
        },
        {
            label: 'Precio Unitario',
            field: 'unit_price',
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
            label: 'Impuesto (%)',
            field: 'tax_amount',
            sort(t) {
                return t
            },
            format(value) {
                return accounting.formatNumber(value);
            },
            type: 'string',
            width: '50px'
        },
        {
            label: 'Cantidad',
            field: 'quantity',
            sort(t) {
                return t
            },
            type: 'string',
            width: '50px'
        },
        {
            label: 'Observaciones',
            field: 'observations',
            sort(t) {
                return t
            },
            type: 'string',
            width: '90px'
        },
        {
            label: 'Total',
            field: 'total_with_taxes',
            sort(t) {
                return t
            },
            format(value) {
                return accounting.formatMoney(value);
            },
            type: 'string',
            width: '80px'
        }
    ]
}


</script>

