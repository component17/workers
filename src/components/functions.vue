<template>
    <div class="workersPermissions">
        <div class="workersPermissions__head">
            <div class="workersPermissions__head-search">
                <el-input placeholder="Найти должность"></el-input>
            </div>
            <div class="workersPermissions__head-delete">
                <el-button plain @click="dialogPermissionsDelete = true"><i class="mdi mdi-delete"></i>Удалить выбранные</el-button>
            </div>
        </div>
        <div class="workersPermissions__table">
            <div class="workersPermissions__table">
                <el-table
                        :data="permissionsTable"
                        border
                        style="width: 100%">
                    <el-table-column type="selection" width="35"></el-table-column>
                    <el-table-column
                            label="Должность"
                            sortable>
                        <template slot-scope="scope">
                            {{ scope.row.group }}
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="Действия"
                            width="80px"
                            align="center">
                        <template slot-scope="scope">
                            <el-button type="text" :disabled="scope.row.permission == 'admin' ? true : false"><i class="mdi mdi-pencil"></i></el-button>
                            <el-button type="text"
                                       @click="(dialogPermissionDelete = true) && (thisPermissionReturn(scope.row.group))"
                                       :disabled="scope.row.permission == 'admin' ? true : false"><i class="mdi mdi-delete"></i></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!--Удалить группу прав-->
        <el-dialog
                title="Удалить группу прав?"
                :visible.sync="dialogPermissionDelete"
                width="520px"
                top="calc(50vh - 90px)"
                :show-close="false">
            <span>Вы действительно хотите удалить группу прав <b>{{permissionGroup}}</b>? Данное действие невозможно отменить.</span>
            <span slot="footer" class="dialog-footer">
                <el-button plain @click="dialogPermissionDelete = false">Отмена</el-button>
                <el-button type="primary" @click="dialogPermissionDelete = false">Удалить</el-button>
            </span>
        </el-dialog>
        <!--Удалить группы прав-->
        <el-dialog
                title="Удалить группы прав?"
                :visible.sync="dialogPermissionsDelete"
                width="520px"
                top="calc(50vh - 90px)"
                :show-close="false">
            <span>Вы действительно хотите удалить выбранные группы прав? Данное действие невозможно отменить.</span>
            <span slot="footer" class="dialog-footer">
                <el-button plain @click="dialogPermissionsDelete = false">Отмена</el-button>
                <el-button type="primary" @click="dialogPermissionsDelete = false">Удалить</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data(){
            return{
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
        methods: {
            thisPermissionReturn(thisPermission){
                this.permissionGroup = thisPermission;
            },
        }
    }
</script>

<style scoped>

</style>
