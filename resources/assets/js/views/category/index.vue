<template>
  <div class="layout-padding docs-tab">
        <kToolbar toolbarlabel="CONFIGURACIÓN DE CATEGORIAS" :showbackButton="false" :showsaveButton="false"></kToolbar>
      <treetable
        :route="path"
      />      

  </div>
</template>

<script>
import { Toast, QIcon } from "quasar-framework";
import treetable from "../../components/treeTable/TreeTable.vue";
import kToolbar from "../../components/Toolbar.vue";

export default {
  components: {
    QIcon,
    treetable,
    kToolbar
  },
  data() {
    return {
      path: "getCategoryAll"
    };
  }
};
</script>
<style lang="stylus">
.docs-tab .q-tabs {
  margin-bottom: 15px;
}
</style>