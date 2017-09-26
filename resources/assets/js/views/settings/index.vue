<template>
    <div class="layout-padding">
        <q-toolbar color="grey-5">
             <q-btn flat @click="$refs.layout2.toggleLeft()">
                <q-icon name="menu" />
            </q-btn>
            <q-toolbar-title>
                CONFIGURACIÓN
            </q-toolbar-title>

        </q-toolbar>
        <q-layout ref="layout2" view="lHr lpr lff" :left-breakpoint="layoutStore.leftBreakpoint" :right-breakpoint="layoutStore.rightBreakpoint" :reveal="layoutStore.reveal">
           
            <q-scroll-area slot="left" style="width: 100%; height: 100%">
                <q-list-header>Impuestos</q-list-header>
                <q-side-link item to="/settings/taxes">
                    <q-item-side icon="monetization_on" />
                    <q-item-main label="Impuestos" />
                    <q-item-side right icon="chevron_right" />
                </q-side-link>
                <q-side-link item to="/settings/retention">
                    <q-item-side icon="monetization_on" />
                    <q-item-main label="Retenciones" />
                    <q-item-side right icon="chevron_right" />
                </q-side-link>
                <q-item-separator />
                <q-list-header>Facturación</q-list-header>
                <q-side-link item to="/settings/payment_terms">
                    <q-item-side icon="comment" />
                    <q-item-main label="Terminos de pago" />
                    <q-item-side right icon="chevron_right" />
                </q-side-link>
                <q-side-link item to="/settings/numeration">
                    <q-item-side icon="format_list_numbered" />
                    <q-item-main label="Numeración de documentos" />
                    <q-item-side right icon="chevron_right" />
                </q-side-link>
                <q-item-separator />
                <q-list-header>Empresa</q-list-header>
                <q-side-link item to="/settings/company">
                    <q-item-side icon="domain" />
                    <q-item-main label="Empresa" />
                    <q-item-side right icon="chevron_right" />
                </q-side-link>

                <q-side-link item to="/settings/profile">
                    <q-item-side icon="person_outline" />
                    <q-item-main label="Mi perfil" />
                    <q-item-side right icon="chevron_right" />
                </q-side-link>

            </q-scroll-area>

            <router-view />

        </q-layout>

    </div>
</template>

<script>

import {
    QLayout,
    QToolbar,
    QToolbarTitle,
    QSearch,
    QTabs,
    QRouteTab,
    QBtn,
    QIcon,
    QItemSide,
    QItemMain,
    QSideLink,
    QListHeader,
    QScrollArea, QItemSeparator
} from 'quasar-framework'

export default {

    components: {
        QLayout,
        QToolbar,
        QToolbarTitle,
        QSearch,
        QTabs,
        QRouteTab,
        QBtn,
        QIcon,
        QItemSide,
        QItemMain,
        QSideLink,
        QListHeader,
        QScrollArea, QItemSeparator
    },
    methods: {

    },

    data() {
        return {
            layoutStore: {
                reveal: false,
                leftScroll: true,
                rightScroll: true,
                leftBreakpoint: 996,
                rightBreakpoint: 1200
            }
        }
    },


}
</script>
