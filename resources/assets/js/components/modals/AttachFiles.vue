<template>
  <div class="layout-padding justify-center">
    <div style="width: 300px; max-width: 90vw;">

      <q-modal ref="attachFileModal" minimized :content-css="{padding: '20px'}">
        <q-btn @click="$refs.attachFileModal.close()" style="float: right;" color="grey" flat>
          CERRAR
        </q-btn>
        <h6 class="text-center">GESTION DE ARCHIVOS</h6><br>

        <q-item-separator />
        <small>Aquí podrás gestionar los archivos del documento actual</small>
        <q-field :helper="helper">
          <q-uploader ref="testx" @finish="endUpload($refs)" :additionalFields="additionalfields" float-label="Seleccione un archivo" color="light-green-6" :url="url" />

        </q-field>

        <q-list v-if="documentList.length >0" class="no-margin no-padding">
          <q-list-header inset>ARCHIVOS ACTUALES</q-list-header>
          <q-item v-for="item in documentList" :key="item">
            <q-btn class="no-margin no-padding" @click="downloadFile(item.id)" icon="file_download" color="secondary" flat></q-btn>
            <q-item-main>
              <q-item-tile label>
                <small>{{item.filename}}</small>
              </q-item-tile>
              <q-item-tile sublabel>Cargado: {{item.created_at}}</q-item-tile>
            </q-item-main>
            <q-btn @click="deleteRow(item.id)" class="no-margin no-padding" style="float: right;" icon="close" color="red" flat></q-btn>
          </q-item>
        </q-list>
      </q-modal>
    </div>
  </div>
</template>

<script>
import {
  QList, QModal, QSpinner,
  QListHeader,
  QItem, Toast,
  QItemSeparator,
  QItemSide,
  QItemMain, QField, QSpinnerGears,
  QItemTile, QBtn, QCard, QCardTitle, QCardMain,
  QToolbar, QToolbarTitle, QIcon, QUploader, QInput
} from 'quasar-framework'

import axios from 'axios'

export default {
  data() {
    return {
      url: '/api/document',
      error: false,
      helper: 'Recuerda que el tamaño máximo de los archivos a cargar es de 2MB',
      documentList: [],
      model: '',
      public_id: '',
      additionalfields: []
    }
  },
  components: {
    QList, QModal,
    QListHeader,
    QItem,
    QItemSeparator,
    QItemSide,
    QItemMain, QField,
    QItemTile, QBtn, QCard, QCardTitle, QCardMain,
    QToolbar, QToolbarTitle, QIcon, QUploader, QInput
  },

  methods: {
    endUpload(ref) {
       console.log(ref.testx);
      if (ref.testx.files[0].__failed == true) {
        Toast.create.negative('Algo salió mal con la carga del archivo, intente nuevamente');
      }
      else {
        Toast.create.positive('Se cargó el archivo correctamente');
      }
      this.fetchData(); 

    },
    fetchData() {
      var vm = this;
      axios.get(`/api/getDocuments/${vm.public_id}/${vm.model}`)
        .then(function(response) {
          vm.$set(vm.$data, 'documentList', response.data.list);
        })
        .catch(function(error) {
        })

    },
    downloadFile(id) {
      var vm = this;
      axios.get(`/api/downloadDocuments/${id}`)
        .then(function(response) {
          // console.log(response.data);
        })
        .catch(function(error) {
        })

    },
    deleteRow(id) {
      var vm = this
      if (id) {
        axios.delete('/api/deleteDocuments/' + id)
          .then(function(response) {
            if (response.data.deleted) {
              vm.fetchData();
              Toast.create.positive('Se eliminó el archivo correctamente');
            }
          })
          .catch(function(error) {

            Toast.create.negative('No se pudo eliminar el archivo, intente nuevamente');
          })
      }
    },
    open(id, model) {
      this.model = model;
      this.public_id = id;

      this.additionalfields = [
        {
          name: 'model', value: model
        },
        {
          name: 'publicID', value: id
        }
      ];

      let data = new FormData();;
      this.$refs['attachFileModal'].open();
      this.fetchData();
    },
  }
}
</script>
<style>
.inputfile+label {
  font-size: 1.25em;
  font-weight: 700;
  color: white;
  background-color: black;
  display: inline-block;
}

.inputfile:focus+label,
.inputfile+label:hover {
  background-color: red;
}
</style>