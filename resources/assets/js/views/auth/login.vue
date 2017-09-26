<template>
  <div class="layout-padding row justify-center">

    <div style="width: 400px; max-width: 90vw;">
      <form @submit.prevent="login" @keydown="form.errors.clear($event.target.name)">
        <q-list>
          <q-list-header> INGRESE SUS CREDENCIALES</q-list-header>

          <q-item>
            <q-item-main>
              <q-input v-model="form.email" type="email" :error="form.errors.has('email')" float-label="Tu correo" clearable />
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-main>
              <q-input v-model="form.password" type="password" :error="form.errors.has('password')" float-label="Tu Contraseña" />
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-main>
              <q-btn v-model="progress" loader color="secondary" class="full-width">
                Ingresar
                <span slot="loading">
                  <q-spinner-hourglass class="on-left" /> Cargando...
                </span>
              </q-btn>

            </q-item-main>
          </q-item>

          <q-item>
            <q-item-main>
              <small> Aún no tienes una cuenta?
                <router-link :to="{ name: 'auth.register' }" active-class="active">
                  <a>Empieza ya mismo</a>
                </router-link>
              </small>
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-main>
              <small>
                <router-link :to="{ name: 'password.request' }">Olvidaste la contraseña?</router-link>
              </small>
            </q-item-main>
          </q-item>

        </q-list>
        <q-alert v-if="form.errors.has('email')" color="red" icon="warning" enter="bounceInRight" leave="bounceOutLeft" appear dismissible>
          Porfavor revise las credenciales que ingresó
        </q-alert>
      </form>

    </div>
  </div>
</template>

<script>
import Form from 'vform'
import { required, email } from 'vuelidate/lib/validators'
import { Alert } from 'quasar-framework'
import 'quasar-extras/animate/bounceInRight.css'
import 'quasar-extras/animate/bounceOutLeft.css'
import axios from 'axios'

import {
  QLayout, QIcon, QToolbarTitle, QToolbar, QInput, QSpinnerHourglass,
  QList, QBtn, QListHeader, QItem, QItemMain, QItemSide, QField, QAlert
} from 'quasar-framework';


export default {
  name: 'login',

  metaInfo: { titleTemplate: 'Iniciar sesion' },

  data: () => ({
    form: new Form({
      email: '',
      password: '',
      remember: false
    }),
    progress: false,
  }),
  components: {
    QLayout, QToolbarTitle, QToolbar, QInput, QIcon, QList, QBtn, QSpinnerHourglass,
    QListHeader, QItem, QItemMain, QItemSide, QField, QAlert
  },
  validations: {
    email: { required, email }
  },
  methods: {    
    async login() {
      var vm = this;
      vm.progress = true;

      this.form.post('/api/login')
        .then(({ data }) => {
          vm.progress = false;
         // console.log('login')
          vm.$store.dispatch('saveToken', {
            token: data.token,
            remember: vm.form.remember
          })
          vm.$store.dispatch('fetchUser').then(() => {
            vm.$router.push({ name: 'home' })
          })

        }).catch(function(error) {
         // console.log(error.response)
          vm.progress = false;
        });
    }
    
  }
}
</script>
