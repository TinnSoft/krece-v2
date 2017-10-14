import * as types from '../mutation-types'
import {
    getByPath,
    store
} from '../../api'

import {
    Toast
} from 'quasar-framework'

const state = {
    model: {},
    loading: false,
    processing: false,
    errors: {},
    form: {
        items: []
    },
    option: {}
}

const actions = {

    fetchInvoices({
        commit,
        state
    }, payload) {
        commit(types.LOADING_BEGIN)
        getByPath(state.route, payload.path, function (data) {
            commit(types.SET_ITEMS, data)
            commit(types.LOADING_END)
        }, function (error) {

        })
    },
    async fetchById({
        commit,
        state
    }, payload) {
        commit(types.LOADING_BEGIN)
        commit(types.CLEAN_UP)
        await getByPath(state.route, payload.path, function (data) {
            commit(types.SET_MODEL, data)
            commit(types.LOADING_END)
        }, function (error) {
            //  console.log(error);
        })
    },
    async fetchFormById({
        commit,
        state
    }, payload) {
        commit(types.LOADING_BEGIN)
        await getByPath(state.route, payload.path, function (data) {
            commit(types.SET_MODEL, data)
            commit(types.LOADING_END)
        }, function (error) {

        })
    },
    storeById({
        commit,
        state
    }, payload) {
        commit(types.PROCESS_BEGIN)
        commit(types.CLEAR_FORM_ERROR)
        store(payload, function (data) {
            commit(types.PROCESS_END)
            if (payload.redirect) {
                if (data.id) {
                    payload.router.push(payload.redirect + '/' + data.id)
                } else {
                    payload.router.push(payload.redirect)
                }
            }
            if (data.message) {
                Toast.create.positive(data.message)
            }

        }, function (error) {
            //console.log(error);
            if (error.status === 422) {
                if (error.data.custom_message) {
                    Toast.create.negative(error.data.message[0])
                }
                else {
                    Toast.create.negative('Verifique los datos ingresados')
                }
                commit(types.SET_FORM_ERROR, error)
            }
            commit(types.PROCESS_END)
        })

    }
}

const getters = {

    model(state) {
        return state.model
    },
    /* currency(state) {
         if (state.model.currency) {
             return state.model.currency
         }
         return {}
     },*/
    option(state) {
        return state.option
    },
    form(state) {
        return state.form
    },
    errors(state) {
        return state.errors
    },
    /*
    client(state) {
        if (state.model.client) {
            return state.model.client
        }
        return {}
    },
    sales(state) {
        if (state.model.sales) {
            return state.model.sales
        }
        return {}
    },
    deliveries(state) {
        if (state.model.deliveries) {
            return state.model.deliveries
        }
        return {}
    },
    payments(state) {
        if (state.model.payments) {
            return state.model.payments
        }
        return {}
    },
    purchase(state) {
        if (state.model.purchase) {
            return state.model.purchase
        }
        return {}
    },
    vendor(state) {
        if (state.model.vendor) {
            return state.model.vendor
        }
        return {}
    }*/
}

const mutations = {

    [types.CLEAN_UP](state, payload) {
        state.model = {}
        state.errors = {}
        state.form = {
            items: []
        }
        state.option = {}

    },
    [types.SET_FORM_ERROR](state, payload) {
        state.errors = payload.data
    },
    [types.CLEAR_FORM_ERROR](state, payload) {
        state.errors = {}
    },
    [types.SET_FORM](state, payload) {
        state.option = payload.option
        state.form = payload.form
    },
    [types.SET_MODEL](state, payload) {
        state.model = payload.model
    },
    [types.SET_ITEMS](state, payload) {
        state.form.items = payload.items
    },
    [types.LOADING_BEGIN](state) {
        state.loading = true
    },
    [types.LOADING_END](state) {
        state.loading = false
    },
    [types.PROCESS_BEGIN](state) {
        state.processing = true
    },
    [types.PROCESS_END](state) {
        state.processing = false
    }
}


export default ({
    state,
    actions,
    getters,
    mutations

})