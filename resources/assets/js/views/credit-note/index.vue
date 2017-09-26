<template>
    <div class="layout-padding">
         <kToolbar toolbarlabel="MIS NOTAS CRÉDITO" :showbackButton="false"  @click="$router.push(`/${modulename}/create`)"
        label2="NUEVA NOTA CRÉDITO" icon2="add_circle_outline"></kToolbar>     

       

        <kDatatable :path="path" :kmodule="modulename" :mwarning="warningmessage"
        :pathemaildata="pathEmailData"></kDatatable>
    </div>
</template>

<script>



import kToolbar from '../../components/Toolbar.vue'
import kDatatable from '../../components/tables/Datatable-Index.vue'


export default {
   
    components: {
        kDatatable,
        kToolbar
    },
    methods: {

    },

    data() {
        return {
            path: 'getCreditNoteList',
            modulename: 'credit-note',
            warningmessage: 'Estas a punto de eliminar la Nota Crédito # ',
            pathEmailData:'getTemplateEmailToCustomerCreditNote'
        }
    },


}
</script>
