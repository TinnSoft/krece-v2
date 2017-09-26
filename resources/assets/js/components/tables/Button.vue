<template>
    <q-btn flat :color="color" small v-bind:style="styleButton" @click="handleClick" :disabled="isChecked">
        <q-icon :name="iconname" size="24px" />
        <q-tooltip>
            {{tooltiplabel}}
        </q-tooltip>
    </q-btn>
</template>

<script>
import { QBtn, QIcon, QTooltip } from 'quasar-framework'
export default {
    props: ['color', 'statusID', 'iconname', 'tooltiplabel'],
    components: { QBtn, QIcon, QTooltip },
    data() {
        return {
            styleButton: {
                border: 0,
                padding: 0
            }
        }
    },
    methods: {
        handleClick(newVal) {
            this.$emit('click', newVal)
        }
    },

    computed: {
        isChecked() {
            if (this.statusID === 2) {
               return true;
            }
            return false;
        },

    }
}
</script>
