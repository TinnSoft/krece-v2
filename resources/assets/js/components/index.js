import Vue from 'vue'

import Child from './Child.vue'
import {
    HasError,
    AlertError,
    AlertSuccess
} from 'vform'


Vue.component(Child.name, Child)
Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)
Vue.component(AlertSuccess.name, AlertSuccess)