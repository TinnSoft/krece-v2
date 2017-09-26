<template>
    <div class="layout-padding">

        <q-toolbar inverted color="secondary">
            <q-toolbar-title>
                <h5>
                    <b>NOTA DEBITO No: {{public_id}}</b>
                </h5>

            </q-toolbar-title>

            <q-btn class="within-iframe-hide" color="orange" flat @click="$router.replace(`/${model}`)">
                <q-icon name="keyboard_arrow_left" />REGRESAR
            </q-btn>
            <q-btn class="within-iframe-hide" flat @click="$router.push(`/${model}/create`)">
                <q-icon name="add_circle_outline" />NUEVA NOTA DEBITO
            </q-btn>

        </q-toolbar>
        <div class="row justify-center mobile-only">
            <div style="width: 500px; max-width: 90vw;">
                <q-fixed-position corner="top-right" :offset="[16, 16]">
                    <q-btn round color="secondary" @click="mobileMenu($refs)" icon="add" class="animate-pop" />
                </q-fixed-position>
            </div>
        </div>
        <q-fixed-position class="desktop-only" corner="top-right" :offset="[16, 16]">
            <q-fab color="secondary" active-icon="close" direction="down" class="animate-pop">
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
                        <q-input v-model="contactname" disable stack-label="Cliente" />
                        <q-input v-model="data.observations" type="textarea" disable stack-label="Observaciones" />                        
                        
                    </q-list>
                </div>
                <div class="col-sm-1">
                </div>
                <div class="col-sm-5">
                    <q-list style="border: 0;padding: 0">
                        <q-input v-model="data.date" disable stack-label="Fecha de creación" />
                        <q-input v-model="data.currency_code" disable stack-label="Moneda" />                      
                        <q-btn flat class="within-iframe-hide" color="positive" flat @click="LoadFiles($refs)">
                            <q-icon size="1rem" name="attach_file" />
                            <small style='text-decoration: underline'>Gestionar Documentos</small>
                        </q-btn>
                    </q-list>
                </div>
            </div>

        </div>
        <datatableShow :qdata="table" module="outcome"></datatableShow>
        <totals :subtotal="data.sub_total" :discounts="data.total_discounts" :taxes="totalTaxes" :total="data.total" :isTaxArray="true" ></totals>
        
        <attachfiles ref="_attachfile"></attachfiles>
    </div>
</template>

<script>
import {
    QInput, QField, QSlider,
    QBtn, QIcon, QTooltip,
    clone, QToolbar, QToolbarTitle,
    QItemSeparator, QFixedPosition,
    QFab, QFabAction, QList, QModal,
    ActionSheet, Ripple
} from 'quasar-framework'

import totals from '../../components/tables/Total.vue'

import axios from 'axios'
import moment from 'moment'
moment.locale('es');

import datatableShow from '../../components/tables/Datatable-Show.vue'
import attachfiles from '../../components/modals/AttachFiles.vue'



function showActionSheetWithIcons(vm, ref) {
    ActionSheet.create({
        title: 'Otras acciones',
        galery: true,
        actions: [
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
        QSlider, QBtn, QIcon,
        QTooltip, QToolbar, QField,
        QToolbarTitle, QItemSeparator,
        QFixedPosition, QFab, 
        QFabAction, QList, QModal, attachfiles
    },
    created() {
        this.fetchData();
    },
    data() {
        return {
            model: 'debit-note',
            path: `debit-note/${this.$route.params.id}`,
            data: {},
            listprice: '',
            contactname: '',
            seller: '',
            totalTaxes: 0,
            table: [],
            pathEmailData: ''
        }
    },
    watch: {
        '$route': 'fetchData',
    },
    computed: {
        public_id() {
            return this.$route.params.id
        }
    },
    methods: {
        mobileMenu(ref) {
            showActionSheetWithIcons(this, ref)
        },
        LoadFiles(refs) {
            refs._attachfile.open(this.$route.params.id, this.model);
        },
        email(refs) {
            refs._sendEmail.open(this.$route.params.id, this.pathEmailData, this.model);
        },
        edit() {
            this.$router.push(`/${this.path}/edit`)
        },
        pdf() {
            window.open(`/api/${this.model}/${this.public_id} /pdf`, '_blank');
        },
        fetchData() {
            var vm = this;
            axios.get(`/api/${this.path}`)
                .then(function(response) {
                    console.log(response.data)
                    vm.$set(vm, 'data', response.data.model)
                    vm.$set(vm, 'totalTaxes', response.data.totalTaxes)
                    if (vm.data.contact) {
                        vm.$set(vm, 'contactname', vm.data.contact.name)
                    }
                    vm.$set(vm, 'table', vm.data.detail)
                })
                .catch(function(error) {
                    // console.log(error);
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
