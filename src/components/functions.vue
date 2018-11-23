<template>
    <div class="workersPermissions">
        <div class="workersPermissions__head">
            <div class="workersPermissions__head-search">
                <el-input placeholder="Найти должность" v-model="search_query" @input="searchPosition"></el-input>
            </div>
            <div class="workersPermissions__head-delete">
                <el-button plain @click="delete_several_position_dialog = true" :disabled="!selected.length"><i class="mdi mdi-delete"></i>Удалить выбранные</el-button>
            </div>
        </div>
        <div class="workersPermissions__table">
            <div class="workersPermissions__table">
                <el-table
                        :data="$store.state.positions.list"
                        border
                        @selection-change="handleSelectionChange"
                        @sort-change="handleSortChange"
                        v-loading="is_loading_data"
                        style="width: 100%">
                    <el-table-column type="selection" width="35"></el-table-column>
                    <el-table-column
                            label="Должность"
                            prop="name"
                            sortable>
                        <template slot-scope="scope">
                            {{ scope.row.name }}
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="Действия"
                            width="80px"
                            align="center">
                        <template slot-scope="scope">
                            <el-button type="text" @click="tmp_index = scope.$index; tmp_name = scope.row.name; edit_position_dialog= true"><i class="mdi mdi-pencil"></i></el-button>
                            <el-button type="text"
                                       @click="tmp_name = scope.row.name; tmp_index=scope.row.id; delete_one_position_dialog = true"><i class="mdi mdi-delete"></i></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <el-dialog
                title="Редактировать должность"
                :visible.sync="edit_position_dialog"
                width="520px"
                top="calc(50vh - 90px)"
                :close-on-click-modal="!is_loading_process"
                :close-on-press-escape="!is_loading_process"
                :show-close="!is_loading_process">
            <span>Введите название должности</span>
            <el-input v-model="tmp_name" placeholder="Введите название должности" :disabled="is_loading_process"/>
            <span slot="footer" class="dialog-footer">
                <el-button plain @click="edit_position_dialog = false" :disabled="is_loading_process">Отмена</el-button>
                <el-button type="primary" @click="editPosition" :loading="is_loading_process" :disabled="tmp_name.length < 3">Изменить</el-button>
            </span>
        </el-dialog>
        <!--Удалить группу прав-->
        <el-dialog
                title="Удалить группу прав?"
                :visible.sync="delete_one_position_dialog"
                width="520px"
                top="calc(50vh - 90px)"
                :close-on-click-modal="!is_loading_process"
                :close-on-press-escape="!is_loading_process"
                :show-close="!is_loading_process">
            <span>Вы действительно хотите удалить группу прав <b>{{tmp_name}}</b>? Данное действие невозможно отменить.</span>
            <span slot="footer" class="dialog-footer">
                <el-button plain @click="delete_one_position_dialog = false" :disabled="is_loading_process">Отмена</el-button>
                <el-button type="primary" @click="deletePosition(tmp_index)" :loading="is_loading_process">Удалить</el-button>
            </span>
        </el-dialog>
        <!--Удалить группы прав-->
        <el-dialog
                title="Удалить группы прав?"
                :visible.sync="delete_several_position_dialog"
                width="520px"
                top="calc(50vh - 90px)"
                :close-on-click-modal="!is_loading_process"
                :close-on-press-escape="!is_loading_process"
                :show-close="!is_loading_process">
            <span>Вы действительно хотите удалить выбранные группы прав? Данное действие невозможно отменить.</span>
            <span slot="footer" class="dialog-footer">
                <el-button plain @click="delete_several_position_dialog = false" :disabled="is_loading_process">Отмена</el-button>
                <el-button type="primary" @click="deletePosition()" :loading="is_loading_process">Удалить</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';
    import _ from 'lodash';
    export default {
        data(){
            return{
                is_loading_data: false,
                is_loading_process: false,

                edit_position_dialog: false,
                delete_one_position_dialog: false,
                delete_several_position_dialog: false,

                tmp_index: '',
                tmp_name: '',

                selected: [],
                search_query: '',
                order: {
                    name: 'createdAt',
                    sort: 'ascending'
                }
            }
        },
        watch: {
            edit_position_dialog(value){
                if(!value){
                    setTimeout(() => {
                        this.tmp_index = '';
                        this.tmp_name = '';
                    }, 700);
                }
            },
            delete_one_position_dialog(value){
                if(!value){
                    setTimeout(() => {
                        this.tmp_index = '';
                        this.tmp_name = '';
                    }, 700);
                }
            },
            search_query(val){
                this.is_loading_data = true;
            }
        },
        created(){
            this.getPositions().then(result => {
                console.log(result);
            })
        },
        methods: {
            ...mapActions({
                getPositions: 'positions/GET_POSITIONS_LIST',
                updatePosition: 'positions/UPDATE_POSITION',
                removePosition: 'positions/REMOVE_POSITION',
                // createPosition: 'positions/CREATE_NEW_POSITION',
                // createEmployee: 'employees/CREATE_NEW_EMPLOYEE',
            }),
            searchPosition: _.debounce(
                function(query){
                    this.getPositionsWithParams();
                }, 750
            ),
            getPositionsWithParams(){
                this.getPositions({
                    query: this.search_query,
                    order: this.order
                }).then(() => {
                    this.is_loading_data = false;
                });
            },
            handleSortChange(sort){
                this.is_loading_data = true;
                if(sort.prop === null && sort.order === null){
                    this.order = {
                        name: 'createdAt',
                        sort: 'ascending'
                    };
                }else{
                    this.order = {
                        name: sort.prop,
                        sort: sort.order
                    }
                }
                this.getPositionsWithParams();
            },
            handleSelectionChange(val){
                this.selected = val;
            },
            editPosition(){
                this.is_loading_process = true;

                this.updatePosition({
                    index: this.tmp_index,
                    name: this.tmp_name
                }).then(result => {
                    console.log(result);

                    this.$notify.success({
                        title: 'Успешно',
                        message: `Должность была изменена`,
                        duration: 1750
                    });
                }).catch(error => {
                    if(error !== undefined){
                        this.$notify.error({
                            title: 'Ошибка',
                            message: `${error.response.data.err}`,
                            duration: 1750
                        });
                    }else{
                        this.$notify.error({
                            title: 'Ошибка',
                            message: `Возникли трудности, повторите операцию позже`,
                            duration: 1750
                        });
                    }
                }).then(() => {
                    this.is_loading_process = false;

                    this.edit_position_dialog = false;
                });
            },
            deletePosition(id = null){
                this.is_loading_process = true;

                if(id !== null){
                    this.removePosition([id]).then(result => {
                        this.$notify.success({
                            title: 'Успешно',
                            message: `Должность была удалена`,
                            duration: 1750
                        });
                    }).catch(error => {
                        if(error !== undefined){
                            this.$notify.error({
                                title: 'Ошибка',
                                message: `${error.response.data.err}`,
                                duration: 1750
                            });
                        }else{
                            this.$notify.error({
                                title: 'Ошибка',
                                message: `Возникли трудности, повторите операцию позже`,
                                duration: 1750
                            });
                        }
                    }).then(() => {
                        this.delete_one_position_dialog = false;
                        this.is_loading_process = false;
                    });
                }else{
                    let arr = this.selected.map(item => {
                        return item.id;
                    });

                    this.removePosition(arr).then(result => {
                        this.$notify.success({
                            title: 'Успешно',
                            message: `Должности были удалены`,
                            duration: 1750
                        });
                    }).catch(error => {
                        if(error !== undefined){
                            this.$notify.error({
                                title: 'Ошибка',
                                message: `${error.response.data.err}`,
                                duration: 1750
                            });
                        }else{
                            this.$notify.error({
                                title: 'Ошибка',
                                message: `Возникли трудности, повторите операцию позже`,
                                duration: 1750
                            });
                        }
                    }).then(() => {
                        this.delete_several_position_dialog = false;
                        this.is_loading_process = false;
                    });
                }
            }
        }
    }
</script>

<style scoped>

</style>
