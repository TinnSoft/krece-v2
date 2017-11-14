<template>
<div>
  <q-search color="green" v-model="search" placeholder="Buscar" />
            <table style="overflow-x:auto;" class="q-table bordered vertical-separator highlight compact striped responsive">
                <thead>
                    <tr>                        
                        <td >NOMBRE</td>
                        <td >DESCRIPCIÓN</td>
                        <td>CUENTA NIIF</td>
                        <td>ACCIONES</td>
                    </tr>
                </thead>
                <tbody>
           
                    <tr v-for="(item ,index)  in (arrayTreeObj)" :key="index"  v-bind:class="[(item.id != selectedRowID.id) ? 'my-label':'text-green bg-light-green-11','']"  @click="selectedRow(item)" >
                        <td  data-th="NOMBRE" @click="toggle(item, index)">
                        
                            <span class="q-tree-link q-tree-label" v-bind:style="setPadding(item)" >                
                                 <q-icon  style="cursor: pointer;" :name="iconName(item)" color="secondary"  />
                                {{item.name}}
                            </span>
                        
                        </td>
                        <td  data-th="DESCRIPCIÓN">{{item.description}}</td>
                        <td width="20%" data-th="CUENTA NIIF">{{item.niif_account}} </td>
                        <td width="10%" data-th="ACCIONES"> 
                          <kButton color="grey" iconname="add_circle" tooltiplabel="Agregar Categoría" @click="openProductModal($refs,'create', item.id)"></kButton>
                          <kButton  v-if="item.isEditable==true" color="grey"   iconname="edit" tooltiplabel="Editar"@click="openProductModal($refs,'edit', item.id)"></kButton>
                          <kButton v-if="item.isEditable==true" color="red"  iconname="delete" tooltiplabel="Eliminar Categoría" @click="remove(item)"></kButton>                        
                         </td>
                    </tr>
                </tbody>
           </table>
             <mAddCategory ref="_addCategory"  @close="closeCategoryModal"></mAddCategory>
              <q-inner-loading :visible="isProcessing">
                <q-spinner-mat size="50px" color="teal-4" />{{loadingMessage}}
            </q-inner-loading>
</div>
</template>

<script>
import {
  Toast,
  QIcon,
  QModal,
  QModalLayout,
  Dialog,
  QInnerLoading,
  QSpinnerMat,
  QBtn,
  QSearch
} from "quasar-framework";
import kButton from "../tables/Button.vue";
import axios from "axios";
import mAddCategory from "./mNewCategory.vue";

export default {
  props: {
    columns: {
      type: [Array, Object],
      default: () => []
    },
    route: {
      type: String,
      default: null
    },
    selectedIDRow: {
      type: Number,
      default: null
    }
  },
  components: {
    QIcon,
    kButton,
    QModal,
    QModalLayout,
    mAddCategory,
    QInnerLoading,
    QSpinnerMat,
    QBtn,
    QSearch
  },
  data() {
    return {
      search:'',
      loadingMessage: null,
      isProcessing: false,
      selectedRowID: {},
      table: [],
      itemId: null,
      isExpend: true
    };
  },
  watch: {
    selectedIDRow: function(val) {
      if (this.selectedRowID != null) {
        this.$set(this.selectedRowID, "id", val);
      }
    }
  },
  computed: {
    arrayTreeObj() {
      let vm = this;
      var newObj = [];
      vm.recursive(vm.table, newObj, 0, vm.itemId, vm.isExpend);
      return newObj;
    }
  },
  methods: {
    iconName(item) {
      if (item.expend == true) {
        return "remove_circle_outline";
      }

      if (item.children && item.children.length > 0) {
        return "control_point";
      }

      return "chevron_right";
    },
    toggle(item, index) {
      let vm = this;
      vm.itemId = item.id;

      item.leaf = false;
      //Muestra los sub items al dar click en +
      if (
        item.leaf == false &&
        item.expend == undefined &&
        item.children != undefined
      ) {
        if (item.children.length != 0) {
          vm.recursive(item.children, [], item.level + 1, item.id, true);
        }
      }

      //Eliminar items cuando se da click en ocultar fila
      if (item.expend == true && item.children != undefined) {
        var __subindex = 0;
        item.children.forEach(function(o) {
          o.expend = undefined;
        });

        vm.$set(item, "expend", undefined);
        vm.$set(item, "leaf", false);
        vm.itemId = null;
      }
    },
    setPadding(item) {
      return `padding-left: ${item.level * 30}px;`;
    },
    recursive(obj, newObj, level, itemId, isExpend) {
      let vm = this;

      obj.forEach(function(o) {
        if (o.children && o.children.length != 0) {
          o.level = level;
          o.leaf = false;
          newObj.push(o);
          if (o.id == itemId) {
            o.expend = isExpend;
          }
          if (o.expend == true) {
            vm.recursive(o.children, newObj, o.level + 1, itemId, isExpend);
          }
        } else {
          o.level = level;
          o.leaf = true;
          newObj.push(o);
          return false;
        }
      });
    },
    openProductModal(refs, processType, itemId) {
      refs._addCategory.open(processType, itemId);
    },
    closeCategoryModal() {
      this.fetchData();
    },
    fetchData() {
      let vm = this;
      vm.loadingMessage = "Cargando...";
      vm.isProcessing = true;
      if (vm.route.length > 0) {
        axios
          .get(`/api/${vm.route}`)
          .then(function(response) {
            vm.$set(vm, "table", response.data);
            vm.isProcessing = false;
          })
          .catch(function(error) {
            vm.isProcessing = false;
            if (error.response.data.message) {
              Toast.create.negative(error.response.data.message);
            }
            if (error.response.data.redirectTo) {
              vm.$router.replace(`${error.response.data.redirectTo}`);
            }
          });
      }
    },
    selectedRow(row, clicked) {
      let vm = this;
      vm.selectedRowID = row;
      vm.$emit("click", row);
      // console.log(vm.selectedRowID);
    },
    remove(val) {
      var vm = this;
      Dialog.create({
        title: "Tenga Cuidado",
        message: "Está seguro de eliminar la categoría: " + val.name,
        buttons: [
          {
            label: "Cancelar",
            color: "orange"
          },
          {
            label: "Si, estoy seguro",
            color: "positive",
            style: "text-decoration: underline",
            handler() {
              vm.submit(val.id);
            }
          }
        ]
      });
    },
    submit(categoryid) {
      let vm = this;
      vm.isProcessing = true;
      vm.loadingMessage = "Eliminando...";
      axios
        .delete("/api/category/" + categoryid)
        .then(function(response) {
          if (response.data.deleted) {
            Toast.create.positive(
              "Se eliminó satisfactoriamente la categoría seleccionada"
            );
            vm.fetchData();
            vm.isProcessing = false;
          }
        })
        .catch(function(error) {
          vm.isProcessing = false;
          Toast.create.negative(
            "Ooops! No fue posible la categoría seleccionada, intente de nuevo."
          );
        });
    }
  },
  created() {
    this.fetchData();
  },
  filters: {}
};
</script>


<style lang="stylus">
table {
  font-size: 88%;
  table-layout: auto;
  width: 100%;
}

td {
  font-size: 12px;
}

thead {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #4CAF50;
  color: white;
}
</style>
