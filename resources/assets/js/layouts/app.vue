<template>
  <MainLayout v-if="authenticated" :title="title" :subtitle="subtitle" :background-color="backgroundcolor" :items="items">
  
  </MainLayout>
  
  <LoginLayout v-else :title="title" :subtitle="subtitle" :background-color="backgroundcolor">
  </LoginLayout>
</template>

<script>
import { mapGetters } from 'vuex'

import LoginLayout from './_login.vue';
import MainLayout from './_main.vue';

export default {
  data: function () {
    return {

      title: window.config.appName,
      subtitle: 'Sistema de facturación en la nube',
      backgroundcolor: 'green',
      items: [
        {
          icon: 'dashboard',
          title: 'INICIO',
          path: '/',
          type: 'alone',
          active: true,
        },
        {
          icon: 'trending_up',
          title: 'MIS VENTAS',
          path: '/2',
          items: [
            { title: 'Factura de venta', path: '/invoice', },
            { title: 'Pagos recibidos', path: '/payment-in' },
            { title: 'Notas crédito', path: '/credit-note' },
            { title: 'Cotizaciones', path: '/estimate' },
            { title: 'Remisiones', path: '/remision' }
          ]
        },
        {
          icon: 'local_atm',
          title: 'MIS COMPRAS',
          path: '/3',
          items: [
            { title: 'Pagos', path: '/payment-out' },
            { title: 'Factura proveedores', path: '/bill' },
            { title: 'Notas débito', path: '/debit-note' },
            { title: 'Ordenes de compra', path: '/purchase-order' }
          ]
        },
        {
          icon: 'people',
          title: 'CONTACTOS',
          path: '/contact',
          type: 'alone'
        },
        {
          icon: 'local_mall',
          title: 'INVENTARIO',
          path: '/config2',
          type: 'alone'
        },
        {
          icon: 'business',
          title: 'BANCOS',
          path: '/config3',
          type: 'alone'
        },
        {
          icon: 'library_books',
          title: 'CATEGORIAS',
          path: '/config4',
          type: 'alone'
        },
        {
          icon: 'build',
          title: 'CONFIGURACIÓN',
          path: '/settings',
          type: 'alone'
        },
        {
          icon: 'pie_chart',
          title: 'REPORTES',
          path: '/config6',
          type: 'alone'
        }
      ]
    };
  },
  //name: 'app-layout',

  computed: mapGetters({
    user: 'authUser',
    authenticated: 'authCheck'
  }),
  components: {
    LoginLayout, MainLayout
  },
  methods: {
  }
}
</script>
