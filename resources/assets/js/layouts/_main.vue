<template>
    <q-layout ref="layout" view="hHr LpR lFf" :right-breakpoint="1100">
    
        <!-- Header -->
        <q-toolbar :color="backgroundColor" slot="header">
            <q-btn flat @click="$refs.layout.toggleLeft()">
                <q-icon name="menu" />
            </q-btn>
            <q-toolbar-title>
                {{title}}
                <span slot="subtitle">{{subtitle}}</span>
            </q-toolbar-title>
            <q-btn class="within-iframe-hide" flat @click.prevent="logout" style="margin-right: 15px">
                <q-icon name="exit_to_app" /> Salir
            </q-btn>
    
        </q-toolbar>
        <!-- Navigation -->
    
        <!-- Left Side Panel -->
        <div slot="left">
    
          
    
            <q-list-header>{{email}}</q-list-header>
    
            <q-item-separator />
            <div v-for="item in items" v-bind:key="item.title">
                <q-side-link v-if="item.type=='alone'" item :to="item.path" :key="item.title" highlight>
                    <q-item-side :icon="item.icon" />
                    <q-item-main :label="item.title" />
                </q-side-link>
    
                <q-collapsible v-if="item.type!=='alone'" group="grouped" :icon="item.icon" :label="item.title">
                    <blockquote>
                     
                        <div v-for="subItem in item.items" v-bind:key="subItem.title">
  
                                <q-side-link item :to="subItem.path" :key="subItem.title" highlight>
                                    <q-item-side :icon="subItem.icon" />
                                    <q-item-main :sublabel="subItem.title" />
                                </q-side-link>
        
                        </div>
                    </blockquote>
                </q-collapsible>

            </div>
          

        </div>
        <!-- Right Side Panel -->
        <router-view/>
    
        <!-- sub-routes get injected here: -->
    
        <!-- Footer -->
        <q-toolbar style="background: #DCFBE1; color: teal" slot="footer">
            <q-toolbar-title>
                <h6>Aqui puede encontrar muchas ayudas</h6>
            </q-toolbar-title>
        </q-toolbar>
    </q-layout>
</template>

<script type="text/javascript">

import {
    QLayout, QList, QListHeader, QSideLink, QItemSide, QItemMain, QCollapsible,
    QBtn, QIcon, QToolbarTitle, QToolbar, QTabs, QRouteTab, QItem, QItemTile,
    QField, QInput, QItemSeparator,
} from 'quasar-framework';

import store from '../store'

export default {
    props: ['title', 'backgroundColor', 'subtitle', 'items'],
    components: {
        QLayout, QList, QListHeader, QSideLink, QItemSide, QItemMain, QCollapsible,
        QBtn, QIcon, QToolbarTitle, QToolbar, QTabs, QRouteTab, QItem, QItemTile,
        QField, QInput, QItemSeparator,
    },
    data() {
        return {

        }
    },
    computed:{
        email(){
            return store.getters.authUser.email
        }
    },
    methods: {
        logout() {
            this.$store.dispatch('logout')
                .then(() => {
                    this.$router.push({ name: 'auth.login' })
                })
        }
    }
}
</script>
