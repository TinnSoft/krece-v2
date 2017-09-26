<template>
    <div class="layout-padding">

        <kToolbar toolbarlabel="MIS COTIZACIONES" @click="$router.push(`/${modulename}/create`)" label2="NUEVA COTIZACION" icon2="add_circle_outline" :showbackButton="false"></kToolbar>

        <kDatatable :path="path" :kmodule="modulename" :mwarning="warningmessage" :pathemaildata="pathEmailData"></kDatatable>
    </div>
</template>

<script>


import kDatatable from '../../components/tables/Datatable-Index.vue'
import kToolbar from '../../components/Toolbar.vue'

export default {

    components: {
        kDatatable,
        kToolbar
    },
    methods: {

    },

    data() {
        return {
            path: 'getEstimateList',
            modulename: 'estimate',
            warningmessage: 'Estas a punto de eliminar la cotización # ',
            pathEmailData: 'estimate_EmailToCustomer'

        }
    },


}
</script>
