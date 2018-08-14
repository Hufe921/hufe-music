import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import http from './services/http/httpAxios'
import api from './services/api'
import utils from './utils'

import 'element-ui/lib/theme-chalk/index.css'
import Element from 'element-ui'
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
