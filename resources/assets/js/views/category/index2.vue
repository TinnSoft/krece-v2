<template >
  <div class="layout-padding docs-tab">
    <div id="example">
      <zk-table ref="table" sum-text="sum" index-text="#" :data="data" :columns="columns" :stripe="props.stripe" :border="props.border" :show-header="props.showHeader" :show-summary="props.showSummary" :show-row-hover="props.showRowHover" :show-index="props.showIndex" :tree-type="props.treeType" :is-fold="props.isFold" :expand-type="props.expandType" :selection-type="props.selectionType">
        <template slot="$expand" scope="scope">
          {{ `My name is ${scope.row.name}, this rowIndex is ${scope.rowIndex}.` }}
        </template>
        <template slot="likes" scope="scope">
          {{ scope.row.likes.join(',') }}
        </template>
      </zk-table>
    </div>
  </div>
</template>

<script>
import ZkSwitch from './Switch/Switch.vue';

export default {
  name: 'example',
  components: {
    ZkSwitch,
  },
  data() {
    return {
      props: {
        stripe: false,
        border: false,
        showHeader: true,
        showSummary: false,
        showRowHover: true,
        showIndex: false,
        treeType: true,
        isFold: true,
        expandType: false,
        selectionType: false,
      },
      data: [
        {
          name: 'Jack',
          description: 'male',
          likes: ['football', 'basketball'],
          score: 10,
          children: [
            {
              name: 'Ashley',
              description: 'female',
              likes: ['football', 'basketball'],
              score: 20,
              children: [
                {
                  name: 'Ashley',
                  description: 'female',
                  likes: ['football', 'basketball'],
                  score: 20,
                },
                {
                  name: 'Taki',
                  description: 'male',
                  likes: ['football', 'basketball'],
                  score: 10,
                  children: [
                    {
                      name: 'Ashley',
                      description: 'female',
                      likes: ['football', 'basketball'],
                      score: 20,
                    },
                    {
                      name: 'Taki',
                      description: 'male',
                      likes: ['football', 'basketball'],
                      score: 10,
                      children: [
                        {
                          name: 'Ashley',
                          description: 'female',
                          likes: ['football', 'basketball'],
                          score: 20,
                        },
                        {
                          name: 'Taki',
                          description: 'male',
                          likes: ['football', 'basketball'],
                          score: 10,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: 'Taki',
              description: 'male',
              likes: ['football', 'basketball'],
              score: 10,
            },
          ],
        },
        {
          name: 'Tom',
          description: 'male',
          likes: ['football', 'basketball'],
          score: 20,
          children: [
            {
              name: 'Ashley',
              description: 'female',
              likes: ['football', 'basketball'],
              score: 20,
              children: [
                {
                  name: 'Ashley',
                  description: 'female',
                  likes: ['football', 'basketball'],
                  score: 20,
                },
                {
                  name: 'Taki',
                  description: 'male',
                  likes: ['football', 'basketball'],
                  score: 10,
                },
              ],
            },
            {
              name: 'Taki',
              description: 'male',
              likes: ['football', 'basketball'],
              score: 10,
              children: [
                {
                  name: 'Ashley',
                  description: 'female',
                  likes: ['football', 'basketball'],
                  score: 20,
                },
                {
                  name: 'Taki',
                  description: 'male',
                  likes: ['football', 'basketball'],
                  score: 10,
                },
              ],
            },
          ],
        },
        {
          name: 'Tom',
          description: 'male',
          likes: ['football', 'basketball'],
          score: 20,
        },
        {
          name: 'Tom',
          description: 'male',
          likes: ['football', 'basketball'],
          score: 20,
          children: [
            {
              name: 'Ashley',
              description: 'female',
              likes: ['football', 'basketball'],
              score: 20,
            },
            {
              name: 'Taki',
              description: 'male',
              likes: ['football', 'basketball'],
              score: 10,
            },
          ],
        },
      ],
      columns: [
        {
          label: 'Nombre',
          prop: 'name',
          width: '400px',
        },
        {
          label: 'Descripcción',
          prop: 'description',
          minWidth: '50px',
        },
        {
          label: '# de Cuenta',
          prop: 'account',
        },
        {
          label: 'Acciones',
          prop: 'actions',
          minWidth: '200px',
          type: 'template',
          template: 'likes',
        },
      ],
    };
  },
  computed: {
    propList() {
      return Object.keys(this.props).map(item => ({
        name: item,
      }));
    },
  },
  methods: {
  },
};
</script>

<style scoped >
* {
  margin: 0;
  padding: 0;
}

.switch-list {
  margin: 20px 0;
  list-style: none;
  overflow: hidden;
}

.switch-item {
  margin: 20px;
  float: left;
}
</style>