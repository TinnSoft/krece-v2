import axios from 'axios'
import store from '../store'
import router from '../router'
import swal from 'sweetalert2'

axios.interceptors.request.use(request => {
  if (store.getters.authToken) {
    request.headers.common['Authorization'] = `Bearer ${store.getters.authToken}`
  }

  // request.headers['X-Socket-Id'] = Echo.socketId()

  return request
})

axios.interceptors.response.use(response => response, error => {
  const { status } = error.response

  if (status >= 500) {
    swal({
      type: 'error',
      title: swal.i18n.t('error_alert_title'),
      // title: 'errror',
      // text: 'Algo ha pasado, por favor revise'
      text: swal.i18n.t('error_alert_text')
    })
  }

  if (status === 401 && store.getters.authCheck) {
    swal({
      type: 'warning',
      title: 'Su sesion ha expirado!',
      html: 'Por favor ingresa tus credenciales nuevamente.'
    })
    .then(async () => {
      await store.dispatch('logout')

      router.push({ name: 'login' })
    })
  }

  return Promise.reject(error)
})
