<template>
    <el-card-module
            title="Настройки"
            btnBack
            showHeader
            @goBack="goBack"
            showFooter
    >
        <div class="settingsWrapper">
            <div class="settingsTabs">
                <el-tabs v-model="activeName" type="border-card">
                    <el-tab-pane label="Группы прав доступа" name="permissions">
                        <permissions/>
                    </el-tab-pane>
                    <!--<el-tab-pane label="Шаблон карточки сотрудника" name="workerCard"><settingWorkerCard/></el-tab-pane>-->
                    <el-tab-pane label="Справочник должностей" name="functions"><functions/></el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <template slot="footer">
            <!--<el-pagination-->
                    <!--:page-sizes="[100, 200, 300, 400]"-->
                    <!--:page-size="100"-->
                    <!--layout="sizes, prev, pager, next"-->
                    <!--:total="400">-->
            <!--</el-pagination>-->
        </template>

        <template slot="footer-actions">
            <el-button type="primary" @click="$router.push('/group/create')" icon="mdi mdi-plus" v-if="activeName === 'permissions'">Создать группу</el-button>
            <el-button type="primary" @click="$router.push('/formMaker')" icon="mdi mdi-plus" v-if="activeName === 'workerCard'">Новый раздел</el-button>
            <el-button type="primary" @click="create_position_dialog = true" icon="mdi mdi-plus" v-if="activeName === 'functions'">Добавить должность</el-button>
        </template>
        <!--Добавить должность-->
        <el-dialog
                title="Новая должность"
                :visible.sync="create_position_dialog"
                width="520px"
                top="calc(50vh - 90px)"
                :close-on-click-modal="!is_create_process"
                :close-on-press-escape="!is_create_process"
                :show-close="!is_create_process">
            <span>Введите название должности</span>
            <el-input v-model="tmp_name" placeholder="Введите название должности" :disabled="is_create_process"/>
            <span slot="footer" class="dialog-footer">
                <el-button plain @click="create_position_dialog = false" :disabled="is_create_process">Отмена</el-button>
                <el-button type="primary" @click="createNewPosition" :loading="is_create_process" :disabled="tmp_name.length < 3">Добавить</el-button>
            </span>
        </el-dialog>
    </el-card-module>
</template>

<script>
    import { mapActions } from 'vuex';
    export default {
        data() {
            return {
                is_create_process: false,

                activeName: 'permissions',
                dialogAddFunction: false,

                create_position_dialog: false,
                tmp_name: '',


                groups: null,
            };
        },
        watch: {
            create_position_dialog(value){
                if(!value){
                    setTimeout(() => {
                        this.tmp_name = '';
                    }, 700);
                }
            }
        },
        created(){},
        methods: {
            ...mapActions({
                createPosition: 'positions/CREATE_NEW_POSITION'
            }),
            goBack(){
                this.$router.go(-1)
            },
            createNewPosition(){
                this.create_position_dialog = true;

                this.createPosition(this.tmp_name).then(result => {
                    this.$notify.success({
                        title: 'Успешно',
                        message: `Должность была создана`,
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
                    this.create_position_dialog = false;
                    this.create_position_dialog = false;
                });
            }
            // getGroups(){
            //     upoint.uPassport.permissions.getAll().then(res => {
            //         console.log(res);
            //
            //         this.groups = res;
            //
            //     })
            // },
        }
    }
</script>

<style scoped>

</style>
