<template>
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
                    <tr v-for="(item ,index)  in (arrayTreeObj)" :key="index" >
                        <td  @click="toggle(item, index)" >
                        
                            <span class="q-tree-link q-tree-label" v-bind:style="setPadding(item)" >                
                                 <q-icon  style="cursor: pointer;" :name="iconName(item)" color="secondary"  />
                                {{item.name}}
                            </span>
                        
                        </td>
                        <td>{{item.description}}</td>
                        <td>{{item.niif_account}} </td>
                        <td> 
                        <kButton color="secondary" iconname="add_circle" tooltiplabel="Agregar Categoría" @click="edit(cell)"></kButton>
                         <kButton  v-if="item.isEditable==true" color="secondary"   iconname="edit" tooltiplabel="Editar" @click="edit(cell)"></kButton>
                        <kButton v-if="item.isEditable==true" color="red"  iconname="delete" tooltiplabel="Eliminar Categoría" @click="deleteRow(cell)"></kButton>                        
                        </td>
                    </tr>
                </tbody>
           </table>
           
 
</template>

<script>
import { Toast, QIcon, QModal, QModalLayout} from "quasar-framework";
import kButton from '../tables/Button.vue'
import axios from "axios";

export default {
  props: {
    columns: {
      type: [Array, Object],
      default: () => []
    },
    route: {
      type: String,
      default: null
    }
  },
  components: {
    QIcon,kButton,QModal, QModalLayout
  },
  data() {
    return {
      table: [],
      itemId: null,
      isExpend: true
    };
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

    fetchData() {
      let vm = this;
      if (vm.route.length > 0) {
        axios
          .get(`/api/${vm.route}`)
          .then(function(response) {
            vm.$set(vm, "table", response.data);
            //console.log("tree datos reales", response.data);
          })
          .catch(function(error) {
            if (error.response.data.message) {
              Toast.create.negative(error.response.data.message);
            }
            if (error.response.data.redirectTo) {
              vm.$router.replace(`${error.response.data.redirectTo}`);
            }
          });
      }
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
