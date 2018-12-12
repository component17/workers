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
        GET_EMPLOYEES_LIST({commit, dispatch, state}, obj){
            let count = 0;
            if(obj === undefined){
                obj = {
                    query: '',
                    gender: '',
                    order: {
                        name: 'createdAt',
                        sort: 'ascending'
                    },
                    limit: 10,
                    page: 0,
                }
            }
            // for(let i in obj){
            //     if(obj[i] === undefined){
            //         switch (i){
            //             case 'query':
            //                 obj.query = '';
            //                 break;
            //             case 'gender':
            //                 obj.gender = '';
            //                 break;
            //             case 'order':
            //                 obj.order = {
            //                     name: 'createdAt',
            //                     sort: 'ascending'
            //                 };
            //                 break;
            //             case 'limit':
            //                 obj.limit = 10;
            //                 break;
            //             case 'page':
            //                 obj.page = 1;
            //                 break;
            //         }
            //     }
            // }
            return new Promise(async (resolve, reject) => {
                try{
                    await r.table('employees').filter((user) => {
                        if(obj.query.length && obj.gender.length){
                            return user('full').match(`${obj.query}`)
                                .and(user('gender').eq(obj.gender))
                                .and(user('deletedAt').eq(null))
                        }
                        if(obj.query.length){
                            return user('full').match(`${obj.query}`)
                                .and(user('deletedAt').eq(null))
                        }
                        if(obj.gender.length){
                            return user('gender').eq(`${obj.gender}`)
                                .and(user('deletedAt').eq(null))
                        }
                        return user('deletedAt').eq(null);
                    }).count().run(conn, (err, data) => {
                        count = data;
                        }
                    );

                    if(obj.order.name === null || obj.order.sort === null){
                        obj.order = {
                            name: 'full',
                            sort: 'ascending'
                        }
                    }

                    let order = obj.order.sort === 'ascending' ? obj.order.name : r.desc(obj.order.name);

                    await r.table('employees').orderBy(order).filter((user) => {
                        if(obj.query.length && obj.gender.length){
                            return user('full').match(`${obj.query}`)
                                .and(user('gender').eq(obj.gender))
                                .and(user('deletedAt').eq(null))
                        }
                        if(obj.query.length){
                            return user('full').match(`${obj.query}`)
                                .and(user('deletedAt').eq(null))
                        }
                        if(obj.gender.length){
                            return user('gender').eq(`${obj.gender}`)
                                .and(user('deletedAt').eq(null))
                        }
                        return user('deletedAt').eq(null);
                    }).merge(
                        row => {
                            return {
                                'position': r.table('employees_positions').get(row('position')),
                            }
                        }
                    ).skip((obj.page * obj.limit) - obj.limit).limit(obj.limit)
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
                            commit('GET_EMPLOYEES_LIST', {items: data, count: count});
                            resolve({items: data, count: count});
                        })
                    });
                }catch(error){
                    console.error('Caused error: ', error)
                }
            });
        },
        async CREATE_NEW_EMPLOYEE({commit, dispatch, state}, object){
            return new Promise((resolve, reject) => {
                generatePinCode().then(pin => {
                    console.log('Empty pin code is: ', pin)
                    return pin;
                }).then((pin) => {
                    r.table('employees').insert({
                        createdAt: r.now(),
                        deletedAt: null,
                        uid: '',
                        email: '',
                        group_id: '',
                        login: '',
                        password: pin,
                        full: `${object.surname} ${object.name}${object.patronymic !== '' ? ' ' + object.patronymic : ''}`,
                        ...object,

                    }).run(conn, (error, data) => {
                        if(error){
                            console.error('CREATE_NEW_EMPLOYEE error: ', error);
                            reject(error);
                        }
                        // commit('CREATE_NEW_EMPLOYEE', {
                        //     id: data.generated_keys[0],
                        //     ...object
                        // });
                        resolve(data);
                    });
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
        CHECK_PIN_DUBLICATE({commit, dispatch, state}, pin){
            try{
                return new Promise((resolve, reject) => {
                    r.table('employees').filter({password: pin}).run(conn, (error, cursor) => {
                        if(error) rejecct(error);
                        cursor.toArray((err, data) => {
                            if(err){
                                reject(err)
                            }

                            console.log('Request data: ', data);
                            if(!data.length){
                                resolve(true);
                            }else{
                                resolve(false);
                            }
                        });
                    });
                });
            }catch(err){
                console.log('Check pin-code error: ', err);
            }
        }
    }
};

function generatePinCode(){
    return new Promise((resolve, reject) => {
        Vue.prototype.$pin.generatePin(6, pin => {
            console.log('Get pin code: ', pin);
            r.table('employees').filter({password: pin}).run(conn, (error, cursor) => {
                if(error) rejecct(error);
                cursor.toArray((err, data) => {
                    if(err){
                        reject(err)
                    }

                    console.log('Request data: ', data, '\nPin is: ', pin);

                    if(!data.length){
                        resolve(pin);
                    }else{
                        generatePinCode();
                    }
                });
            });



            // dispatch('CHECK_PIN_DUBLICATE', pin).then(res => {
            //     console.log('Get result: ', res);
            //     if(res) resolve(pin);
            //     else generatePinCode();
            // });
        });
    });
}

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