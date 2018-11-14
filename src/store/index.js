import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        employees: require('./modules/employees').default,
        positions: require('./modules/positions').default,
        groups: require('./modules/groups').default,
    }
});

export default store;