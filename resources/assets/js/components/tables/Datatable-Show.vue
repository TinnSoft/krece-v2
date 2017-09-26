<template>
    <q-data-table :data="qdata" :config="config" :columns="columns">
    </q-data-table>
</template>
<script type="text/javascript">
import {
    QDataTable
} from 'quasar-framework'

import accounting from 'accounting'


export default {
    components: {
        QDataTable
    },
    props: ['qdata','module'],
    data() {
        return {
            estimate: {},
            config: {
                refresh: false,
                noHeader: false,
                columnPicker: false,
                leftStickyColumns: 0,
                rightStickyColumns: 2,
                bodyStyle: {
                    maxHeight: '500px'
                },
                rowHeight: '35px',
                responsive: true,
                pagination: {
                    rowsPerPage: 10,
                    options: [5, 10, 15, 30, 50, 500]
                },
                //selection: 'none',
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
                    noData: 'Lo sentimos...! No hay datos disponibles para mostrar.',
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
    },
    created(){
        if (this.module==='outcome')
        {
             this.columns=OutcomeColumns();
        }
        else
        {
            this.columns=IncomeColumns();
        }
    },
    methods: {

    }
}

function OutcomeColumns() {
    return [
        {
            label: 'Categoría',
            field: 'category',
            format(value) {
                return value.name
            },
            width: '140px',
            type: 'text'
        },
        {
            label: 'Precio',
            field: 'unit_price',
            format(value) {
                return accounting.formatMoney(value);
            },
            type: 'string',
            width: '70px'
        },
        {
            label: 'Cantidad',
            field: 'quantity',
            width: '50px',
            type: 'string',
        },
        {
            label: 'Descuento',
            field: 'discount',
            width: '50px',
            type: 'string',
        },
        {
            label: 'Impuesto',
            field: 'tax_amount',
            width: '50px',
            type: 'string',
        },
        {
            label: 'Total',
            field: 'total',
            format(value) {
                return accounting.formatMoney(value);
            },
            type: 'string',
            width: '70px'
        },
    ]
}


function IncomeColumns() {
    return [
        {
            label: 'Producto',
            field: 'product',
            format(value) {
                return value.name
            },
            width: '140px',
            type: 'text'
        },
        {
            label: 'Precio',
            field: 'unit_price',
            format(value) {
                return accounting.formatMoney(value);
            },
            type: 'string',
            width: '70px'
        },
        {
            label: 'Cantidad',
            field: 'quantity',
            width: '50px',
            type: 'string',
        },
        {
            label: 'Descuento',
            field: 'discount',
            width: '50px',
            type: 'string',
        },
        {
            label: 'Impuesto',
            field: 'tax_amount',
            width: '50px',
            type: 'string',
        },
        {
            label: 'Total',
            field: 'total',
            format(value) {
                return accounting.formatMoney(value);
            },
            type: 'string',
            width: '70px'
        },
    ]
}

</script>
