<template>
    <q-card inline >
        <q-chip square pointing="down" :color="backgroundColor" style="min-width: 300px">{{title}}</q-chip>
    
        <q-card-main style="height: 50px">
            <h5>{{kValue}}</h5>
        </q-card-main>
    
        <q-card-title style="height: 50px">    
            <span slot="right" class="row items-center">
                <q-icon :name="iconName" /> {{subtitle}}
            </span>
        </q-card-title>
    </q-card>
</template>

<script type="text/javascript">
import accounting from 'accounting'

import {
    QCard, QCardTitle, QIcon, QCardMain, QChip
} from 'quasar-framework';

export default {
    props: ['title', 'total', 'backgroundColor', 'iconName', 'subtitle'],
    computed: {
        kValue() {
            return accounting.formatMoney(this.total);
        }
    },
    components: {
        QCard, QCardTitle, QIcon, QCardMain, QChip
    },
    data() {
        return {
            options: {
                separator: '.'
            }
        }
    }
}
</script>
<style scoped>
.label {
    min-height: 20px;
}

h5 {
    font-weight: 300;
    flex: 1 1 auto;
}

.card {
    width: 500px;
}
</style>