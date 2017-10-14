<template>
    <li class="item">
        <div :class="{bold: isFolder}" @click="toggle" @dblclick="changeType">
            {{model.name}}
            <span v-if="isFolder">[{{open ? '-' : '+'}}]</span>
        </div>
        <ul v-show="open" v-if="isFolder">
            <item v-for="(model,index) in model.children" :key="index" :model="model">
            </item>
        </ul>
    </li>
</template>

<script>

export default {
    name: 'item',
    props: {
        model: Object
    },
    data: function() {
        return {
            open: false
        }
    },
    computed: {
        isFolder: function() {
            return this.model.children &&
                this.model.children.length
        }
    },
    methods: {
        toggle: function() {
            console.log('toogle')
            if (this.isFolder) {
                this.open = !this.open
            }
        },
        changeType: function() {
            let vm = this;
            if (!vm.isFolder) {
                vm.$set(vm.model, 'children', [])
                vm.addChild()
                vm.open = true
            }
        },
        addChild: function() {
            this.model.children.push({
                name: 'new stuff'
            })
        }
    }

}


</script>

<style>
.item {
    cursor: pointer;
}
</style>
