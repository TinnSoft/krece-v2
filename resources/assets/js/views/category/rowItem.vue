<template>
    <span>
        <tr v-for="(submodel,index) in model" :key="index">

            <!--<div :class="{bold: isFolder}" @click="toggle">-->
            <!--<td v-if="isFolder">[{{open ? '-' : '+'}}]</td>-->
            <td>
                <q-icon v-if="hasChildren(submodel.children)===true" style="cursor: pointer;" name="add_circle_outline" color="green" @click="toggle(submodel.children, index)" />
            </td>

            <td> {{submodel.name}}</td>
            <td> {{submodel.icon}}</td>
            <td> {{submodel.icon}}</td>
            <!-- </div>-->
            <div v-show="open" v-if="hasChildren(submodel.children)===true">
                <item v-for="(xmodel,index) in submodel.children" :key="index" :model="xmodel"></item>
            </div>

        </tr>
    </span>
</template>

<script>
import { QIcon } from 'quasar-framework'
export default {
    components: { QIcon },
    name: 'item',
    props: {
        model: {},
        columns: {}
    },
    data: function() {
        return {
            open: false,
            current: null
        }
    },
    computed: {
        isFolder(val) {
            console.log('issubfoler', val)
            //     return this.model.children &&
            //       this.model.children.length
            return true
        }
    },
    methods: {
        hasChildren(val) {
            try {
                if (val.length > 0) {
                    console.log(val)
                    return true
                }
            } catch (e) {
            }

            return false
        },
        toggle(val, index) {
            console.log('index: ',index)
            if (this.hasChildren(val) == true) {
                this.current = index;
                this.open = !this.open;
            }
        },
    }

}


</script>

<style>

</style>
