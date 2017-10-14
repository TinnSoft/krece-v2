<template>
    <div>
            <!--<div class="col-xs-3 ico-plus">
                                        <i class="expand_more" v-on:click="toggle(current, $event)" v-bind:class="{'expand_less': open }"></i> {{ current }}
                                    </div>-->
            <!--
                <div class="col-xs-2 " v-for="(column, key) in cols">
                    {{ row[key] == undefined ? "0.00 CHF" : row[key] }}
                </div>-->
            <tr v-for="(rowChild, index) in row" :key="index">
                <td>
                    <i class="material-icons" v-on:click="toggle(current, $event)" v-bind:class="{'material-icons': open }">add_circle_outline</i> {{ current }}
                </td>
                <td> {{rowChild.title}}</td>
                <td> {{rowChild.icon}}</td>
                <span is="item" v-show="open" v-for="(_rowchild, indexchild) in rowChild" :row="_rowchild" :cols="colschildren" :current="indexchild" :key="indexchild">
                </span>
            </tr>
            <!--<tr is="item" v-show="open" v-for="(rowchild, indexchild) in rowschildren" :key="indexchild" :row="rowchild" :cols="colschildren" :current="indexchild">
                            <td class="icone">
                                <i class="material-icons" v-on:click="toggle(current, $event)" v-bind:class="{'expand_less': open }">expand_more</i> {{ current }}
                            </td>

                            <td>{{rowx.title}}</td>
                            <td>{{rowx.icon}}</td>
                        </tr>-->


    </div>
</template>

<script>

export default {
    name: 'item',
    props: {
        row: Object,
        cols: {},
        current: ""
    },
    data: function() {
        return {
            open: false,
            rowschildren: {},
            colschildren: {}
        }
    },
    computed: {
    },
    methods: {
        toggle: function(val, event) {
            this.open = !this.open;
            self = this;
            self.rowschildren = { "1 MSG": { "B2014": "2 786 000.00 CHF", "B2015": "925 000.00 CHF", "B2016": "2 654 000.00 CHF", "B2017": "1 365 000.00 CHF" }, "2 MVO": { "B2014": "2 786 000.00 CHF", "B2015": "925 000.00 CHF", "B2016": "3 124 000.00 CHF", "B2017": "1 365 000.00 CHF" }, "3 MIN": { "B2014": "3 686 000.00 CHF", "B2015": "1 925 000.00 CHF", "B2016": "3 124 000.00 CHF", "B2017": "3 465 000.00 CHF" }, "5 RVO": { "B2014": "1 786 000.00 CHF", "B2015": "625 000.00 CHF", "B2016": "2 164 000.00 CHF", "B2017": "365 000.00 CHF" } };

        }
    }

}


</script>

<style>
.item {
    cursor: pointer;
}



.icone {
    cursor: pointer;
}

x-line {
    display: table-row-group;
    width: 100%;
}
</style>
