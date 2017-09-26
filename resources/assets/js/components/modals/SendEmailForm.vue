<template>
    <div class="layout-padding row justify-center">
        <div style="width: 500px; max-width: 90vw;">
            <q-modal ref="emailModalForm" minimized :content-css="{padding: '20px'}">
                <q-btn flat icon="add" style="float: right;" @click="openNewEmailModal()" color="green">
                    Nuevo destinatario
                </q-btn>
                <h5>ENVIAR EMAIL</h5>

                <q-select multiple chips color="green" float-label="SELECCIONE LOS DESTINATARIOS" v-model="email.to" :options="listOfEmails" />
                <q-input color="green" v-model="email.subject" float-label="ASUNTO" />
                <vue-editor v-model="email.body"></vue-editor>
                <br>
                <q-btn outline color="red" @click="$refs.emailModalForm.close()">Cerrar</q-btn>
                <q-btn @click="send()" color="green">Enviar</q-btn>

            </q-modal>

            <q-modal ref="emailModalForm_AddEmail" minimized :content-css="{padding: '20px'}">
                <q-field icon="email" helper="Solo está permitido adicionar un único destinatario" :count="50">
                    <q-input color="green" clearable v-model="newEmail" float-label="EMAIL" />
                </q-field>
                <br>
                <q-btn flat color="red" @click="$refs.emailModalForm_AddEmail.close()">Cancelar</q-btn>
                <q-btn @click="addNewEmail()" color="green">Agregar</q-btn>

            </q-modal>
        </div>
    </div>
</template>
 
 <script>
import { VueEditor } from 'vue2-editor';
import { QModal, QBtn, QSelect, QInput, QField, QTooltip, Toast, Dialog, Loading, QSpinnerIos, } from 'quasar-framework';
import axios from 'axios';

export default {

    components: {
        VueEditor,
        QModal, QBtn, QSelect, QInput, QTooltip, QField, QSpinnerIos,
    },
    data() {
        return {
            email: {
                subject: '',
                body: '',
                to: [],
                additional_emails: [],
                model_from: '',
                public_id: ''
            },
            newEmail: '',
            path: '',
            errors: '',
            listOfEmails: []
        }
    },
    methods: {
        send() {
            var vm = this;
            if (vm.email.to.length) {
                Dialog.create({
                    title: 'Confirmar envio',
                    message: 'Estas seguro de enviar este correo?',
                    buttons: [
                        {
                            label: 'Cancelar',
                            color: 'orange',
                            handler() {
                                Toast.create('Has cancelado el envio del correo')
                            }
                        },
                        {
                            label: 'SI! ESTOY SEGURO',
                            color: 'positive',
                            handler() {
                                vm.submit();
                            }
                        }
                    ]
                })
            }
            else {
                Toast.create.warning('Debe adicionar por lo menos un destinatario')
            }
        },
        addNewEmail() {
            var vm = this;
            if (vm.newEmail) {
                vm.listOfEmails.push({
                    label: vm.newEmail,
                    value: vm.newEmail
                })
                vm.email.to.push(vm.newEmail
                )
                vm.newEmail = '';
            }
        },
        openNewEmailModal() {
            this.newEmail = '';
            this.$refs['emailModalForm_AddEmail'].open();
        },
        open(_documentID, _path, _model) {
            this.email.public_id = _documentID;
            this.path = _path;
            this.email.model_from = _model;
            this.email.to = [];
            this.listOfEmails = [];
            this.fetchData();
            this.$refs['emailModalForm'].open();
        },
        fetchData() {
            var vm = this;
            if (vm.path) {
                axios.get(`/api/${vm.path}/${vm.email.public_id}`)
                    .then(function (response) {
                        vm.$set(vm.$data.email, 'body', response.data.body);
                        vm.$set(vm.$data.email, 'subject', response.data.subject);
                        if (response.data.to) {
                            vm.listOfEmails.push({
                                label: response.data.to,
                                value: response.data.to
                            })
                            vm.email.to.push(response.data.to)
                        }

                        vm.$set(vm.$data.email, 'additional_emails', response.data.additional_emails);

                    })
                    .catch(function (error) {
                        console.log(error.data);
                        vm.$set(vm.$data, 'errors', error);
                    })
            }
        },
        submit() {
            var vm = this;
            Loading.show({
                message: 'Por favor espere un momento',
                spinner: QSpinnerIos,
            })
            axios.post('/api/sendEmailToContact/', vm.email)
                .then(function (response) {
                    Loading.hide()
                    if (response.data.created) {
                        Toast.create.positive('Se ha enviado el correo al destinatario seleccionado')
                    } else {
                        Toast.create.negative('OOPS! no fue posible enviar el correo... Intente de nuevo')
                    }

                })
                .catch(function (error) {
                    Loading.hide()
                    Toast.create.negative('OOPS! no fue posible enviar el correo... Intente de nuevo')
                    //Vue.set(vm.$data, 'errors', error.response.data);
                });

        }
    },
}
</script>