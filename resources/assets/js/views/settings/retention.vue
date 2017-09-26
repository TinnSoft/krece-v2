<template>
    <div class="layout-padding">

        <q-btn color="green" small @click="openModal($refs)">
            <q-icon name="add_circle_outline" />NUEVO TERMINO DE PAGO
        </q-btn>
        <br>
        <br>
        <q-data-table :data="table" :config="config" :columns="columns">
            <template slot="col-actions" scope="cell">               
                <kButton color="secondary" iconname="edit" tooltiplabel="Editar" @click="editModal($refs, cell.row)"></kButton>
                <kButton color="red" iconname="delete" tooltiplabel="Eliminar" @click="remove(cell)"></kButton>
            </template>

            
        </q-data-table>

        <br>
        <q-inner-loading :visible="isProcessing">
                <q-spinner-mat size="50px" color="teal-4" />Espere por favor...
            </q-inner-loading>
        <retentionModal ref="_retention" @close="closeModal"></retentionModal>
    </div>
</template>

<script>
import {
    QInput, QBtn, QIcon, Toast, QField, QDataTable,
     QInnerLoading, QSpinnerMat
} from 'quasar-framework'


import axios from 'axios'
import kButton from '../../components/tables/Button.vue'

import store from '../../store'
import retentionModal from './modals/mRetention.vue'

export default {
    components: {
        QInput, QBtn, QIcon, Toast, QField, kButton, QDataTable, 
         QInnerLoading, QSpinnerMat, retentionModal
    },
    created() {

        this.fetchData();

    },
    data() {
        return {
            isProcessing: false,
            path: `getRetentionList`,
            modulename: 'retention',
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
                    width: '100px',
                    sort: true,
                    type: 'string'
                },
                {
                    label: 'Porcentaje',
                    field: 'value',
                    width: '50px',
                },   
                 {
                    label: 'Tipo',
                    field: 'retention_type',
                    format(value) {                        
                        return value.name
                    },
                    width: '70px',
                },      
                 {  
                    label: 'Descripción',
                    field: 'description',
                    width: '80px',
                },             
                {
                    label: 'Acciones',
                    field: 'actions',
                    type: 'string',
                    width: '50px'
                }
            ],
            pagination: true,
            rowHeight: 50,
            bodyHeightProp: 'maxHeight',
            bodyHeight: 500,
        }
    },
    computed: {
       
    },
    methods: {
        remove(val) {
            var vm = this;
            vm.isProcessing = true;
            axios.delete('/api/retention/' + val.row.id)
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
        openModal(refs, processType, id) {
            refs._retention.open(processType, id);
        },
        closeModal() {
            this.fetchData();
        },
        
        editModal(refs, cell) {
            this.openModal(refs, 'edit', cell.id);
        },
        fetchData() {
            var vm = this;
            vm.isProcessing = true;
            axios.get(`/api/${vm.path}`)
                .then(function(response) {
                    
                        console.log(response.data)
                    vm.$set(vm.$data, 'table', response.data.form)
                    vm.isProcessing = false;
                })
                .catch(function(error) {
                    vm.isProcessing = false;
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
