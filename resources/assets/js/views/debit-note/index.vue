<template>
    <div class="layout-padding">

        <q-toolbar inverted color="secondary">

            <q-toolbar-title>
                <h5>
                    <b>MIS NOTAS DÉBITO</b>
                </h5>
            </q-toolbar-title>

            <q-btn flat @click="$router.push('/debit-note/create')">
                <q-icon name="add_circle_outline" />NUEVA NOTA DÉBITO</q-btn>
        </q-toolbar>

        <kDatatable :path="path" :kmodule="modulename" :mwarning="warningmessage"
        :pathemaildata="pathEmailData"></kDatatable>
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
            path: 'getDebitNoteList',
            modulename: 'debit-note',
            warningmessage: 'Estas a punto de eliminar la Nota Débito # ',
            pathEmailData:''
        }
    },


}
</script>
