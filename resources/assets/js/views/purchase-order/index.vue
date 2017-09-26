<template>
    <div class="layout-padding">

        <q-toolbar inverted color="secondary">

            <q-toolbar-title>
                <h5 class="desktop-only">
                    <b>ORDENES DE COMPRA</b>
                </h5>
                 <h6 class="mobile-only">
                    <b>ORDENES DE COMPRA</b>
                </h6>
            </q-toolbar-title>

            <q-btn flat @click="$router.push('/purchase-order/create')">
                <q-icon name="add_circle_outline" />NUEVA ORDEN

                </q-btn>
        </q-toolbar>

        <kDatatable :path="path" :kmodule="modulename" :mwarning="warningmessage" :pathemaildata="pathEmailData" :pathToUpdateState="pathToUpdateState"></kDatatable>
    </div>
</template>

<script>


import {
    QBtn,
    QIcon,
    clone,
    QToolbar,
    QToolbarTitle
} from 'quasar-framework'

import kDatatable from '../../components/tables/Datatable-Index.vue'


export default {

    components: {
        kDatatable,
        QBtn,
        QIcon,
        QToolbar,
        QToolbarTitle
    },
    methods: {

    },  

    data() {
        return {
            path: 'getPOList',
            modulename: 'purchase-order',
            warningmessage: 'Estas a punto de eliminar la Orden de Compra # ',
            pathEmailData: 'getTemplateEmailToCustomerPO',
            pathToUpdateState: ''
        }
    },


}
</script>
