<template>
       <table class="q-table bordered cell-separator highlight">
                <thead>
                    <tr>
                        
                        <td>Nombre</td>
                        <td>Ciudad</td>
                        <td>Fecha</td>
                        <td>Score</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item ,index)  in (arrayTreeObj)" :key="index" >
                        <td class="q-tree-link q-tree-label" @click="toggle(item, index)">
                        
                            <span v-bind:style="setPadding(item)" >                
                                 <q-icon  style="cursor: pointer;" :name="iconName(item)" color="green-4"  />
                                {{item.name}}
                            </span>
                        
                        </td>
                        <td>{{item.city}}</td>
                        <td>{{item.birthday}} </td>
                        <td>{{item.score}}</td>
                    </tr>
                </tbody>
           </table>
           
 
</template>

<script>
import { Toast, QIcon } from "quasar-framework";

export default {
  props: {
    dataTree: {
      type: Array,
      default: () => []
    },
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
    QIcon
  },
  data() {
    return {
      autoID: 0,
      itemId: null,
      isExpend: true
    };
  },
  computed: {
    arrayTreeObj() {
      let vm = this;
      var newObj = [];
      vm.recursive(vm.dataTree, newObj, 0, vm.itemId, vm.isExpend);
      return newObj;
    }
  },
  methods: {
    iconName(item) {
      if (item.expend == true) {
        return "remove_circle_outline";
      }

      if (item.children) {
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

    generateAutoID(tData) {
      let vm = this;
      tData.forEach(function(td) {
        td.__uniqueID = vm.autoID;
        vm.autoID++;
        if (td.children && td.children.length != 0) {
          vm.generateAutoID(td.children);
        }
      });
    },
    fetchData() {}
  },
  created() {},
  filters: {}
};
</script>


<style lang="stylus">
</style>
