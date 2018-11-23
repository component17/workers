<template>
    <div class="workersList">
        <div class="workersList__head">
            <div class="workersList__head-search">
                <el-input placeholder="Найти сотрудника" v-model="search" @input="searchEmployee"/>
            </div>
            <div class="workersList__head-actions">
                <el-button icon="mdi mdi-delete" :disabled="!selected.length" @click="dialog_delete_workers = true">Удалить выбранные</el-button>
            </div>
        </div>
        <div class="workersList__table">
            <el-table
                    :data="list"
                    border
                    style="width: 100%"
                    v-loading="is_loading_data"
                    @selection-change="handleSelectionChange"
                    @filter-change="showFilter"
                    @sort-change="handleSortChange"
                    :cell-class-name="cellClass">
                <el-table-column
                        type="selection"
                        width="35"
                        :resizable="false">
                </el-table-column>
                <el-table-column
                        label="ФИО"
                        sortable
                        :resizable="false"
                        prop="full"
                >
                    <template slot-scope="scope">
                        <router-link :to="`/employee/info/${scope.row.id}`" class="workersList__table-name" :title="scope.row.name">
                            {{ scope.row.surname }} {{ scope.row.name }}{{ scope.row.patronymic.length ? ' ' + scope.row.patronymic : ''}}
                        </router-link>
                    </template>
                </el-table-column>
                <!--:filter-method="filterGender"-->
                <el-table-column
                        label="Пол"
                        :filters="[{text: 'Мужской', value: 'MALE'}, {text: 'Женский', value: 'FEMALE'}]"
                        :filter-multiple="false"
                        :resizable="false"
                        width="80"
                        prop="gender"
                        show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        {{ scope.row.gender === 'MALE' ? 'Мужской' : 'Женский' }}
                    </template>
                </el-table-column>
                <el-table-column
                        label="Город"
                        sortable
                        :resizable="false"
                        prop="city">
                    <template slot-scope="scope">
                        <span :class="scope.row.city.length ? '' : 'table__cell_empty'">
                          {{ scope.row.city.length ? scope.row.city : 'Не указан' }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="Телефон"
                        width="120"
                        :resizable="false">
                    <template slot-scope="scope">
                        <span class="workersList__table-phone" :class="scope.row.phone.length ? '' : 'table__cell_empty'" :title="scope.row.phone">
                          {{ scope.row.phone.length ? scope.row.phone : 'Не указан' }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="Должность"
                        width="160px"
                        :resizable="false">
                    <template slot-scope="scope">
                        <span>{{ scope.row.position.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        v-show="false"
                        label="Теги"
                        :resizable="false">
                    <template slot-scope="scope" v-show="false">
                        <div class="workersList__table-tags">
                            <span v-for="item in scope.row.tags" :key="item.id">
                                {{ item.name }}
                            </span>
                            <el-button type="text"><i class="mdi mdi-dots-horizontal"></i></el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        label="Действия"
                        width="100px"
                        align="center"
                        :resizable="false">
                    <template slot-scope="scope">
                        <div class="cell-buttons workersList__table-buttons">
                            <el-button type="text" @click="$router.push(`employee/edit/${scope.row.id}`)">
                                <i class="mdi mdi-pencil"></i>
                            </el-button>
                            <el-button type="text" @click="tmp_user = scope.row; dialog_delete_user = true">
                                <i class="mdi mdi-delete"></i>
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog
                title="Удалить сотрудника?"
                :visible.sync="dialog_delete_user"
                width="520px"
                top="calc(50vh - 90px)"
                :close-on-click-modal="!is_loading_action"
                :close-on-press-escape="!is_loading_action"
                :show-close="!is_loading_action">
            <span>Вы действительно хотите удалить сотрудника <b>{{ tmp_user.surname + tmp_user.name }}</b>? Данное действие невозможно отменить.</span>
            <span slot="footer" class="dialog-footer">
                    <el-button plain @click="dialog_delete_user = false" :disabled="is_loading_action">Отмена</el-button>
                    <el-button type="primary" @click="deleteWorkers" :loading="is_loading_action">Удалить</el-button>
                </span>
        </el-dialog>
        <el-dialog
                title="Удалить выбранные объекты?"
                :visible.sync="dialog_delete_workers"
                width="520px"
                top="calc(50vh - 90px)"
                :close-on-click-modal="!is_loading_action"
                :close-on-press-escape="!is_loading_action"
                :show-close="!is_loading_action">
            <span>Вы действительно хотите удалить выбранные объекты?
                Данное действие невозможно отменить.</span>
            <span slot="footer" class="dialog-footer">
                    <el-button plain @click="dialog_delete_workers = false" :disabled="is_loading_action">Отмена</el-button>
                    <el-button type="primary" @click="deleteWorkers" :loading="is_loading_action">Удалить</el-button>
                </span>
        </el-dialog>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'
    import _ from 'lodash'

    export default {
        props: {
            list: {
                type: Array,
                default: function(){ return [] }
            },
            size: {
                type: Number,
                default: 10
            },
            skip: {
                type: Number,
                default: 1
            }
        },
        data() {
            return {
                is_loading_data: false,
                is_loading_action: false,
                dialog_delete_user: false,
                dialog_delete_workers: false,

                tmp_id: '',
                tmp_user: '',

                selected: [],

                search: '',
                gender: '',
                limit: 0,
                page: 0,

                order: {
                    name: 'createdAt',
                    sort: 'ascending'
                }
            }
        },
        watch: {
            dialog_delete_user(value){
                if(!value){
                    setTimeout(() => {
                        this.tmp_user = '';
                    }, 700);
                }
            },
            search(){
                this.is_loading_data = true;
            },
            gender(){
                this.is_loading_data = true;
            }
        },
        created(){
            this.limit = this.size;
            this.page = this.skip;
        },
        methods: {
            ...mapActions({
                deleteEmployees: 'employees/DELETE_EMPLOYEE',
                getEmployees: 'employees/GET_EMPLOYEES_LIST',
            }),
            getSpecificData(){
                this.getEmployees({
                    query: this.search,
                    gender: this.gender,
                    order: this.order,
                    limit: this.limit,
                    page: this.page,
                }).then(() => {
                    this.is_loading_data = false;
                });
            },
            showFilter(data){
                for(let i in data){
                    let value = data[i];

                    if(value.length > 0){
                        this.gender = value[0];
                    }else{
                        this.gender = '';
                    }
                    break;
                }

                this.getSpecificData();
            },
            searchEmployee: _.debounce(
                function(query){
                    this.getSpecificData();
                }, 750
            ),
            handleSortChange(sort){
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

                this.getSpecificData();
            },
            deleteWorkers(){
                this.is_loading_action = true;

                let formed_array = [];

                if(this.dialog_delete_user){
                    formed_array.push(this.tmp_user.id);
                }else if(this.dialog_delete_workers){
                    for(let i in this.selected){
                        formed_array.push(this.selected[i].id);
                    }
                }

                this.deleteEmployees(formed_array).then(res => {
                    this.$notify.success({
                        title: 'Ошибка',
                        message: `${formed_array.length > 1 ? 'Пользователи были удалены' : 'Пользователь был удален'}`,
                        duration: 1750
                    });
                }).catch(error => {
                    this.$notify.error({
                        title: 'Ошибка',
                        message: 'Возникли трудности, повторите операцию позже',
                        duration: 1750
                    });
                }).then(() => {
                    this.dialog_delete_user = false;
                    this.dialog_delete_workers = false;

                    this.is_loading_action = false;
                });
            },

            handleSelectionChange(val) {
                this.selected = val;
            },
            cellClass({columnIndex}) {
                if (columnIndex === 5) {
                    return 'cellSelect'
                }
                else {
                    return ''
                }
            },

        },
    }
</script>

<style>
    .table__cell_empty{
        font-size: 12px;
        color: #bcbec2;
    }
</style>
