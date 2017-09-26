<template>
    <div class="layout-padding">

        <q-list>
            <q-collapsible label="<strong>Información básica</strong>" icon="location_city" sublabel="Información importante para poder generar las facturas a clientes según normatividad DIAN" opened>
                <div>
                    <q-item>
                        <q-item-side color="grey-5" />
                        <q-item-main>
                            <q-input v-model="form.name" float-label="*Nombre" />
                            <q-input v-model="form.identification" float-label="NIT" />
                            <q-input v-model="form.address" float-label="Dirección" />
                            <q-input v-model="form.city" float-label="Ciudad" />
                            <q-input v-model="form.phone" float-label="Teléfono" />
                            <q-input v-model="form.website" float-label="Sitio Web" />

                        </q-item-main>
                    </q-item>

                </div>
            </q-collapsible>
            <q-collapsible icon="info_outline" label="<strong>Datos adicionales</strong>" sublabel="Configure aquí el tipo de empresa, email, moneda, entre otros">
                <div>
                    <q-item>
                        <q-item-side color="light" />
                        <q-item-main inset>
                            <q-input v-model="form.email" float-label="*Email" />
                            <q-select float-label="*Régimen" v-model="form.regime_id" :options="regime" />
                            <q-input v-model="form.currency" float-label="Moneda" />
                            <q-select float-label="Presición decimal" v-model="form.decimal_precision" :options="decimalPresicionOptions" />
                            <q-select float-label="Separador de decimales para exportar" v-model="form.decimal_separator" :options="decimalSeparatorOptions" />
                        </q-item-main>
                    </q-item>
                </div>
            </q-collapsible>
            <q-collapsible icon="image" label="<strong>Logo</strong>" sublabel="Aquí puedes configurar el logo de tu empresa, el cual será incorporado en los documentos que generes">
                <div>
                    <q-item>
                        <q-item-side color="light" />
                        <q-item-main>
                            <q-item-tile label></q-item-tile>
                            <q-item-tile sublabel>Seleccione una imagen</q-item-tile>
                        </q-item-main>
                    </q-item>

                </div>
            </q-collapsible>
        </q-list>
        <br>
        <q-btn class="within-iframe-hide" color="green" @click="update">
            <q-icon name="add" /> GUARDAR
        </q-btn>
        <q-inner-loading :visible="isProcessing">
            <q-spinner-mat size="50px" color="teal-4" />Espere por favor...
        </q-inner-loading>
    </div>
</template>

<script>
import {
    QInput, QBtn, QIcon, Toast, QItemMain, QItemSide, QItem, QCollapsible, QList, QItemTile,
    QSelect, QInnerLoading, QSpinnerMat
} from 'quasar-framework'

import axios from 'axios'

import store from '../../store'

export default {
    components: {
        QInput, QBtn, QIcon, Toast, QItemMain, QItemSide, QItem, QCollapsible, QList, QItemTile,
        QSelect, QInnerLoading, QSpinnerMat
    },
    created() {

        this.fetchData();

    },
    data() {
        return {
            form: {currency:'COP'},
            pathToUpdate: '/api/account/',
            path: `account/${store.getters.authUser.account_id}/edit`,
            regime: [{ label: '', value: '' }],
            decimalPresicionOptions: [
                { label: '0', value: 0 },
                { label: '1', value: 1 },
                { label: '2', value: 2 },
                { label: '3', value: 3 },
                { label: '4', value: 4 }
            ],
            decimalSeparatorOptions: [
                { label: 'Punto(.)', value: '.' },
                { label: 'Coma(,)', value: ',' },
            ]
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
        fetchData() {
            var vm = this;
            vm.isProcessing = true;
            axios.get(`/api/${vm.path}`)
                .then(function(response) {
                    //console.log(response.data);
                    vm.$set(vm, 'form', response.data.form)
                    vm.$set(vm.form, 'currency', 'COP')
                    vm.$set(vm, 'regime', response.data.regime)
                    vm.isProcessing = false;
                })
                .catch(function(error) {
                    vm.isProcessing = false;
                })


        },
        update() {

            var vm = this;
            axios.put(vm.pathToUpdate + vm.form.id, vm.form)
                .then(function(response) {
                    if (response.data.updated) {
                        Toast.create.positive('Registro actualizado correctamente.');
                    } else {
                    }
                })
                .catch(function(error) {
                    Toast.create.negative('No se ha podido actualizar el registro, intente de nuevo.');
                })

        }
    }
}
</script>
