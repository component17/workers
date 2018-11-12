// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import uPoint from 'upoint-vue-ui';
import locale from 'upoint-vue-ui/locale/lang/ru-RU'

import 'upoint-vue-ui/assets/css/main.css'
import './assets/main.css'

import draggable from 'vuedraggable'

import workersList from './components/workersList'
import permissions from './components/permissions'
import functions from './components/functions'
import settingWorkerCard from './components/settingWorkerCard'

import newWorkerInfo from './components/newWorker/info'
import newWorkerAccessPO from './components/newWorker/accessPO'
import newWorkerContacts from './components/newWorker/contacts'
import newWorkerPassport from './components/newWorker/passport'


import workTable from './components/workTable'

Vue.component('draggable', draggable);

Vue.component('workersList', workersList);
Vue.component('permissions', permissions);
Vue.component('functions', functions);
Vue.component('settingWorkerCard', settingWorkerCard);

Vue.component('newWorkerInfo', newWorkerInfo);
Vue.component('newWorkerAccessPO', newWorkerAccessPO);
Vue.component('newWorkerContacts', newWorkerContacts);
Vue.component('newWorkerPassport', newWorkerPassport);


Vue.component('workTable', workTable);

Vue.use(uPoint, {size: 'mini', locale});


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
