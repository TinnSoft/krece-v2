<template>
    <div>
        <q-toolbar inverted color="green">
            <q-toolbar-title>
                <h6 class="mobile-only">
                    <b>{{toolbarlabel}} {{documentId}}</b>
                </h6>
                <h5 class="desktop-only">
                    <b>{{toolbarlabel}} {{documentId}}</b>
                </h5>
            </q-toolbar-title>
            <div class="desktop-only">
                <q-btn v-if="showbackButton===true" v-bind:style="styleButton" class="within-iframe-hide" color="orange" flat @click="$router.replace(`${redirectTo}`)">
                    <q-icon :name="icon1" />{{label1}}
                </q-btn>
                <q-btn v-if="showsaveButton===true" v-bind:style="styleButton" @click="handleClick" class="within-iframe-hide" flat color="secondary">
                    <q-icon :name="icon2" /> {{label2}}
                </q-btn>
            </div>
        </q-toolbar>
        <q-toolbar class="mobile-only" inverted color="secondary">
            <q-btn v-if="showbackButton===true" v-bind:style="styleButton" class="within-iframe-hide" color="orange" flat @click="$router.replace(`${redirectTo}`)">
                <q-icon :name="icon1" />{{label1}}
            </q-btn>
            <q-btn v-if="showsaveButton===true" v-bind:style="styleButton" @click="handleClick" class="within-iframe-hide" flat color="secondary">
                <q-icon :name="icon2" />  {{label2}}
            </q-btn>
        </q-toolbar>

        <q-item-separator color="secondary" />
    </div>
</template>
<script type="text/javascript">

import { QToolbar,QToolbarTitle, QBtn, QItemSeparator, QTooltip, QIcon } from 'quasar-framework'

export default {
      data() {
        return {
            styleButton: {
                border: 1,
                padding: 1
            }
        }
    },
      props: {
        toolbarlabel: {},
        documentId: {},
        redirectTo: {},
        label1: {
            default: 'REGRESAR'
        },
         icon1: {
            default: 'keyboard_arrow_left'
        },
        label2: {
            default: 'GUARDAR'
        },
        icon2: {
            default: 'add'
        },
        showbackButton: {
            default: true
        },
         showsaveButton: {
            default: true
        },
    },
    components: { QToolbar,QToolbarTitle, QBtn, QItemSeparator, QTooltip,QIcon },
    methods: {
        handleClick(newVal) {           
            this.$emit('click', newVal)
        }
    },
}
</script>
