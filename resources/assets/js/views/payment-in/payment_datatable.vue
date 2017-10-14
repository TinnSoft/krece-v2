<template>
    <div>
        <q-data-table :data="qdata" :config="config" :columns="columns">
            <template slot="col-amount_receipt" slot-scope="cell">
                <q-input color="secondary" class="no-margin no-padding" @change="onChange" type="number" prefix="$" v-model="qdata[cell.row.__index].amount_receipt" :value="qdata[cell.row.__index].amount_receipt" />
            </template>

            <template slot="col-tax_id" slot-scope="cell">
                <q-select color="secondary" class="no-margin no-padding" float-label="Seleccione" v-model="qdata[cell.row.__index].tax_id" :options="taxlist" />
            </template>

            <template slot="col-category_id" slot-scope="cell">
                <q-select color="secondary" filter filter-placeholder="Buscar" class="no-margin no-padding" float-label="Seleccione" v-model="qdata[cell.row.__index].category_id" :options="categorylist" />
            </template>

            <template slot="col-unit_price" slot-scope="cell">
                <q-input color="secondary" class="no-margin no-padding" @change="onChange" type="number" prefix="$" v-model="qdata[cell.row.__index].unit_price" :value="qdata[cell.row.__index].unit_price" />
            </template>

            <template slot="col-quantity" slot-scope="cell">
                <q-input color="secondary" class="no-margin no-padding" @change="onChange" type="number" v-model="qdata[cell.row.__index].quantity" />
            </template>

            <template slot="col-observations" slot-scope="cell">
                <q-input color="secondary" class="no-margin no-padding" placeholder="Observaciones" v-model="qdata[cell.row.__index].observations" />
            </template>
            
            <template slot="col-ctotal" slot-scope="cell">
                <q-input :value="ftotal(qdata[cell.row.__index])" disable />
            </template>

            <template slot="col-actions" slot-scope="cell">
                <q-btn flat color="red" small v-bind:style="styleButton" @click="deleteRow(cell)">
                    <q-icon name="delete" size="24px" />
                    <q-tooltip>
                        Eliminar fila
                    </q-tooltip>
                </q-btn>
            </template>

        </q-data-table>
        <q-btn flat color="red" push @click="addline()" small>
            <q-icon name="add" /> Nueva línea
        </q-btn>

        <q-stepper-navigation>
            <q-btn color="secondary" flat @click="refstepper.previous()">Regresar</q-btn>
            <q-btn color="secondary" @click="submit()" v-model="isProcessing" loader>Guardar
                <span slot="loading">
                    <q-spinner-hourglass class="on-left" /> Guardando...
                </span>
            </q-btn>
        </q-stepper-navigation>
    </div>
</template>

<script>
import {
    QDataTable, QInput, QBtn, QStepperNavigation, QSpinnerHourglass, Toast, QSelect, QIcon, QTooltip
} from 'quasar-framework'

import accounting from 'accounting';
import axios from 'axios'

function invoiceColumns() {
    return [
        {
            label: '# Factura',
            field: 'resolution_id',
            width: '60px',
            type: 'text'
        },
        {
            label: 'Total',
            field: 'total',
            format(value) {
                return accounting.formatMoney(value);
            },
            type: 'string',
            width: '90px'
        },
        {
            label: 'Pagado',
            field: 'total_payed',
            format(value) {
                return accounting.formatMoney(value);
            },
            width: '90px',
            type: 'string',
        },
        {
            label: 'Por Pagar',
            field: 'total_pending_by_payment',
            format(value) {
                return accounting.formatMoney(value);
            },
            width: '90px',
            type: 'string',
        },
        {
            label: 'Valor Recibido',
            field: 'amount_receipt',
            format(value) {
                return value;
            },
            width: '120px',
            type: 'number',
        },
    ]
};

function categoryColumns() {
    return [
        {
            label: 'Categoría',
            field: 'category_id',
            width: '100px',
            type: 'text'
        },
        {
            label: 'Valor',
            field: 'unit_price',
            width: '70px',
            type: 'text'
        },
        {
            label: 'Impuesto',
            field: 'tax_id',
            width: '50px',
            type: 'text'
        },
        {
            label: 'Cantidad',
            field: 'quantity',
            width: '50px',
            type: 'text'
        },
        {
            label: 'Observaciones',
            field: 'observations',
            width: '70px',
            type: 'text'
        },
        {
            label: 'Total',
            field: 'ctotal',
            width: '70px',
            type: 'text'
        },
        {
            label: '',
            field: 'actions',
            width: '20px',
            type: 'text'
        }
    ]
};

export default {
    props: {
        qdata: {
            type: Array,
            default: () => []
        },
        refstepper: {},
        sourceForm: {},
        isInvoice: {},
        categorylist: { type: Array, default: () => [] },
        taxlist: { type: Array, default: () => [] }
    },
    methods: {
        deleteRow(cell) {
            var vm = this;
            vm.qdata.splice(cell.row.__index, 1)
        },
        addline() {
            this.qdata.push({
                category_id: '',
                unit_price: 0,
                tax_id: '',
                quantity: 1,
                observations: '',
                total: 0,
            })
        },
        ftotal(val) {
            var total = 0;
            if (val) {
                total = val.quantity * val.unit_price;
            }
            return accounting.formatMoney(total);
        },
        onChange(newVal) {
            this.$emit('change', newVal)
        },
        submit() {

            this.$set(this, 'form', this.sourceForm)
            this.$set(this.form, 'isInvoice', this.isInvoice)

            if (this.isInvoice === 1) {
                this.$delete(vm.form, 'payment_in_to_category', []);
                this.$set(this.form, 'pending_payment_in', this.qdata)
            }
            else {
                this.$delete(this.form, 'pending_payment_in', []);
                this.$set(this.form, 'payment_in_to_category', this.qdata)
            }
        console.log(this.form)
           this.create();
        },
        create() {
            var vm = this;
            vm.isProcessing = true;

            axios.post('/api' + vm.path, vm.form)
                .then(function(response) {
                    if (response.data.created) {
                        vm.$router.push(vm.path + response.data.id)
                    }
                    vm.isProcessing = false;
                    Toast.create.positive('Se ha creado el pago exitosamente')

                })
                .catch(function(error) {
                    vm.isProcessing = false;
                    // vm.set(vm.$data, 'errors', error.response.data);
                    console.log(error.response)
                    if (error.response.data.message) {
                        Toast.create.negative(error.response.data.message[0])
                    }
                });
        },

        update() {
            var vm = this;
            vm.isProcessing = true;

            axios.put(vm.path + vm.form.id, vm.form)
                .then(function(response) {
                    if (response.data.updated) {
                        vm.$router.push(vm.path + response.data.id)
                    }
                    vm.isProcessing = false;
                })
                .catch(function(error) {
                    vm.isProcessing = false;
                    Vue.set(vm.$data, 'errors', error.response.data);
                })
        }
    },
    created() { 
        if (this.isInvoice === '1') {
            this.columns = invoiceColumns();
        }
        else {
            this.columns = categoryColumns();
        }
    },
    components: {
        QDataTable, QInput, QBtn, QStepperNavigation, QSpinnerHourglass, QSelect, QIcon, QTooltip
    },
    data() {
        return {
            styleButton: {
                border: 0,
                padding: 0
            },
            form: {
            },
            config: {
                refresh: false,
                noHeader: false,
                columnPicker: false,
                leftStickyColumns: 0,
                rightStickyColumns: 0,
                bodyStyle: {
                    maxHeight: '500px'
                },
                rowHeight: '50px',
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
                    noData: 'No hay datos disponibles para mostrar.',
                    noDataAfterFiltering: 'No se encontraron coincidencias con la busqueda. Porfavor revise los valores ingresados.'
                },
            },
            columns: [],
            pagination: true,
            rowHeight: 60,
            bodyHeightProp: 'maxHeight',
            bodyHeight: 500,
            isProcessing: false,
            path: '/payment-in/'
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
}

</script>

