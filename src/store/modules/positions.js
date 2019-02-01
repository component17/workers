import Vue from 'vue'

const store = {
    namespaced: true,
    state: {
        list: null,

    },
    mutations: {
        GET_POSITIONS_LIST(state, array){
            state.list = array;
        },
        CREATE_NEW_POSITION(state, object){
            state.list.push(object);
        },
        UPDATE_POSITION(state, object){
            // Vue.set(state.list[object.index], 'name', object.name);
            state.list[object.index].name = name;
        },
        REMOVE_POSITION(state, id){
            Vue.set(state.list[object.index], 'name', object.name);
        }
    },
    actions: {
        GET_POSITIONS_LIST({commit, dispatch, state}, obj){

            if(obj === undefined){
                obj = {
                    query: '',
                    order: {
                        name: 'createdAt',
                        sort: 'ascending'
                    }
                }
            }

            let order = obj.order.sort === 'ascending' ? obj.order.name : r.desc(obj.order.name);

            return new Promise((resolve, reject) => {
                r.table('workers_positions').orderBy(order).filter(position => {
                    if(obj.query.length){
                        return position('name').match(`${obj.query}`)
                            .and(position('deletedAt').eq(null))
                    }

                    return position('deletedAt').eq(null);
                }).run(conn, (err, cursor) => {
                    if(err){
                        console.error('Error 1: ', err);
                        reject(err);
                    }
                    cursor.toArray((err, data) => {
                        if(err){
                            console.error('Error 2: ', err);
                            reject(err)
                        }
                        commit('GET_POSITIONS_LIST', data);
                        resolve(data);
                    })
                });
            });
        },
        CREATE_NEW_POSITION({commit, dispatch, state}, name){
            return new Promise((resolve, reject) => {
                r.table('workers_positions').insert({
                    createdAt: r.now(),
                    name: name,
                    deletedAt: null
                }).run(conn, (error, data) => {
                    if(error){
                        console.error('CREATE_NEW_POSITION error: ', error);
                        reject(error);
                    }
                    commit('CREATE_NEW_POSITION', {
                        id: data.generated_keys[0],
                        name: name,
                        deletedAt: null
                    });
                    resolve(data);
                });
            });
        },
        UPDATE_POSITION({commit, dispatch, state}, {index, name}){
            return new Promise((resolve, reject) => {
                r.table('workers_positions').get(state.list[index].id).update({
                    name: name,
                }).run(conn, (error, data) => {
                    if(error){
                        console.error('UPDATE_POSITION error: ', error);
                        reject(error);
                    }
                    commit('UPDATE_POSITION', {index, name});
                    resolve(data);
                });
            });
        },
        REMOVE_POSITION({commit, dispatch, state}, array){
            return new Promise((resolve, reject) => {
                r.table('employees_positions').filter(
                    function (doc) {
                        return r.expr(array)
                            .contains(doc("id"));
                    }
                ).update({deletedAt: r.now()}).run(conn, (error, response) => {
                    if(error){
                        console.error('REMOVE_POSITION error: ', error);
                        reject(error);
                    }
                    dispatch('GET_POSITIONS_LIST');

                    resolve(response);
                });
            });
        }
    }
};

export default store;