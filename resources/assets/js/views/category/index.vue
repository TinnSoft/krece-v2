<template>
    <div class="layout-padding docs-tab">
        <table class="q-table responsive">
            <thead>
                <tr>
                    <th></th>
                    <th v-for="(column, index) in columns">{{column}}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(rowx, index) in table">
                    <td>
                        <q-icon v-if="hasChildren(rowx.children)===true" style="cursor: pointer;" name="add_circle_outline" color="green" />
                    </td>

                    <td>{{rowx.title}}</td>
                    <td>{{rowx.icon}}</td>
                </tr>

            </tbody>
        </table>

        <!--
                <table class="q-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th v-for="(column, index) in columns">{{column}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <item :row.sync="table" :cols.sync="columns"></item>
                    </tbody>
                </table>
        -->
      <table class="q-table cell-separator highlight bordered">
            <thead>
                <tr>
                    <th></th>
                    <th v-for="(column, index) in columns" :key="index">{{column}}</th>
                </tr>
            </thead>
            <tbody>
                <item class="item" :model="table" :columns="columns"></item>
            </tbody>
        </table>
        
    </div>
</template>

<script>
import { QTree, Toast, QIcon } from 'quasar-framework'
import item from './rowItem.vue'
import axios from 'axios'



export default {
    components: {
        QTree, QIcon, item
    },
    methods: {
        hasChildren(val) {
            try {
                if (val.length > 0) {
                    return true
                }
            } catch (e) {
            }

            return false
        },
    },
    data() {
        return {
            columns: [
                'Nombre',
                'Descripción',
                'Acciones',
            ],
            table: [{
                name:'sub-1',
                children: [
                    { name: 'sub-2' },
                    { name: 'sub 3' },
                    {
                        name: 'sub4',
                        children: [
                            {
                                name: 'sub41',
                                children: [
                                    { name: 'sub411' },
                                    { name: 'sub 412' }
                                ]
                            },
                            { name: 'sub 51' },
                            { name: 'sub 52' },                            
                        ]
                    }
                ]
            },
            {
                name:'sub-2'
            },
             {
                name:'sub-3',
                children: [
                    { name: 'sub-2' },
                    { name: 'sub 3' },
                    {
                        name: 'sub4'
                    }
                ]
            }],
        }
    }
}
</script>

<style>
.table td {
    border-top: 1px solid #f4f4f4;
    padding: 8px;
    line-height: 1.42857143;
    vertical-align: top;
    border-top: 1px solid #ddd;
}

i {
    cursor: pointer;
}
</style>
