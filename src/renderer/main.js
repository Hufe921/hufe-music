import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import filters from './filters/index'

import http from './services/http/httpAxios'
import api from './services/api'
import utils from './utils'

import './assets/styles/theme.scss'
import Element from 'element-ui'

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(Element, {
  size: 'small'
})

Vue.prototype.$utils = utils
Vue.prototype.$http = http
Vue.prototype.$api = api

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: {
    App
  },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
