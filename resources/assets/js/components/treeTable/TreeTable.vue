<template>
       <table class="q-table bordered cell-separator">
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>Name</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item ,index)  in (arrayTreeObj)" :key="index" >
                        <td>
                            <span v-bind:style="setPadding(item)">                
                                 <q-icon  style="cursor: pointer;" :name="iconName(item)" color="green" @click="toggle(item, index)" />
                                {{item.id}}
                            </span>
                        </td>
                        <td>{{item.name}}</td>
                        <td>{{index}}} </td>
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
    }
  },
  components: {
    QIcon
  },
  data() {
    return {
      autoID: 0,
      itemId: null,
      isExpend: true,
      treeData: [],
      treeDataClone: [],
    };
  },
  computed: {
    arrayTreeObj() {
      let vm = this;
      var newObj = [];
      vm.recursive(vm.treeData, newObj, 0, vm.itemId, vm.isExpend);
      return newObj;
    }
  },
  methods: {
    iconName(item) {
      if (item.expend == true) {
        return "remove";
      }

      if (item.leaf == false) {
        return "add";
      }

      return "keyboard_arrow_right";
    },
    toggle(item, index) {
      let vm = this;
      vm.itemId = item.id;
      vm.isExpend = true;      
      item.leaf = false;
      /* if (item.leaf == false && item.expend == false) {
        item.expend = undefined;
        vm.isExpend = false;
        vm.itemId = null;
      }*/

      //Muestra los sub items al dar click en +
      if (
        item.leaf == false &&
        item.expend == undefined &&
        item.children != undefined
      ) {
        //console.log("abrir:", item.__uniqueID);
        if (item.children.length == 0) {
          let originalChildren = vm.getOriginalChildrenData(item.id);
          console.log("abrir", originalChildren);
          // item.children.push(vm.childrenx[0]);
          // item.children= vm.childrenx.slice(0);
          if (originalChildren != null) {
            item.children = originalChildren;
          }
        }

        if (item.children.length != 0) {
          vm.recursive(item.children, [], item.level + 1, item.id, true);
        }
      }

      //Eliminar items cuando se da click en ocultar fila
      if (item.expend == true && item.children != undefined) {
        var __subindex = 0;

        while (item.children.length > 0) {
          //item.children.splice(item.children.length - 1, 1);
          vm.$delete(item.children, item.children.length - 1);
        }
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
    getOriginalChildrenData(uniqueID) {
      let vm = this;
      var valuetoReturn = null;
      vm.dataTree.forEach(function(tdc) {
        if (tdc.id == uniqueID) {
          valuetoReturn = tdc.children;
        }
      });
      return valuetoReturn;
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
    }
  },
  created() {
    let vm = this;
    vm.treeData = vm.dataTree.slice(0);
    vm.treeDataClone = vm.dataTree.slice(0);
  },
  filters: {}
};
</script>