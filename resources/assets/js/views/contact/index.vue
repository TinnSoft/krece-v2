<template>
    <div class="layout-padding docs-tab">

        <q-tabs class="shadow-2" color="green-5">
            <q-tab default slot="title" name="tab-1" label="Clientes" @click="setContactColumn('c')" />
            <q-tab slot="title" name="tab-2" label="Proveedores" @click="setContactColumn('p')" />
            <q-tab slot="title" name="tab-3" label="Vendedores" @click="setContactColumn('s')" />
            <q-tab-pane name="tab-1">
                <q-btn color="secondary" flat @click="openContactModal($refs, true, false,'create')">
                    <q-icon name="add_circle_outline" />NUEVO CLIENTE
                </q-btn>
                <q-data-table :data="table" :config="config" :columns="columns">
                    <template slot="col-actions" scope="cell">
                        <kButton color="secondary" iconname="edit" tooltiplabel="Editar" @click="editContactModal($refs, cell.row)"></kButton>
                        <kButton color="secondary" iconname="remove_red_eye" tooltiplabel="Ver" @click="show(cell)"></kButton>
                        <kButton color="red" iconname="delete" tooltiplabel="Eliminar" @click="remove(cell,'c')"></kButton>
                    </template>
                </q-data-table>
            </q-tab-pane>
            <q-tab-pane name="tab-2">
                <q-btn color="secondary" flat @click="openContactModal($refs, false, true,'create')">
                    <q-icon name="add_circle_outline" />NUEVO PROVEEDOR
                </q-btn>
                <q-data-table :data="table" :config="config" :columns="columns">
                    <template slot="col-actions" scope="cell">
                        <kButton color="secondary" iconname="edit" tooltiplabel="Editar" @click="editContactModal($refs, cell.row)"></kButton>
                        <kButton color="secondary" iconname="remove_red_eye" tooltiplabel="Ver" @click="show(cell)"></kButton>
                        <kButton color="red" iconname="delete" tooltiplabel="Eliminar" @click="remove(cell,'p')"></kButton>
                    </template>
                </q-data-table>
            </q-tab-pane>
            <q-tab-pane name="tab-3">
                <q-btn color="secondary" flat @click="openSellerModal($refs,'create')">
                    <q-icon name="add_circle_outline" />NUEVO VENDEDOR
                </q-btn>
                <q-data-table :data="table" :config="config" :columns="columns">
                    <template slot="col-actions" scope="cell">
                        <kButton color="secondary" iconname="edit" tooltiplabel="Editar" @click="editSellerModal($refs,'edit',cell.row)"></kButton>
                        <kButton color="red" iconname="delete" tooltiplabel="Eliminar" @click="deleteRow(cell)"></kButton>
                    </template>
                </q-data-table>
            </q-tab-pane>
            <q-inner-loading :visible="isProcessing">
                <q-spinner-mat size="50px" color="teal-4" />Espere por favor...
            </q-inner-loading>
        </q-tabs>
        <contactModal ref="_contact" @close="closeContactModal"></contactModal>
        <sellerModal ref="_seller" @close="closeSellerModal"></sellerModal>
    </div>
</template>

<script>
import kButton from '../../components/tables/Button.vue'

import {
    QTabs, QTab, QTabPane, QDataTable, QBtn, QIcon, QInnerLoading, QSpinnerMat, Toast
} from 'quasar-framework';

import axios from 'axios';

import contactModal from './modals/Contact.vue'
import sellerModal from './modals/Seller.vue'

export default {
    components: {
        QTabs, QTab, QTabPane, QDataTable, QBtn, QIcon, kButton, contactModal, sellerModal,
        QInnerLoading, QSpinnerMat, Toast
    },
    methods: {
         show(cell) {
            this.$router.push(`/${this.model}/${cell.row.public_id}`)
        },
        //Evento disparado al cerrar el modal de contacto
        closeContactModal() {
            this.fetchData(this.customerType);
        },
        closeSellerModal() {
            this.fetchData('s');
        },
        editContactModal(refs, cell) {
            this.openContactModal(refs, cell.isCustomer, cell.isProvider, 'edit', cell.id);
        },
        openContactModal(refs, isCustomer, isProvider, processType, customerId) {
            if (isCustomer === true) {
                this.customerType = 'c'
            }
            if (isProvider === true) {
                this.customerType = 'p'
            }

            refs._contact.open(isCustomer, isProvider, processType, customerId);
        },
        editSellerModal(refs, processType, cell) {
            this.openSellerModal(refs, processType, cell.id);
        },
        openSellerModal(refs, processType, sellerid) {
            refs._seller.open(processType, sellerid);
        },
        setContactColumn(filter) {
            this.fetchData(filter);
            if (filter === 's') {
                this.columns = sellerColumns();
            }
            else {
                this.columns = contactColumns();
            }
        },
        fetchData(filter) {
            var vm = this;
            if (filter) {
                vm.isProcessing = true;
                vm.config.messages.noData = 'Cargando...'
                axios.get(`/api/${vm.path}/${filter}`)
                    .then(function(response) {
                        //console.log(response.data);
                        vm.$set(vm, 'table', response.data.records)
                        vm.isProcessing = false;
                    })
                    .catch(function(error) {
                        vm.isProcessing = false;
                    })

                if (vm.table.length === 0) {
                    vm.config.messages.noData = 'Aún no tienes registros creados'
                }
            }
        },
        remove(val, filter) {
            var vm = this;
            vm.isProcessing = true;
            axios.delete('/api/contact/' + val.row.id)
                .then(function(response) {
                    if (response.data.deleted) {
                        Toast.create.positive('Se eliminó el registro satisfactoriamente')
                        vm.fetchData(filter);
                        vm.isProcessing = false;
                    }
                })
                .catch(function(error) {
                    Toast.create.negative('No fue posible eliminar el registro seleccionado, intente de nuevo.')
                    vm.isProcessing = false;
                })
        }
    },
    created() {
        this.fetchData('c');
        this.columns = contactColumns();
    },
    data() {
        return {
            model:'contact',
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
            columns: [],
            pagination: true,
            rowHeight: 50,
            bodyHeightProp: 'maxHeight',
            bodyHeight: 500,
            path: 'getContactlist'
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

function contactColumns() {
    return [
        {
            label: 'Nombre',
            field: 'name',
            width: '100px',
            sort: true,
            type: 'string'
        },
        {
            label: 'Nit',
            field: 'nit',
            width: '70px',
        },
        {
            label: 'Teléfono',
            field: 'phone_mobile',
            width: '70px',
        },
        {
            label: 'Observaciones',
            field: 'observation',
            type: 'string',
            width: '70px'
        },
        {
            label: 'Acciones',
            field: 'actions',
            type: 'string',
            width: '60px'
        }
    ]
}

function sellerColumns() {
    return [
        {
            label: 'Nombre',
            field: 'name',
            width: '100px',
            sort: true,
            type: 'string'
        },
        {
            label: 'Identificación',
            field: 'dni',
            width: '80px',
        },
        {
            label: 'Teléfono de trabajo',
            field: 'work_phone',
            width: '80px',
        },
        {
            label: 'Teléfono privado',
            field: 'private_phone',
            width: '80px',
        },
        {
            label: 'Observaciones',
            field: 'observations',
            type: 'string',
            width: '80px'
        },
        {
            label: 'Acciones',
            field: 'actions',
            type: 'string',
            width: '60px'
        }
    ]
}


</script>

<style lang="stylus">
.docs-tab .q-tabs
  margin-bottom 15px
</style>