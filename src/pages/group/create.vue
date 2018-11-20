<template>
    <el-card-module
        title="Создание группы прав доступа"
        showHeader
        showFooter
    >
        <div class="editPermission" v-loading="!$store.state.groups.permissions">
            <div class="auto__search">
                <div class="auto__search-input">
                    <el-input v-model="model.name" placeholder="Введите название группы" :disabled="is_loading_process"/>
                </div>
            </div>
            <el-card-module
                v-for="(module, index) in group_permission"
                :title="module.name"
                :key="index"
                :class="{'newPermission__item-disable': group_permission[index].is_hide}"
                showHeader
            >
                <template slot="header-actions">
                    <el-checkbox label="Закрыть доступ" v-model="group_permission[index].is_hide" @change="checkHideModule(index)" :disabled="is_loading_process"></el-checkbox>
                </template>
                <div class="editPermission__item">
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
        </div>

        <template slot="footer-actions">
            <el-button @click="$router.push('/settings?tab=permissions')" :disabled="is_loading_process">Отмена</el-button>
            <el-button
                    type="primary"
                    :icon="!is_loading_process ? 'mdi mdi-content-save' : ''"
                    :disabled="model.name.length < 3"
                    :loading="is_loading_process"
                    @click="createNewGroup"
            >Сохранить группу</el-button>
        </template>
    </el-card-module>
</template>

<script>
    import { mapActions } from 'vuex';
    export default {
        data() {
            return {
                is_loading_process: false,
                model: {
                    name: '',
                    permissions: []
                },
                group_permission: null,
            };
        },
        created(){
            this.getPermissions().then(res => {
                this.group_permission = res;

                for(let i in this.group_permission){
                    this.group_permission[i].is_indeterminate = false;
                    this.group_permission[i].check_all = false;
                    this.group_permission[i].is_hide = false;
                    this.group_permission[i].checked = [];
                }
            })
        },
        methods: {
            ...mapActions({
                getPermissions: 'groups/GET_CURRENT_GROUP'
            }),
            createNewGroup(){
                this.is_loading_process = true;

                let checked_permissions = [];

                for(let i = 0; i < this.group_permission.length; i++){
                    checked_permissions = checked_permissions.concat(this.group_permission[i].checked);
                }

                this.model.permissions = checked_permissions;

                upoint.uPassport.permissions.add(this.model.name, this.model.permissions).then(result => {
                    console.log('Result: ', result);
                }).then(() => {
                    this.is_loading_process = false;
                    this.$router.push('/settings?tab=permissions')
                });
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

<style>
    .newPermission__item-disable .editPermission__item-group{
        position:relative
    }
    .newPermission__item-disable .editPermission__item-group:before{
        position:absolute;
        content:'';
        left:0;
        right:0;
        bottom:0;
        top:0;
        background-color:rgba(242, 242, 242, 0.3);
        z-index:10;
    }

</style>
