import axios from 'axios'
import {
  Loading, QSpinnerMat
} from 'quasar-framework'

async function getByPathAsync (path) {
  try {
    const { data } = await axios.get(`/api/${path}`)
    return data
  } catch (e) { }
}

export default {
  getByPathAsync
}

export function getByPath (route, path, success, fail) {
  axios.get(`/api/${path}`)
    .then(function (response) {
      success(response.data)
    })
    .catch(function (error) {
      fail(error)
    })
}

export function store (payload, success, fail) {
  Loading.show({ spinner: QSpinnerMat, message: 'Por favor espere un momento' })
  axios[payload.method](`/api/${payload.store}`, payload.form)
    .then(function (response) {
      Loading.hide()
      success(response.data)
    })
    .catch(function (error) {
      Loading.hide()
      fail(error.response)
    })

}