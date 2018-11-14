
const store = {
    namespaced: true,
    state: {
        list: null,

    },
    mutations: {
        GET_GROUPS_LIST(state, array){
            state.list = array;
        },
        // CREATE_NEW_EMPLOYEE(state, object){
        //     state.list = object;
        // },
        // GET_EMPLOYEE(state, object = null){
        //     state.current_employee = object;
        // },
    },
    actions: {
        GET_GROUPS_LIST({commit, dispatch, state}){
            return new Promise((resolve, reject) => {
                try{
                    const groups = upoint.conf.allGroups;

                    commit('GET_GROUPS_LIST', groups)
                    resolve(groups);
                }catch(error){
                    console.error('Caused error: ', error)
                }
            });
        },
        // CREATE_NEW_EMPLOYEE({commit, dispatch, state}, object){
        //     return new Promise((resolve, reject) => {
        //         r.table('employees').insert({
        //             deletedAt: null,
        //             blocked: false,
        //             ...object
        //         }).run(conn, (error, data) => {
        //             if(error){
        //                 console.error('CREATE_NEW_EMPLOYEE error: ', error);
        //                 reject(error);
        //             }
        //             commit('CREATE_NEW_EMPLOYEE', {
        //                 id: data.generated_keys[0],
        //                 ...object
        //             });
        //             resolve(data);
        //         });
        //     });
        // },
        // BLOCK_EMPLOYEE({commit, dispatch, state}, id){
        //     return new Promise((resolve, reject) => {
        //         r.table('employees').get(id).update({blocked: false}).run(conn, (error, data) => {
        //             if(error){
        //                 console.error('BLOCK_EMPLOYEE error: ', error);
        //                 reject(error);
        //             }
        //             // commit('BLOCK_EMPLOYEE');
        //             resolve(data);
        //         });
        //     });
        // },
        // GET_EMPLOYEE({commit, dispatch, state}, id){
        //     return new Promise((resolve, reject) => {
        //         r.table('employees').get(id).run(conn, (error, data) => {
        //             if(error){
        //                 console.error('GET_EMPLOYEE error: ', error);
        //                 reject(error);
        //             }
        //             commit('GET_EMPLOYEE', data);
        //             resolve(data);
        //         });
        //     });
        // },
    }
};

export default store;