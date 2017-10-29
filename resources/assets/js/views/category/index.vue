<template>
  <div class="layout-padding row ">
    <div style="width: 500px; max-width: 90vw;">
      <treetable
        :dataTree="table"
      />
      
   
           
    </div>
  </div>
</template>

<script>
import { Toast, QIcon } from "quasar-framework";
import treetable from '../../components/treeTable/TreeTable.vue';

export default {
  components: {
    QIcon, treetable
  },
  data() {
    return {
     table: [
        {
          id: 1,
          name: "John",
          score: 130,
          city: "New York",
          birthday: "1980/2/5",
          children: [
            {
              id: 6,
              name: "John2",
              score: 82,
              city: "San Fran1",
              birthday: "1990/1/21"
            },
            {
              id: 7,
              name: "John2",
              score: 81,
              city: "San Fran2",
              birthday: "1990/1/22",
              children: [
                {
                  id: 8,
                  name: "John3",
                  score: 89,
                  city: "San Francisco",
                  birthday: "1990/1/21"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          name: "Alice",
          score: 123,
          city: "Washington",
          birthday: "1984/3/7"
        },
        {
          id: 3,
          name: "Lee",
          score: 149,
          city: "Shanghai",
          birthday: "1986/10/8"
        },
        {
          id: 4,
          name: "Mike",
          score: 100,
          city: "London",
          birthday: "1988/8/12"
        },
        {
          id: 5,
          name: "Tom",
          score: 89,
          city: "San Francisco",
          birthday: "1990/1/21",
          children: [
            {
              id: 9,
              name: "Tom1",
              score: 77,
              city: "San Francisco",
              birthday: "1990/1/21"
            },
            {
              id: 10,
              name: "Tom2",
              score: 85,
              city: "San Francisco",
              birthday: "1990/1/21"
            },
            {
              id: 11,
              name: "Tom3",
              score: 83,
              city: "San Francisco",
              birthday: "1990/1/21"
            }
          ]
        }
      ]
    };
  },
  computed: {
  },
  methods: {
 
  },
  created() {
   
  },
  filters: {}
};
</script>