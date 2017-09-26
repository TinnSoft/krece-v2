<template>
    <div class="layout-padding">

        <kToolbar :toolbarlabel="toolbarlabel" :documentId="form.resolution_id" :redirectTo="`${redirect}`" @click="submit"
        ></kToolbar>     

        <q-item-separator color="secondary" />

        <div class="doc-container">
            <div class="row ">
                <div class="col-sm-5">
                    <q-list style="border: 0;padding: 0">

                        <template v-if="showNumerationList==true">
                            <q-select color="secondary" @change="onChangeNumeration" stack-label="*Numeración" v-model="form.resolution_id_ref" :options="base.numerationList_sale_order" />
                        </template>
                        <template v-if="showManualNumber==true">
                            <q-input color="secondary" v-model="form.prefix" stack-label="Prefijo" />
                            <q-field :error="checkIfFieldHasError(errors, 'resolution_id')" error-label="Este campo es obligatorio">
                                <q-input color="secondary" type="number" v-model="form.resolution_id" stack-label="*Número" />
                            </q-field>
                        </template>
                        <q-field :error="checkIfFieldHasError(errors, 'customer_id')" error-label="Este campo es obligatorio">
                            <q-select color="secondary" @change="onChangeContact" filter filter-placeholder="Buscar" stack-label="*Cliente" v-model="form.customer_id" :options="base.contacts" />
                        </q-field>
                        <q-field :error="checkIfFieldHasError(errors,'date')" error-label="Seleccione una fecha válida">
                            <kDateTime v-model="form.date" stackLabel="*Fecha (Año-Mes-Dia)"></kDateTime>
                        </q-field>

                        <q-field :error="checkIfFieldHasError(errors,'due_date')" error-label="Seleccione una fecha válida">
                            <kDateTime v-model="form.due_date" stackLabel="*Fecha de vencimiento (Año-Mes-Dia)"></kDateTime>
                        </q-field>

                        <q-input color="secondary" type="textarea" v-model="form.observations" stack-label="Observaciones" />

                        <q-field :error="checkIfFieldHasError(errors,'notes')" error-label="Este campo es obligatorio">
                            <q-input color="secondary" type="textarea" v-model="form.notes" stack-label="*Notas" />
                        </q-field>

                    </q-list>
                </div>
                <div class="col-sm-1">
                </div>
                <div class="col-sm-5">
                    <q-list style="border: 0;padding: 0">
                        <q-select color="secondary" stack-label="Vendedor" v-model="form.seller_id" :options="base.sellers" />
                        <q-select color="secondary" stack-label="Lista de precios" v-model="form.list_price_id" :options="base.listprice" />

                        <q-field :error="checkIfFieldHasError(errors,'payment_terms_id')" error-label="Este campo es obligatorio">
                            <q-select color="secondary" @change="onChangePaymentTerms" stack-label="*Plazo" v-model="form.payment_terms_id" :options="base.payment_terms" />
                        </q-field>
                        <q-field :error="checkIfFieldHasError(errors,'currency_code')" error-label="Este campo es obligatorio">
                            <q-select color="secondary" stack-label="*Moneda" v-model="form.currency_code" :options="base.currency" />
                        </q-field>
                        <!--Agregar nuevos archivos-->
                        <q-btn v-if="(processType == 'edit')" flat class="within-iframe-hide" color="positive" flat @click="loadFiles($refs)">
                            <q-icon size="1rem" name="attach_file" />
                            <small>Gestionar Documentos</small>
                        </q-btn>
                    </q-list>
                </div>
            </div>
        </div>

        <table class="q-table responsive bordered compact highlight horizontal-separator striped" style="width: 100%;">
            <thead>
                <tr style="text-align: left;">
                    <th colspan="2">PRODUCTO</th>
                    <th>DESCRIPCIÓN</th>
                    <th>PRECIO</th>
                    <th>CANTIDAD</th>
                    <th>DESCUENTO</th>
                    <th>IMPUESTO</th>
                    <th>TOTAL</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(_detail, index) in form.detail">
                    <td style="width: 1em">
                        <a @click="remove(_detail)">
                            <q-icon name="delete_forever" color="red" size="20px" />
                        </a>
                    </td>
                    <td data-th="PRODUCTO" style="width: 12em">
                        <q-field :error="checkIfFieldHasError(errors,['detail.' + index + '.product_id'])" error-label="Seleccione un producto">
                            <q-select @change="onChangeProduct(_detail)" class="no-margin no-padding" filter filter-placeholder="Buscar producto" v-model="_detail.product_id" :options="base.products" />
                        </q-field>
                    </td>

                    <td data-th="DESCRIPCIÓN" style="width: 12em">
                        <q-field>
                            <q-input class="no-margin no-padding" v-model="_detail.description" />
                        </q-field>
                    </td>
                    <td data-th="PRECIO" style="width: 8em">
                        <q-field :error="checkIfFieldHasError(errors,['detail.' + index + '.unit_price'])" error-label="Obligatorio">
                            <q-input class="no-margin no-padding" type="number" prefix="$" v-model="_detail.unit_price" />
                        </q-field>
                    </td>
                    <td data-th="CANTIDAD" style="width: 7em">
                        <q-field :error="checkIfFieldHasError(errors,['detail.' + index + '.quantity'])" error-label="Obligatorio">
                            <q-input class="no-margin no-padding" type="number" v-model="_detail.quantity" />
                        </q-field>
                    </td>
                    <td data-th="DESCUENTO" style="width: 4em">
                        <q-field>
                            <q-input class="no-margin no-padding" type="number" prefix="%" v-model="_detail.discount" />
                        </q-field>
                    </td>
                    <td data-th="IMPUESTO" style="width: 6em">
                        <q-field>
                            <q-select @change="onChangeTax(_detail)" class="no-margin no-padding" filter filter-placeholder="Buscar producto" v-model="_detail.tax_id" :options="base.taxes" />
                        </q-field>
                    </td>
                    <td data-th="TOTAL" style="width: 8em">
                        <q-field>
                            <q-input class="no-margin no-padding" disable type="number" prefix="$" :value="totalByLine(_detail)" />
                        </q-field>
                    </td>
                </tr>
            </tbody>
        </table>
        <q-btn class="within-iframe-hide" @click="addLine" flat color="deep-orange">
            <q-icon name="add" /> NUEVA LINEA
        </q-btn>
        <!--<pre><code>{{$data.form}}</code></pre>-->
        <totals :subtotal="subTotal" :discounts="DiscountsTotal" :taxes="TaxesTotal" :total="grandTotal"></totals>

        <attachfiles ref="_attachfile"></attachfiles>
    </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import moment from 'moment'
moment.locale('es');

import attachfiles from '../../components/modals/AttachFiles.vue'

import totals from '../../components/tables/Total.vue'

import {
    QDataTable, QInput, QSlider,
    QBtn, QIcon, QTooltip, clone,
    QToolbar, QToolbarTitle, QItemSeparator,
    QFixedPosition, QFab, QFabAction, QList,
    date, QSelect, QItemSide, QItemMain,
    Ripple, Toast, QItem, QItemTile, QField,
    QSpinnerGears, Loading
} from 'quasar-framework'

import axios from 'axios'
const { addToDate } = date

import kDateTime from '../../components/DateTime.vue'
import kToolbar from '../../components/Toolbar.vue'

import accounting from 'accounting'



export default {

    data() {
        return {
            form: {},
            base: {
                contacts: [{
                    label: '',
                    value: ''
                }],
                sellers: [{
                    label: '',
                    value: ''
                }],
                listprice: [{
                    label: '',
                    value: ''
                }],
                currency: [{
                    label: 'COP',
                    value: 'COP'
                }],
                products: [{
                    label: '',
                    value: ''
                }],
                taxes: [{
                    label: '',
                    value: ''
                }],
                payment_terms: [{
                    label: '',
                    value: ''
                }],
                numerationList_sale_order: [{
                    label: '',
                    value: ''
                }]
            },
            select: null,
            value: null,
            options: [],
            redirect: '/invoice',
            toolbarlabel: 'NUEVA FACTURA DE VENTA No: ',
            path: 'invoice/create',
            store: 'invoice',
            method: 'post',
            processType: 'create',
            showManualNumber: false
        }
    },
    components: {
        QInput, QField, QSlider,kToolbar,
        QBtn, totals, QIcon, QTooltip, QToolbar,
        QToolbarTitle, QItemSeparator,
        QFixedPosition, QItem, QItemTile, QFab,
        QFabAction, QList, Multiselect,
        QSelect, kDateTime, QDataTable, QItemSide, QItemMain,
        Ripple, QSpinnerGears, attachfiles
    },
    created() {
        if (this.$route.meta.mode === 'edit') {
            this.path = `invoice/${this.$route.params.id}/edit`
            this.store = `invoice/${this.$route.params.id}`
            this.method = 'put'
            this.button = 'Guardar'
            this.toolbarlabel = 'EDITAR FACTURA DE VENTA No: '
            this.processType = "edit"
        } else if (this.$route.meta.mode === 'clone') {
            this.path = `invoice/${this.$route.params.id}/edit?convert=clone`
            this.store = `invoice`
            this.method = 'post'
            this.toolbarlabel = 'CLONAR FACTURA DE VENTA No: '
            this.processType = "clone"
        }
        this.fetchData();
    },
    computed: {
        showNumerationList() {
            if (this.base.numerationList_sale_order.length > 1) {
                return true;
            }
            else {
                return false;
            }

        },
        subTotal() {
            var vm = this;
            var _subtotal = 0
            if (vm.form.detail) {
                _subtotal = vm.form.detail.reduce(function(carry, detail) {
                    return carry + (parseFloat(detail.quantity) * parseFloat(detail.unit_price));
                }, 0);
            }
            _subtotal = isNaN(_subtotal) ? 0 : _subtotal;
            this.form.sub_total = _subtotal;
            return accounting.formatMoney(_subtotal);
        },

        DiscountsTotal() {
            var discountsTot = 0;
            if (this.form.detail) {
                discountsTot = this.form.detail.reduce(function(carry, detail) {
                    return carry + (((parseFloat(detail.quantity) * parseFloat(detail.unit_price)) * parseFloat(detail.discount))) / 100;
                }, 0);
            }

            discountsTot = isNaN(discountsTot) ? 0 : discountsTot
            this.form.total_discounts = discountsTot;
            return accounting.formatMoney(discountsTot);
        },

        TaxesTotal() {
            var TaxTot = 0;

            if (this.form.detail) {
                TaxTot = this.form.detail.reduce(function(carry, detail) {
                    return carry + ((((parseFloat(detail.quantity) * parseFloat(detail.unit_price))
                        - ((parseFloat(detail.quantity) * parseFloat(detail.unit_price)) * parseFloat(detail.discount)) / 100) *
                        parseFloat(isNaN(detail.tax_amount) || detail.tax_amount == '' || detail.tax_amount == null ? 0 : detail.tax_amount))) / 100;
                }, 0);
            }
            TaxTot = isNaN(TaxTot) ? 0 : TaxTot
            this.form.total_taxes = TaxTot;
            return accounting.formatMoney(TaxTot);
        },

        grandTotal() {
            var totalval = (isNaN(this.form.sub_total) ? 0 : parseFloat(this.form.sub_total)) -
                (isNaN(this.form.total_discounts) ? 0 : parseFloat(this.form.total_discounts)) + (isNaN(this.form.total_taxes) ? 0 : parseFloat(this.form.total_taxes));

            totalval = isNaN(totalval) ? 0 : totalval
            this.form.total = totalval;
            return accounting.formatMoney(totalval);
        },
        errors() {
            return this.$store.getters.errors
        },

    },
    methods: {
        onChangeNumeration(val) {
            if (val) {
                var vm = this;
                vm.base.numerationList_sale_order.forEach(function(item) {
                    if (item.id == val) {
                        vm.form.resolution_id_ref = item.id;
                        vm.form.ResolutionIsAutoNumeric = item.auto_increment;

                        if (item.auto_increment === 1) {
                            vm.form.resolution_id = item.next_invoice_number;
                            vm.form.prefix = item.prefix;
                        }
                        else {
                            vm.form.resolution_id = '';
                            vm.form.prefix = '';
                        }

                        if (item.isDefault == 1 || item.auto_increment == 1) {
                            vm.showManualNumber = false;
                        }
                        else {
                            vm.showManualNumber = true;
                        }
                    };
                });
            }
        },
        loadFiles(refs) {
            refs._attachfile.open(this.$route.params.id, 'invoice');
        },
        checkIfFieldHasError(error, field) {
            try {
                if (error.errors[field]) {
                    return true
                }
            } catch (err)
            { }

            return false
        },
        totalByLine(val) {
            var total = val.quantity * val.unit_price - (val.quantity * val.unit_price * val.discount / 100)
            return total;
        },
        onChangePaymentTerms(val) {
            if (val) {
                var d = new Date();
                var vm = this;
                vm.base.payment_terms.forEach(function(item) {
                    if (item.value === val) {
                        if (item.days >= 0) {
                            d.setDate(d.getDate() + item.days);

                            vm.form.due_date = d;
                        }
                    };
                });
            }
            else
            { this.form.payment_terms_id = ''; }
        },
        onChangeContact(val) {
            if (val) {
                var vm = this;
                vm.base.contacts.forEach(function(item) {
                    if (item.id == val) {
                        if (item.seller_id) {
                            vm.form.seller_id = item.seller_id
                        }
                    };
                });
            }
        },

        onChangeTax(val) {

            if (val.tax_id) {
                var vm = this;
                vm.base.taxes.forEach(function(item) {
                    if (item.id == val.tax_id) {
                        val.tax_amount = item.amount;
                    };
                });
            }
            else {
                val.tax_amount = 0;
                val.tax_id = "";
            }
        },
        onChangeProduct(val) {
            if (val.product_id) {
                var vm = this;
                vm.base.products.forEach(function(item) {
                    if (item.id == val.product_id) {
                        val.description = item.description;
                        val.unit_price = item.sale_price;
                        val.reference = item.reference;
                    };
                });
            }
            else {
                val.product_id = "";
                val.description = '';
                val.unit_price = 0;
                val.reference = '';
            }
        },

        showMenu() {
            //To delete
            showActionSheetWithIcons()
        },
        getCurrentDate() {
            var vm = this;
            if (vm.form.date == null) {
                const today = new Date()
                vm.form.date = today
                vm.form.due_date = addToDate(today, { days: 30 });
            }
        },
        addLine() {

            this.form.detail.push({
                product_id: null,
                name: '',
                description: '',
                unit_price: 0,
                discount: 0,
                quantity: 1,
                tax_id: null,
                tax_amount: 0,
                total_tax: 0
            })

        },
        remove(detail) {
            // prevent removal of last item
            if (this.form.detail.length > 1) {
                var index = this.form.detail.indexOf(detail)
                this.form.detail.splice(index, 1);
            }
        },
        fetchData() {
            var vm = this;
            axios.get(`/api/${this.path}`)
                .then(function(response) {
                    vm.$set(vm, 'form', response.data.form)
                   // console.log(response.data);
                    if (response.data.base.contacts.length > 0) {
                        vm.$set(vm.$data.base, 'contacts', response.data.base.contacts)
                    }
                    if (response.data.base.currency.length > 0) {
                        vm.$set(vm.$data.base, 'currency', response.data.base.currency)
                    }
                    if (response.data.base.sellers.length > 0) {
                        vm.$set(vm.$data.base, 'sellers', response.data.base.sellers)
                    }
                    if (response.data.base.listprice.length > 0) {
                        vm.$set(vm.$data.base, 'listprice', response.data.base.listprice)
                    }
                    if (response.data.base.taxes.length > 0) {
                        vm.$set(vm.$data.base, 'taxes', response.data.base.taxes)
                    }
                    if (response.data.base.productlist.length > 0) {
                        vm.$set(vm.$data.base, 'products', response.data.base.productlist)
                    }
                    //console.log(response.data.form)
                    if (response.data.base.paymentTerms.length > 0) {
                        vm.$set(vm.$data.base, 'payment_terms', response.data.base.paymentTerms)
                    }
                    if (response.data.base.numerationList_sale_order.length > 0) {
                        vm.$set(vm.$data.base, 'numerationList_sale_order', response.data.base.numerationList_sale_order)
                    }


                    vm.getCurrentDate();
                })
                .catch(function(error) {
                    if (error.response.data.message) {
                        Toast.create.negative(error.response.data.message)
                    }
                    if (error.response.data.redirectTo) {
                        vm.$router.replace(`${error.response.data.redirectTo}`)
                    }
                })

        },
        submit() {            
            this.$set(this.form, 'processType', this.processType)
            this.$nextTick(function() {
                this.$store.dispatch('storeById', {
                    form: this.form,
                    store: this.store,
                    method: this.method,
                    redirect: this.redirect,
                    router: this.$router
                })
            })
        }
    },
    watch: {
        '$route': 'fetchData'
    },
}
</script>

<style>
th {
    background-color: #6ECD6E;
    color: white;
}


table {
    font-size: 88%;
    table-layout: auto;
    width: 100%;
}

table {
    border-collapse: separate;
    border-spacing: 2px;
}

th,
td {
    border-width: 1px;
    padding: 0.5em;
    position: relative;
    text-align: left;
}

th,
td {
    border-radius: 0.25em;
}


td {
    border-color: #FFF;
}


::-webkit-input-placeholder {
    /* Chrome/Opera/Safari */
    font-size: 80%;
}

::-moz-placeholder {
    /* Firefox 19+ */
    font-size: 80%;
}

:-ms-input-placeholder {
    /* IE 10+ */
    font-size: 80%;
}

:-moz-placeholder {
    /* Firefox 18- */
    font-size: 80%;
}

.flex-row-docs h3 {
    padding-bottom: 4px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

.flex-row-docs .row>div {
    padding: 10px 15px;
    background: rgba(86, 61, 124, 0.15);
    border: 1px solid rgba(86, 61, 124, 0.2);
}

.flex-row-docs .row+.row {
    margin-top: 1rem;
}

.flex-row-docs .doc-container {
    padding: 15px;
    max-height: 1000px;
}

.flex-row-docs .minheight-rows .row {
    min-height: 5rem;
}

.flex-row-docs .with-bg .row {
    background: rgba(255, 0, 0, 0.1);
}
</style>
