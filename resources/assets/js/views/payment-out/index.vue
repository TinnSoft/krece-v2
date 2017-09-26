<template>
    <div class="layout-padding">

        <q-toolbar inverted color="secondary">

            <q-toolbar-title>
                <h5>
                    <b>GASTOS</b>
                </h5>
            </q-toolbar-title>

            <q-btn flat @click="$router.push('/payment-out/create')">
                <q-icon name="add_circle_outline" />NUEVO GASTO</q-btn>
        </q-toolbar>

        <kDatatable :path="path" :kmodule="modulename" :mwarning="warningmessage"
        :pathemaildata="pathEmailData" :pathToUpdateState="pathToUpdateState"></kDatatable>
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
            path: 'getPaymentOut_List',
            modulename: 'payment-out',
            warningmessage: 'Estas a punto de eliminar el gasto # ',
            pathEmailData:'getTemplateEmailToCustomerPaymentOut',
            pathToUpdateState:'payment_out_update_state'

        }
    },


}
</script>
