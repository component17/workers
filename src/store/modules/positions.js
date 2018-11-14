
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
        }
    },
    actions: {
        GET_POSITIONS_LIST({commit, dispatch, state}){
            return new Promise((resolve, reject) => {
                r.table('employees_positions').orderBy('name').filter({deletedAt: null}).run(conn, (err, cursor) => {
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
                r.table('employees_positions').insert({
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
        }
    }
};

export default store;