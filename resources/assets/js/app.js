import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import ZkTable from 'vue-table-with-tree-grid'
Vue.use(ZkTable)

require('quasar-extras/roboto-font')
require('quasar-framework/dist/quasar.mat.css')
import Quasar from 'quasar-framework'
Vue.use(Quasar)

require('vue-multiselect/dist/vue-multiselect.min.css')

import 'quasar-extras/material-icons'
require(`quasar-framework/dist/quasar.ie`)
require(`quasar-framework/dist/quasar.ie.mat.css`)

import Meta from 'vue-meta'
Vue.use(Meta)

import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)

import './components'
import './utils/interceptors'
Vue.config.productionTip = false

import { sync } from 'vuex-router-sync'

import store from './store'
import routes from './router/index'
import App from './components/App.vue'
import makeRouter from './utils/router'

const router = makeRouter(routes)

sync(store, router)

new Vue({
  store,
  router,
  ...App,
  el: '#app'
})
