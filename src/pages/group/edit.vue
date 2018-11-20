<template>
    <el-card-module
            title="Настройка прав доступа"
            showHeader
            showFooter
    >
        <template slot="header-actions">
            <el-button plain @click="delete_dialog = true" icon="mdi mdi-delete">Удалить группу</el-button>
        </template>
        <div class="editPermission" :loading="!$store.state.groups.current_group_permissions">
            <div class="auto__search">
                <!--<div class="auto__search-title">-->
                    <!--<h2>Автозаполнение ФИО</h2>-->
                <!--</div>-->
                <div class="auto__search-input">
                    <el-input v-model="model.name" placeholder="Введите название группы" :disabled="is_loading_process"/>
                </div>
            </div>
            <el-card-module
                    v-for="(module, index) in group_permission"
                    :title="module.name"
                    :key="index"
                    showHeader
            >
                <template slot="header-actions">
                    <el-checkbox label="Закрыть доступ" v-model="group_permission[index].is_hide" @change="checkHideModule(index)" :disabled="is_loading_process"></el-checkbox>
                </template>
                <div class="editPermission__item" :class="{'editPermission__item-disable': group_permission[index].is_hide}">
                    <div class="editPermission__item-group">
                        <div class="checkGroupHead">
                            <el-checkbox :indeterminate="group_permission[index].is_indeterminate" v-model="group_permission[index].check_all" @change="checkAllPermissions(index)" :disabled="is_loading_process">Разрешить все</el-checkbox>
                        </div>
                        <el-checkbox-group v-model="group_permission[index].checked" @change="handleChecked(index)" :disabled="is_loading_process">
                            <el-checkbox v-for="(permission, index) in module.permissions" :label="permission.id" :key="permission.id" v-if="permission.key !== 'hide'">
                                {{permission.name}} <i class="mdi mdi-help-circle-outline" :title="permission.desc"></i>
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
            </el-card-module>
            <!--<el-card-module-->
                    <!--title="Модуль"-->
                    <!--showHeader-->
                    <!--@goBack="goBack"-->
            <!--&gt;-->
                <!--<template slot="header-actions">-->
                    <!--<el-checkbox label="Закрыть доступ"></el-checkbox>-->
                <!--</template>-->
                <!--<div class="editPermission__item editPermission__item-disable">-->
                    <!--<div class="editPermission__item-group">-->
                        <!--<div class="checkGroupHead">-->
                            <!--<el-checkbox v-model="checkAll">Разрешить все</el-checkbox>-->
                        <!--</div>-->
                        <!--<el-checkbox-group>-->
                            <!--<el-checkbox v-for="item in permissions" :label="item.name" :key="item.id"></el-checkbox>-->
                        <!--</el-checkbox-group>-->
                    <!--</div>-->
                <!--</div>-->
            <!--</el-card-module>-->

        </div>

        <template slot="footer-actions">
            <el-button :disabled="is_loading_process" @click="goBack">Отмена</el-button>
            <el-button
                    type="primary"
                    :icon="!is_loading_process ? 'mdi mdi-content-save' : ''"
                    :disabled="model.name.length < 3"
                    :loading="is_loading_process"
                    @click="updateGroup"
            >Сохранить изменения</el-button>
        </template>
        <el-dialog
                title="Продолжить?"
                :visible.sync="warning_dialog"
                width="520px"
                top="calc(50vh - 90px)"
                :show-close="false">
            <span>Данные были изменвы, если вы <b>покинете</b> страницу - изменения не вступят в силу и будут утеряны. Вы действительно хотите выйти из редактирвоания?</span>
            <span slot="footer" class="dialog-footer">
                <el-button plain @click="warning_dialog = false">Отмена</el-button>
                <el-button type="primary" @click="$router.push('/settings?tab=permissions')">Выйти</el-button>
            </span>
        </el-dialog>
        <!--Удалить группу-->
        <el-dialog
                title="Удалить группу прав доступа?"
                :visible.sync="delete_dialog"
                width="520px"
                top="calc(50vh - 90px)"
                :close-on-click-modal="!is_loading_process"
                :close-on-press-escape="!is_loading_process"
                :show-close="!is_loading_process">
            <span>Вы действительно хотите удалить группу прав доступа? Данное действие невозможно отменить.</span>
            <span slot="footer" class="dialog-footer">
                <el-button plain @click="delete_dialog = false" :disabled="is_loading_process">Отмена</el-button>
                <el-button type="primary" @click="deleteGroup" :loading="is_loading_process">Удалить</el-button>
            </span>
        </el-dialog>
    </el-card-module>
</template>

<script>
    import { mapActions } from 'vuex';
    export default {
        data() {
            return {
                is_loading_process: false,
                current_id: null,
                group_permission: null,
                model: {
                    name: '',
                    permissions: []
                },
                old_hash: null,


                // checkAll: false,
                // permissionCheck: [],
                warning_dialog: false,
                delete_dialog: false,
                dialogGroupDelete: false,

                // permissions: [
                //     {name: 'Название действия'},
                //     {name: 'Название действия'},
                //     {name: 'Название действия'},
                //     {name: 'Название действия'},
                //     {name: 'Название действия'},
                //     {name: 'Название действия'},
                //     {name: 'Название действия'},
                //     {name: 'Название действия'},
                //     {name: 'Название действия'},
                // ],
                // isIndeterminate: true
            };
        },
        created(){
            this.current_id = this.$route.params.id;

            this.getCurrentPermissions(this.current_id).then(res => {
                this.model.name = res.name;

                this.group_permission = res.modules;
                for(let i in this.group_permission){
                    this.group_permission[i].is_indeterminate = false;
                    this.group_permission[i].check_all = false;
                    this.group_permission[i].is_hide = false;
                    this.group_permission[i].checked = [];
                }

                for(let i = 0; i < res.modules.length; i++){
                    let arr = [];
                    for(let j in res.modules[i].permissions){
                        if(res.modules[i].permissions[j].key !== 'hide' && res.modules[i].permissions[j].isActive){
                            /**
                             * Set checked permissions
                             */
                            arr.push(res.modules[i].permissions[j].id);
                        }else if(res.modules[i].permissions[j].key === 'hide' && res.modules[i].permissions[j].isActive){
                            /**
                             * Set hidden permissions
                             */
                            arr.push(res.modules[i].permissions[j].id);
                            this.$set(this.group_permission[i], 'is_hide', true);
                        }
                    }
                    this.$set(this.group_permission[i], 'checked', arr);

                    if(this.group_permission[i].checked.length){
                        /**
                         * Set inderteminate and all checkboxes
                         */
                        let checkedCount = this.group_permission[i].checked.length;
                        let indeterminate = checkedCount > 0 && checkedCount < this.group_permission[i].permissions.length - 1;
                        let all = checkedCount === this.group_permission[i].permissions.length - 1;

                        if(!this.group_permission[i].is_hide){
                            this.$set(this.group_permission[i], 'is_indeterminate', indeterminate);
                            this.$set(this.group_permission[i], 'check_all', all);
                        }
                    }
                }

                this.combinePermissions();

                this.old_hash = this.$hash(this.model);
            });
        },
        methods: {
            ...mapActions({
                getPermissions: 'groups/GET_CURRENT_GROUP',
                getCurrentPermissions: 'groups/GET_CURRENT_PERMISSIONS'
            }),
            goBack() {
                this.combinePermissions();

                if(this.checkHashSum(this.model)){
                    this.$router.push('/settings?tab=permissions');
                }else{
                    this.warning_dialog = true;
                }
            },

            combinePermissions(){
                let checked_permissions = [];
                for(let i = 0; i < this.group_permission.length; i++){
                    checked_permissions = checked_permissions.concat(this.group_permission[i].checked);
                }
                this.model.permissions = checked_permissions;
            },
            checkHashSum(newData){
                return this.old_hash === this.$hash(newData);
            },
            deleteGroup(){
                this.is_loading_process = true;

                upoint.uPassport.permissions.delete(this.current_id).then(result => {
                    console.log(result);
                    this.$notify.success({
                        title: 'Успешно',
                        message: `Группа прав доступа была удалена`,
                        duration: 1750
                    });
                    this.$router.push('/settings?tab=permissions');
                }).catch(error => {
                    console.error(error)
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
                    this.delete_dialog = false;
                });
            },
            updateGroup(){
                this.is_loading_process = true;
                this.combinePermissions();

                if(this.checkHashSum(this.model)){
                    this.$notify.success({
                        title: 'Успешно',
                        message: `Данные группы "${this.model.name}" были сохранены`,
                        duration: 1750
                    });
                    this.is_loading_process = false;
                    this.$router.push('/settings?tab=permissions');
                }else{
                    upoint.uPassport.permissions.edit(this.current_id, this.model.name, this.model.permissions).then(result => {
                        this.$notify.success({
                            title: 'Успешно',
                            message: `Группа прав доступа "${result.name}" была изменена`,
                            duration: 1750
                        });
                        this.is_loading_process = false;
                    }).then(() => {
                        this.$router.push('/settings?tab=permissions');
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
                        this.is_loading_process = false;
                    });
                }
            },
            /**
             * Метод скрытия модуля
             * @param index - индекс права, который скрываем
             */
            checkHideModule(index){
                let newData = this.group_permission[index];
                let arr = [];

                if(this.group_permission[index].is_hide){
                    newData.permissions.map((i) => {
                        if(i.key === 'hide'){
                            arr.push(i.id)
                        }
                    });

                    newData.is_hide = true;
                }else{
                    newData.is_hide = false;
                }

                newData.is_indeterminate = false;
                newData.check_all = false;
                newData.checked = arr;

                this.$set(this.group_permission, index, newData);
            },
            /**
             * Метод установки всех прав доступа
             * @param index - индекс модуля, который разрешаем всем
             */
            checkAllPermissions(index){
                let newData = this.group_permission[index];
                let arr = [];

                newData.permissions.map((i) => {
                    if (newData.check_all) {
                        if(i.key !== 'hide'){
                            arr.push(i.id)
                        }
                    }
                });

                newData.checked = arr;
                newData.is_indeterminate = false;

                this.$set(this.group_permission, index, newData);
            },
            /**
             * Метод включение/выключение правва
             * @param index - индекс права, который включаем/выключаем
             */
            handleChecked(index){
                let newData = this.group_permission[index];
                let checkedCount = newData.checked.length;

                newData.check_all = checkedCount === newData.permissions.length - 1;
                newData.is_indeterminate = checkedCount > 0 && checkedCount < newData.permissions.length - 1;

                this.$set(this.group_permission, index, newData);
            }
        }
    }
</script>

<style scoped>

</style>
