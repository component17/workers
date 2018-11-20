import Vue from 'vue';

const store = {
    namespaced: true,
    state: {
        list: null,

        current_employee: null

    },
    mutations: {
        GET_EMPLOYEES_LIST(state, array){
            state.list = array;
        },
        CREATE_NEW_EMPLOYEE(state, object){
            state.list.push(object);
        },
        GET_EMPLOYEE(state, object = null){
            state.current_employee = object;
        },
        DELETE_EMPLOYEE(state, array){
            let new_list;
            for(let i in array){
                for(let j in state.list){
                    if(state.list[j].id !== array[i]){
                        new_list.push(state.list[j]);
                    }
                }
            }

            state.list = new_list;
        },
        UPDATE_CURRENT(state, object){

            for(let i in object){
                console.log(i, object[i]);
                Vue.set(state.current_employee, i, object[i])
            }
        }
    },
    actions: {
        GET_EMPLOYEES_LIST({commit, dispatch, state}){
            return new Promise((resolve, reject) => {
                try{
                    r.table('employees').orderBy('name').filter({deletedAt: null}).merge(row => { return {'position': r.table('employees_positions').get(row('position'))} })
                    .run(conn, (err, cursor) => {
                        if(err){
                            console.error('Error 1: ', err);
                            reject(err);
                        }
                        cursor.toArray((err, data) => {
                            if(err){
                                console.error('Error 2: ', err);
                                reject(err)
                            }
                            commit('GET_EMPLOYEE');
                            commit('GET_EMPLOYEES_LIST', data);
                            resolve(data);
                        })
                    });
                }catch(error){
                    console.error('Caused error: ', error)
                }
            });
        },
        CREATE_NEW_EMPLOYEE({commit, dispatch, state}, object){
            return new Promise((resolve, reject) => {
                r.table('employees').insert({
                    deletedAt: null,
                    uid: '',
                    email: '',
                    group_id: '',
                    login: '',
                    password: '',
                    ...object,

                }).run(conn, (error, data) => {
                    if(error){
                        console.error('CREATE_NEW_EMPLOYEE error: ', error);
                        reject(error);
                    }
                    commit('CREATE_NEW_EMPLOYEE', {
                        id: data.generated_keys[0],
                        ...object
                    });
                    resolve(data);
                });
            });
        },
        BLOCK_EMPLOYEE({commit, dispatch, state}, id){
            return new Promise((resolve, reject) => {
                r.table('employees').get(id).update({blocked: false}).run(conn, (error, data) => {
                    if(error){
                        console.error('BLOCK_EMPLOYEE error: ', error);
                        reject(error);
                    }
                    // commit('BLOCK_EMPLOYEE');
                    resolve(data);
                });
            });
        },
        GET_EMPLOYEE({commit, dispatch, state}, id){
            return new Promise((resolve, reject) => {
                r.table('employees').get(id).run(conn, (error, data) => {
                    if(error){
                        console.error('GET_EMPLOYEE error: ', error);
                        reject(error);
                    }
                    commit('GET_EMPLOYEE', data);
                    resolve(data);
                });
            });
        },
        UPDATE_EMPLOYEE({commit, dispatch, state}, {id, data}){
            return new Promise((resolve, reject) => {
                r.table('employees').get(id).update(data).run(conn, (error, response) => {
                    if(error){
                        console.error('UPDATE_EMPLOYEE error: ', error);
                        reject(error);
                    }
                    // commit('GET_EMPLOYEE', data);
                    resolve(response);
                });
            });
        },
        UPDATE_EMPLOYEE_ACCESS({commit, dispatch, state}, {id, data}){
            return new Promise((resolve, reject) => {
                r.table('employees').get(id).update(data).run(conn, (error, response) => {
                    if(error){
                        console.error('UPDATE_EMPLOYEE error: ', error);
                        reject(error);
                    }
                    // commit('GET_EMPLOYEE', data);
                    resolve(response);
                });
            });
        },
        DELETE_EMPLOYEE({commit, dispatch, state}, array){
            return new Promise((resolve, reject) => {
                r.table('employees').filter(
                    function (doc) {
                        return r.expr(array)
                            .contains(doc("id"));
                    }
                ).update({deletedAt: r.now()}).run(conn, (error, response) => {
                    if(error){
                        console.error('DELETE_EMPLOYEE error: ', error);
                        reject(error);
                    }
                    dispatch('GET_EMPLOYEES_LIST');

                    resolve(response);
                });
            });
        },
    }
};

// function populate(connect, left, rigth, field){
//     return new Promise((resolve, reject) => {
//         try{
//             r.table(left).filter({deletedAt: null})
//                 .merge(row => { field: r.table(rigth).get(row('position')) })
//                 .run(conn, (err, cursor) => {
//                     if(err){
//                         console.error('Error 1: ', err);
//                         reject(err);
//                     }
//                     cursor.toArray((err, data) => {
//                         if(err){
//                             console.error('Error 2: ', err);
//                             reject(err)
//                         }
//                         commit('GET_EMPLOYEE');
//                         commit('GET_EMPLOYEES_LIST', data);
//                         resolve(data);
//                     })
//                 });
//         }catch(error){
//             console.error('Caused error: ', error)
//         }
//     })
// }

export default store;