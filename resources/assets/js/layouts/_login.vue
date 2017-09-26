<template>
    <q-layout ref="layout" view="hHr LpR lFf" :right-breakpoint="1100">
        <q-toolbar :color="backgroundColor" slot="header">
            <q-toolbar-title>
                {{title}}
                <span slot="subtitle">{{subtitle}}</span>
            </q-toolbar-title>
        </q-toolbar>
        <router-view class="layout-view"></router-view>
        </q-toolbar>
    </q-layout>
</template>

<script type="text/javascript">

import {
    QLayout, QToolbar, QToolbarTitle
} from 'quasar-framework';

export default {
    props: ['title', 'backgroundColor', 'subtitle'],
    components: {
        QLayout, QToolbar, QToolbarTitle
    },
    data() {
        return {

        }
    }
}
</script>
