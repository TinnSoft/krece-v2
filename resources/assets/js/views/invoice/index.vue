<template>
    <div class="layout-padding">

        <kToolbar toolbarlabel="FACTURAS DE VENTA" :showbackButton="false"  @click="$router.push(`/${modulename}/create`)"
        label2="NUEVA FACTURA DE VENTA" icon2="add_circle_outline"></kToolbar>     


        <kDatatable :path="path" :kmodule="modulename" :mwarning="warningmessage"
        :pathemaildata="pathEmailData" :pathToUpdateState="pathToUpdateState"></kDatatable>
    </div>
</template>

<script>


import kDatatable from '../../components/tables/Datatable-Index.vue'
import kToolbar from '../../components/Toolbar.vue'

export default {
   
    components: {
        kDatatable,kToolbar
    },
    methods: {

    },

    data() {
        return {
            path: 'getInvoiceList',
            modulename: 'invoice',
            warningmessage: 'Estas a punto de eliminar la Factura de venta # ',
            pathEmailData:'getTemplateEmailToCustomerInvoice',
            pathToUpdateState:'invoice_update_state'
        }
    },


}
</script>
