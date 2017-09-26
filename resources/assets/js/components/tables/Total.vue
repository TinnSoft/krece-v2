<template>
    <q-list align="right">
        <div style="width: 300px; max-width: 90vw;">
            <q-item>
                <table class="q-table  compact">
                    <tbody>
                        <tr>
                            <td style="width: 5em">
                                <strong>
                                    <small>SUB-TOTAL</small>
                                </strong>
                            </td>
                            <td class="align-right" style="width: 5em">
                                <strong>
                                    <small>{{subtotal}}</small>
                                </strong>
                            </td>
                        </tr>
                        <tr>
                            <td style="width: 5em">
                                <small>DESCUENTOS</small>
                            </td>
                            <td class="align-right" style="width: 5em">
                                <small>{{discounts}}</small>
                            </td>
                        </tr>
                        <template v-if="isTaxArray==false">
                            <tr>
                                <td style="width: 5em">
                                    <small>IMPUESTOS</small>
                                </td>
                                <td class="align-right" style="width: 5em">
                                    <small>{{taxes}}</small>
                                </td>
                            </tr>
                        </template>
                        <template v-if="isTaxArray==true">
                            <tr v-for="tax in taxes">
                                <td style="width: 5em">
                                    <small>{{tax.name}}</small>
                                </td>
                                <td class="align-right" style="width: 5em">
                                    <small>{{tax.total}}</small>
                                </td>
                            </tr>
                        </template>
                        <tr>
                            <td style="width: 5em">
                                <strong>TOTAL</strong>
                            </td>
                            <td class="align-right" style="width: 5em">
                                <strong>{{total}}</strong>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </q-item>
        </div>
    </q-list>
</template>

<script>
import { QList, QItem } from 'quasar-framework'
export default {
    props: {
        subtotal: {},
        discounts: {},
        taxes: {},
        total: {},
        isTaxArray: {
            type: Boolean,
            default: false
        }
    },
    components: { QList, QItem }
}
</script>

<style>
.flex-row-docs .doc-container {
    padding: 15px;
    max-height: 1000px;
}

.align-right {
    text-align: right;
}
</style>
