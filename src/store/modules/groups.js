
const store = {
    namespaced: true,
    state: {
        list: null,

        permissions: null,

        current_group: null,
        current_group_permissions: null,

        current_permissions: null,

    },
    mutations: {
        GET_GROUPS_LIST(state, array){
            let arr = [];
            for(let i in array){
                if(!array[i].isAdmin){
                    arr.push(array[i]);
                }else{
                    arr.unshift(array[i]);
                }
            }
            state.list = arr;
        },
        GET_CURRENT_GROUP(state, data = null){
            if(data === null){
                state.current_group = data;
                state.current_group_permissions = data;
            }else{
                for(let i in state.list){
                    if(state.list[i].id === data.id){
                        state.current_group = state.list[i];
                    }
                }
                state.current_group_permissions = data.object;
            }
        },
        GET_PERMISSIONS(state, object = null){
            state.permissions = object;
        },

        GET_CURRENT_PERMISSIONS(state, data = null){
            state.current_permissions = data;

        },
    },
    actions: {
        GET_GROUPS_LIST({commit, dispatch, state}){
            return new Promise((resolve, reject) => {
                try{
                    upoint.uPassport.permissions.getAll().then(res => {

                        commit('GET_GROUPS_LIST', res)
                        resolve(res);
                    });
                }catch(error){
                    console.error('Caused error: ', error)
                }
            });
        },
        GET_PERMISSIONS_LIST(){},
        GET_CURRENT_PERMISSIONS({commit, dispatch, state}, id = null){
            return new Promise((resolve, reject) => {
                try{
                    if(id !== null){
                        upoint.uPassport.permissions.getCurrentPermissions(id).then(res => {
                            commit('GET_CURRENT_PERMISSIONS', res);
                            resolve(res);
                        });
                    }else{
                        commit('GET_CURRENT_PERMISSIONS');
                    }

                }catch(error){
                    console.error('Caused error: ', error)
                }
            });
        },

        GET_CURRENT_GROUP({commit, dispatch, state}, id = null){
            return new Promise((resolve, reject) => {
                try{
                    if(id !== null){
                        upoint.uPassport.permissions.getCurrentPermissions(id).then(res => {

                            commit('GET_PERMISSIONS');
                            commit('GET_CURRENT_GROUP', {id: id, object: res});
                            resolve(res);
                        });
                    }else{
                        upoint.uPassport.permissions.getPermissions().then(res => {

                            commit('GET_CURRENT_GROUP');
                            commit('GET_PERMISSIONS', res);
                            resolve(res);
                        });
                    }

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