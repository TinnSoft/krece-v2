<template>
    <div class="layout-padding">

        <q-tabs inverted color="green-5">
            <q-tab default slot="title" name="tab-1" label="GENERAL" />
            <q-tab slot="title" name="tab-2" label="FACTURAS" />
            <q-tab-pane color="green" name="tab-1">
                <div class="quote">
                    A continuación puedes cambiar el consecutivo de la numeración para cada uno de los documentos creados
                </div>

                <q-field v-for="(item, index) in form" :key="index">
                    <q-input class="no-margin no-padding" color="green" type="number" v-model="item.number" :float-label="item.text" />

                </q-field>

                <br>
                <q-btn class="within-iframe-hide" color="green" @click="update">
                    <q-icon name="update" /> ACTUALIZAR
                </q-btn>
            </q-tab-pane>
            <q-tab-pane name="tab-2">

                <q-btn color="green" small @click="openNumerationModal($refs)">
                    <q-icon name="add_circle_outline" />NUEVA NUMERACIÓN
                </q-btn>
                <br>
                <br>
                <q-data-table :data="table" :config="config" :columns="columns">
                    <template slot="col-actions" slot-scope="cell">
                        <kToggle @blur="lockUnlock(cell.row, $refs)" :isActive="cell.row.isActive"></kToggle>
                        <kButton color="secondary" iconname="edit" tooltiplabel="Editar" @click="editNumerationModal($refs, cell.row)"></kButton>
                        <kButton color="red" iconname="delete" tooltiplabel="Eliminar" @click="remove(cell)"></kButton>
                    </template>
                </q-data-table>
            </q-tab-pane>

            <q-inner-loading :visible="isProcessing">
                <q-spinner-mat size="50px" color="teal-4" />Espere por favor...
            </q-inner-loading>
        </q-tabs>

        <br>
        <numerationModal ref="_numeration" @close="closeNumerationModal"></numerationModal>
    </div>
</template>

<script>
import {
    QInput, QBtn, QIcon, Toast, QField, QDataTable,
    QSelect, QTabs, QTab, QTabPane, QInnerLoading, QSpinnerMat
} from 'quasar-framework'


import axios from 'axios'
import kButton from '../../components/tables/Button.vue'
import kToggle from '../../components/tables/Toggle.vue'
import store from '../../store'
import numerationModal from './modals/mNumeration.vue'

export default {
    components: {
        QInput, QBtn, QIcon, Toast, QField, kButton, QDataTable, kToggle,
        QSelect, QTabs, QTab, QTabPane, QInnerLoading, QSpinnerMat, numerationModal
    },
    created() {

        this.fetchData();

    },
    data() {
        return {
            isProcessing: false,
            pathToUpdate: '/api/update_numeration/1',
            path: `resolutionAll`,
            regime: [{ label: '', value: '' }],
            form: [{ id: '', key: '', number: '', text: '' }],
            invoice_number: [],
            pathResolutionInvoice: 'resolution_InvoiceNumbers',
            modulename: 'resolution',
            warningmessage: 'Estas a punto de eliminar la numeración # ',
            pathToUpdateState: 'resolution_update_state',
            config: {
                isProcessing: false,
                customerType: null,
                refresh: false,
                noHeader: false,
                columnPicker: false,
                leftStickyColumns: 0,
                rightStickyColumns: 0,
                bodyStyle: {
                    maxHeight: '500px'
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
            table: [],
            columns: [
                {
                    label: 'Nombre',
                    field: 'name',
                    width: '70px',
                    sort: true,
                    type: 'string'
                },
                {
                    label: 'Prefijo',
                    field: 'prefix',
                    width: '50px',
                },
                {
                    label: '# Inicial',
                    classes: 'bg-yellow-1',
                    field: 'initial_number',
                    width: '50px',
                },
                {
                    label: '# siguiente',
                    classes: 'bg-orange-1',
                    field: 'next_invoice_number',
                    width: '50px',
                },
                {
                    label: 'Preferido',
                    field: 'isDefault',
                    format(value) {
                        if (value === 1) {
                            return 'Si'
                        }
                        return 'No'
                    },
                    type: 'string',
                    width: '50px'
                },
                {
                    label: 'Acciones',
                    field: 'actions',
                    type: 'string',
                    width: '70px'
                }
            ],
            pagination: true,
            rowHeight: 50,
            bodyHeightProp: 'maxHeight',
            bodyHeight: 500,
        }
    },
    computed: {
        canSave() {
            if (this.form.name) {
                return true
            }
            return false
        }
    },
    methods: {
        remove(val) {
          var vm = this;
            vm.isProcessing = true;
            axios.delete('/api/resolution/' + val.row.id)
                .then(function(response) {
                    if (response.data.deleted) {
                        Toast.create.positive('Se eliminó el registro satisfactoriamente')
                        vm.fetchData();
                        vm.isProcessing = false;
                    }
                })
                .catch(function(error) {
                    Toast.create.negative('No fue posible eliminar el registro seleccionado, intente de nuevo.')
                    vm.isProcessing = false;
                })
        },
        openNumerationModal(refs, processType, id) {
            refs._numeration.open(processType, id);
        },
        closeNumerationModal() {
            this.fetchData();
        },
        lockUnlock(cell, ref) {

            var _path = `/api/${this.pathToUpdateState}/${cell.id}`
            var xstatus = { isActive: null };

            if (cell.isActive === 0) {
                xstatus.isActive = 1;
            }
            else {
                xstatus.isActive = 0;
            }

            this.submit(_path, xstatus);
        },
        editNumerationModal(refs, cell) {
            this.openNumerationModal(refs, 'edit', cell.id);
        },
        fetchData() {
            var vm = this;
            vm.isProcessing = true;
            axios.get(`/api/${vm.path}`)
                .then(function(response) {
                    vm.$set(vm.$data, 'form', response.data.form)
                    vm.$set(vm.$data, 'table', response.data.invoice)
                    vm.isProcessing = false;
                })
                .catch(function(error) {
                    vm.isProcessing = false;
                })
        },
        update() {
            this.submit(this.pathToUpdate, this.form);
        },
        submit(path, request) {

            var vm = this;
            vm.isProcessing = true;
            axios.put(path, request)
                .then(function(response) {
                    if (response.data.updated) {
                        let _msg = 'Registro actualizado correctamente'
                        if (response.data.custom_message) {
                            _msg = response.data.custom_message
                        }
                        Toast.create.positive(_msg);
                        vm.fetchData();
                    }
                    else {
                        let _msg = 'No fue posible completar la operación'
                        if (response.data.custom_message) {
                            _msg = response.data.custom_message
                        }
                        Toast.create.negative(_msg);
                    }

                    vm.isProcessing = false;
                })
                .catch(function(error) {
                    Toast.create.negative('No se ha podido actualizar el registro, intente de nuevo.');
                    vm.isProcessing = false;
                })

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
</script>
