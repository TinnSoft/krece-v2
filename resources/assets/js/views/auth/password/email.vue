<template>

<div class="layout-padding row justify-center">
  
    <div style="width: 400px; max-width: 90vw;">
      <form @submit.prevent="send" @keydown="form.errors.clear($event.target.name)">
        <q-list>
          <q-list-header>RECUPERAR CONTRASEÑA</q-list-header>
  
          <q-item>
            <q-item-main>
              <q-input v-model="form.email" type="email" :error="form.errors.has('email')" float-label="Tu correo" clearable />
            </q-item-main>
          </q-item>
        
          <q-item>
            <q-item-main>
              <q-btn color="secondary" class="full-width">ENVIAR LINK</q-btn>
            </q-item-main>
          </q-item>
  
          <q-item>
            <q-item-main>
              <small> 
                <router-link :to="{ name: 'auth.login' }" active-class="active">
                  <a>Cancelar</a>
                </router-link>
              </small>
            </q-item-main>
          </q-item>
          
  
        </q-list>
        <q-alert v-if="form.errors.has('email')" color="red" icon="warning" enter="bounceInRight" leave="bounceOutLeft" appear dismissible>
          Porfavor revise la información ingresada
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
  metaInfo: { titleTemplate: 'Reset Password | %s' },

  data: () => ({
    status: null,
    form: new Form({ email: '' })
  }),
  components: {
    QLayout, QToolbarTitle, QToolbar, QInput, QIcon, QList, QBtn, QListHeader, QItem, QItemMain, QItemSide, QField, QAlert
  },
  validations: {
    email: { required, email }
  },
  methods: {
    send() {
      this.form.post('/api/password/email')
        .then(({ data: { status } }) => {
          this.form.reset()
          this.status = status
        })
    }
  }
}
</script>
