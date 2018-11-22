<template>
    <div class="workersPermissions">
        <div class="workersPermissions__head">
            <div class="workersPermissions__head-search">
                <!--<el-input placeholder="Найти группу прав"></el-input>-->
            </div>
            <div class="workersPermissions__head-delete">
                <!--<el-button plain @click="delete_several_groups_dialog = true" :disabled="!selected.length"><i class="mdi mdi-delete"></i>Удалить выбранные</el-button>-->
            </div>
        </div>
        <div class="workersPermissions__table">
            <div class="workersPermissions__table">
                <el-table
                        v-loading="is_update_process"
                        :data="$store.state.groups.list"
                        border
                        @selection-change="handleSelectionChange"
                        style="width: 100%">
                    <!--<el-table-column type="selection" width="35"></el-table-column>-->
                    <el-table-column
                            label="Группа прав"
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
                            <el-button type="text" :disabled="scope.row.isAdmin" @click="$router.push(`/group/edit/${scope.row.id}`)"><i class="mdi mdi-pencil"></i></el-button>
                            <!--<el-button type="text"-->
                                       <!--@click="tmp_id = scope.row.id;tmp_name = scope.row.name;delete_one_group_dialog = true"-->
                                       <!--:disabled="scope.row.isAdmin"><i class="mdi mdi-delete"></i></el-button>-->
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!--Удалить группу прав-->
        <el-dialog
                title="Удалить группу прав?"
                :visible.sync="delete_one_group_dialog"
                width="520px"
                top="calc(50vh - 90px)"
                :close-on-click-modal="!is_loading_delete"
                :close-on-press-escape="!is_loading_delete"
                :show-close="!is_loading_delete">
            <span>Вы действительно хотите удалить группу прав <b>{{tmp_name}}</b>? Данное действие невозможно отменить.</span>
            <span slot="footer" class="dialog-footer">
                <el-button plain @click="delete_one_group_dialog = false" :disabled="is_loading_delete">Отмена</el-button>
                <el-button type="primary" @click="deleteGroup(tmp_id)" :loading="is_loading_delete">Удалить</el-button>
            </span>
        </el-dialog>
        <!--Удалить группы прав-->
        <el-dialog
                title="Удалить группы прав?"
                :visible.sync="delete_several_groups_dialog"
                width="520px"
                top="calc(50vh - 90px)"
                :close-on-click-modal="!is_loading_delete"
                :close-on-press-escape="!is_loading_delete"
                :show-close="!is_loading_delete">
            <span>Вы действительно хотите удалить выбранные группы прав? Данное действие невозможно отменить.</span>
            <span slot="footer" class="dialog-footer">
                <el-button plain @click="delete_several_groups_dialog = false" :disabled="is_loading_delete">Отмена</el-button>
                <el-button type="primary" @click="deleteGroup()" :loading="is_loading_delete">Удалить</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        data(){
            return{
                tmp_id: '',
                tmp_name: '',

                delete_several_groups_dialog: false,
                delete_one_group_dialog: false,

                is_loading_delete: false,
                is_update_process: false,

                selected: [],

                dialogPermissionDelete: false,
                dialogPermissionsDelete: false,
                permissionGroup: '',
                permissionsTable:[
                    {group: 'Администратор', permission: 'admin'},
                    {group: 'Менеджеры', permission: 'manager'},
                    {group: 'Бухгалтерия', permission: 'bux'},
                ]
            }
        },
        watch: {
            delete_one_group_dialog(value){
                if(!value){
                    setTimeout(() => {
                        this.tmp_id = '';
                        this.tmp_name = '';
                    }, 700);
                }
            }
        },
        created(){
            this.getGroups();
        },
        methods: {
            ...mapActions({
                getGroups: 'groups/GET_GROUPS_LIST'
            }),
            thisPermissionReturn(thisPermission){
                this.permissionGroup = thisPermission;
            },
            handleSelectionChange(val){
                this.selected = val;
            },
            deletePermissionGroup(to_delete){
                return new Promise((resolve, reject) => {
                    upoint.uPassport.permissions.delete(to_delete).then(result => {
                        resolve(result);
                    }).catch(error => {
                        reject(error);
                    });
                })
            },
            deleteGroup(id = null){
                this.is_loading_delete = true;

                if(id !== null){
                    this.deletePermissionGroup(JSON.stringify(id)).then(result => {
                        this.$notify.success({
                            title: 'Успешно',
                            message: `Группа прав доступа была удалена`,
                            duration: 1750
                        });
                    }).catch(error => {
                        console.error(error);
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
                        this.delete_one_group_dialog = false;
                        this.is_loading_delete = false;

                        this.is_update_process = true;
                        this.getGroups().then(() => {this.is_update_process = false});
                    });
                }else{
                    let arr = this.selected.map(item => {
                        return parseInt(item.id);
                    });

                    this.deletePermissionGroup(JSON.stringify(arr)).then(result => {
                        this.$notify.success({
                            title: 'Успешно',
                            message: `Группы прав доступа были удалены`,
                            duration: 1750
                        });
                    }).catch(error => {
                        console.error(error);
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
                        this.delete_several_groups_dialog = false;
                        this.is_loading_delete = false;

                        this.is_update_process = true;
                        this.getGroups().then(() => {this.is_update_process = false});
                    });
                }
            }
        }
    }
</script>

<style scoped>

</style>
