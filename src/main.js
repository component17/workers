// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'

Vue.prototype.$isDeveloper = process.env.NODE_ENV === 'development';
Vue.prototype.$hash = require('object-hash');

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

import pagination from './components/global/pagination'

import workTable from './components/workTable'

import VueLodash from 'vue-lodash'

const options = { name: '_' } // customize the way you want to call it

Vue.use(VueLodash, options) // options is optional

Vue.component('pagination', pagination);
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


Vue.config.productionTip = false;

upoint.db.connect().then(() => {

    // r.tableDrop('counterparties').run(conn)
    // r.tableDrop('counterparties_faces').run(conn)
    // r.tableDrop('counterparties_bank_details').run(conn)
    // r.tableDrop('counterparties_locations').run(conn)

    // r.tableCreate('counterparties').run(conn, () => {
    //     console.log('Table create counterparties')
    // });
    // r.tableCreate('counterparties_faces').run(conn, () => {
    //     console.log('Table create counterparties-faces')
    //     r.table('counterparties_faces').indexCreate('counterparties_id').run(conn)
    // });
    // r.tableCreate('counterparties_bank_details').run(conn, () => {
    //     console.log('Table create counterparties-bank-details')
    //     r.table('counterparties_bank_details').indexCreate('counterparties_id').run(conn)
    // });
    // r.tableCreate('counterparties_locations').run(conn, () => {
    //     console.log('Table create counterparties-locations')
    //     r.table('counterparties_locations').indexCreate('counterparties_id').run(conn)
    // });
}).finally(() => {
    new Vue({
        el: '#app',
        router,
        store,
        components: {App},
        template: '<App/>'
    });
});
