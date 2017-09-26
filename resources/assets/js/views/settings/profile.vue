<template>
    <div class="layout-padding">

        <q-input  v-model="form.name" float-label="*Nombre" />
        <q-input  v-model="form.last_name" float-label="Apellido" />
        <q-input  v-model="form.email" float-label="*Email" />
        <q-btn class="within-iframe-hide" color="green" @click="update">
            <q-icon name="add" /> GUARDAR
        </q-btn>
    </div>
</template>

<script>
import {
    QInput, QBtn, QIcon, Toast
} from 'quasar-framework'

import axios from 'axios'

import store from '../../store'

export default {
    components: {
        QInput, QBtn, QIcon, Toast
    },
    created() {
        try {
            this.$set(this.$data.form, 'id', store.getters.authUser.id);
            this.$set(this.$data.form, 'name', store.getters.authUser.name);
            this.$set(this.$data.form, 'email', store.getters.authUser.email);
            this.$set(this.$data.form, 'last_name', store.getters.authUser.last_name);
        }
        catch (e) {

        }
    },
    data() {
        return {
            form: {},
            path: '/api/profile/',
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

        update() {
            var vm = this;
            axios.put(vm.path + vm.form.id, vm.form)
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
