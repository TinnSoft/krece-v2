<template>
    <div class="layout-padding ">

      
                <p class="caption">
                    <span class="desktop-only">Click</span>
                    <span class="mobile-only">Tap</span>
                    on each type to see an Action Sheet in action.
                </p>

                <q-list style="max-width: 600px;">
                    <q-item link v-for="dialog in types" :key="dialog.label" @click="dialog.handler()" v-ripple.mat>
                        <q-item-side icon="settings" />
                        <q-item-main :label="dialog.label" />
                        <q-item-side right icon="keyboard_arrow_right" />
                    </q-item>
                </q-list>


        <kToolbar toolbarlabel="CUENTA: " :redirectTo="`/${model}`" @click="openBankModal($refs, 'create')" label2="NUEVO BANCO" icon2="add_circle_outline"></kToolbar>

        <q-data-table :data="table" :config="config" :columns="columns">
            <template slot="col-actions" slot-scope="cell">
                <kButton color="secondary" iconname="edit" tooltiplabel="Editar" @click="editBankModal($refs, cell.row)"></kButton>
                <kButton color="secondary" iconname="remove_red_eye" tooltiplabel="Ver" @click="show(cell)"></kButton>
                <kButton color="red" iconname="delete" tooltiplabel="Eliminar" @click="remove(cell)"></kButton>
            </template>
        </q-data-table>

        <bankModal ref="_bank" @close="closeBankModal"></bankModal>

    </div>
</template>

<script>
import kButton from '../../components/tables/Button.vue'

import {
    QTabs, QTab, QTabPane, QDataTable, QBtn, QIcon, QInnerLoading, QSpinnerMat, Toast, QList, QItem, QItemSide, ActionSheet, QItemMain, Ripple
} from 'quasar-framework';

import axios from 'axios';
import accounting from 'accounting'
import bankModal from './modals/Bank.vue'

import kToolbar from '../../components/Toolbar.vue'

export default {
    components: {
        QTabs, QTab, QTabPane, QDataTable, QBtn, QIcon, kButton, bankModal,
        QInnerLoading, QSpinnerMat, Toast, kToolbar, QList, QItem, QItemSide, QItemMain
    },
    directives: {
        Ripple
    },
    methods: {
        show(cell) {
            this.$router.push(`/${this.model}/${cell.row.public_id}`)
        },
        closeBankModal() {
            this.fetchData();
        },
        editBankModal(refs, cell) {
            this.openBankModal(refs, 'edit', cell.id);
        },
        openBankModal(refs, processType, bankid) {
            refs._bank.open(processType, bankid);
        },
        fetchData() {
            var vm = this;

            vm.isProcessing = true;
            vm.config.messages.noData = 'Cargando...'

            axios.get(`/api/${vm.path}`)
                .then(function(response) {
                    vm.$set(vm, 'table', response.data.records)
                    vm.isProcessing = false;
                })
                .catch(function(error) {
                    vm.isProcessing = false;
                })

            if (vm.table.length === 0) {
                vm.config.messages.noData = 'Aún no tienes registros creados'
            }

        },
        remove(val) {
            var vm = this;
            vm.isProcessing = true;
            axios.delete('/api/bank/' + val.row.id)
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
        }
    },
    created() {
        this.fetchData();
        this.columns = bankColumns()
    },
    data() {
        return {
            model: 'bank',
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
            path: 'getBankAccountlist',
            types: [
                {
                    label: 'List with Icons',
                    handler() {
                        showActionSheetWithIcons()
                    }
                }
            ]
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

function bankColumns() {
    return [
        {
            label: 'Nombre de la cuenta',
            field: 'bank_account_name',
            width: '100px',
            sort: true,
            type: 'string'
        },
        {
            label: 'Número de cuenta',
            field: 'bank_account_number',
            width: '70px',
        },
        {
            label: 'Descripción',
            field: 'bank_account',
            format(value) {
                return value.description;
            },
            width: '70px',
        },
        {
            label: 'Saldo',
            field: 'initial_balance',
            format(value) {
                return accounting.formatMoney(value);
            },
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

function showActionSheetWithIcons (gallery) {
  ActionSheet.create({
    title: 'Article Actions',
    gallery: gallery,
    actions: [
      {
        label: 'Delete',
        icon: 'delete',
        handler () {
          Toast.create('Deleted Article')
        }
      },
      {
        label: 'Share',
        icon: 'share',
        handler () {
          Toast.create('Shared!')
        }
      },
      {
        label: 'Play',
        icon: 'gamepad',
        handler () {
          Toast.create('Launched Game')
        }
      },
      {
        label: 'Favorite',
        icon: 'favorite',
        handler () {
          Toast.create('Added to favorites')
        }
      }
    ],
    dismiss: {
      label: 'Cancel',
      handler () {
        Toast.create('Cancelled...')
      }
    }
  })
}


</script>

<style lang="stylus">
</style>