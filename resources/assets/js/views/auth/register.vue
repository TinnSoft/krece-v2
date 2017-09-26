<template>
  <div class="layout-padding row justify-center">
  
    <div style="width: 400px; max-width: 90vw;">
      <form @submit.prevent="register" @keydown="form.errors.clear($event.target.name)">
        <q-list>
          <q-list-header>ESTAS A UN PASO DE KRECER</q-list-header>
  
          <q-item>
            <q-item-main>
              <q-input v-model="form.email" type="email" :error="form.errors.has('email')" float-label="Tu correo" clearable />
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-main>
              <q-input v-model="form.name" type="text" :error="form.errors.has('name')" float-label="Nombre de tu negocio" clearable />
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-main>
              <q-input v-model="form.password" type="password" :error="form.errors.has('password')" float-label="Tu Contraseña" />
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-main>
              <q-input v-model="form.password_confirmation" type="password" :error="form.errors.has('password_confirmation')" float-label="Confirma Tu Contraseña" />
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-main>
              <q-btn color="secondary" class="full-width">Empezar</q-btn>
            </q-item-main>
          </q-item>
  
          <q-item>
            <q-item-main>
              <small> Ya tienes una cuenta?
                <router-link :to="{ name: 'auth.login' }" active-class="active">
                  <a>Inicia AQUÏ</a>
                </router-link>
              </small>
            </q-item-main>
          </q-item>
          
  
        </q-list>
        <q-alert v-if="form.errors.has('email')" color="red" icon="warning" enter="bounceInRight" leave="bounceOutLeft" appear dismissible>
          Porfavor revise las credenciales que ingresó, ya que no son válidas...
        </q-alert>
      </form>
  
    </div>
  </div>
</template>
<script>
import Form from 'vform'
import {
  QLayout, QIcon, QToolbarTitle, QToolbar, QInput, QList, QBtn, QListHeader, QItem, QItemMain, QItemSide, QField, QAlert
} from 'quasar-framework';
import { required, email } from 'vuelidate/lib/validators'
import { Alert } from 'quasar-framework'
import 'quasar-extras/animate/bounceInRight.css'
import 'quasar-extras/animate/bounceOutLeft.css'

export default {
  name: 'Registro',

  metaInfo: { titleTemplate: '%s' },

  data: () => ({
    form: new Form({
      name: '',
      email: '',
      password: '',
      password_confirmation: ''
    })
  }),
  components: {
    QLayout, QToolbarTitle, QToolbar, QInput, QIcon, QList, QBtn, QListHeader, QItem, QItemMain, QItemSide, QField, QAlert
  },
  validations: {
    email: { required, email }
  },
  methods: {
    register() {
      this.form.post('/api/register')
        .then(() => this.login())
    },

    login() {
      this.form.post('/api/login')
        .then(({ data: { token } }) => {
          this.$store.dispatch('saveToken', { token })

          this.$store.dispatch('fetchUser').then(() => {
            this.$router.push({ name: 'home' })
          })
        })
    }
  }
}
</script>
