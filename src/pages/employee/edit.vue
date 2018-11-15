<template>
    <vue-perfect-scrollbar class="scroll-area">
        <el-col style="width: 100%; height: 100vh;" v-if="!$store.state.employees.current_employee" v-loading="true"></el-col>
        <el-card-module
                v-else
                :title="`Редактировать сотрудника ${$store.state.employees.current_employee.surname} ${$store.state.employees.current_employee.name}`"
                showHeader
                showFooter
        >
            <!--btnBack-->
            <!--@goBack="goBack"-->
            <template slot="header-actions">
                <el-button plain icon="mdi mdi-delete">Удалить запись</el-button>
            </template>
            <div class="newWorker">
                <!--<div class="auto__search">-->
                    <!--<div class="auto__search-title">-->
                        <!--<h2>Автозаполнение ФИО</h2>-->
                    <!--</div>-->
                    <!--<div class="auto__search-input">-->
                        <!--<el-input placeholder="Введите название в свободной форме, адрес, ИНН или ОГРН"/>-->
                    <!--</div>-->
                <!--</div>-->
                <div class="newWorker__tabs">
                    <el-tabs v-model="activeName" type="border-card">
                        <el-tab-pane label="Основные" name="info" :disabled="action_in_process">
                            <newWorkerInfo :main="$store.state.employees.current_employee" ref="info"/>
                        </el-tab-pane>
                        <el-tab-pane label="Доступ к ПО " name="access" :disabled="action_in_process">
                            <newWorkerAccessPO :main="$store.state.employees.current_employee" ref="access"/>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
            <template slot="footer-actions">
                <el-button @click="goBack" :disabled="action_in_process">Отмена</el-button>
                <el-button type="primary" @click="save" icon="mdi mdi-content-save" :loading="action_in_process">Сохранить изменения</el-button>
            </template>

        </el-card-module>
        <el-dialog
                title="Продолжить?"
                :visible.sync="warning_dialog"
                width="520px"
                top="calc(50vh - 90px)"
                :show-close="false">
            <span>Данные были изменвы, если вы <b>покинете</b> страницу - изменения не вступят в силу и будут утеряны. Вы действительно хотите выйти из редактирвоания?</span>
            <span slot="footer" class="dialog-footer">
                <el-button plain @click="warning_dialog = false">Отмена</el-button>
                <el-button type="primary" @click="$router.go(-1)">Выйти</el-button>
            </span>
        </el-dialog>
    </vue-perfect-scrollbar>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        data() {
            return {
                activeName: 'info',

                action_in_process: false,

                warning_dialog: false,

                old_data: null,
                old_data_info: null,
                old_data_access: null,
                old_data_hash: null
            };
        },
        watch: {
            action_in_process(value){
                this.$refs.info.loading(value);
                this.$refs.access.loading(value);
            }
        },
        created(){
            // r.table('employees').update({login: '', password: '', group_id: '', uid: ''}).run(conn, (err, data) => {
            //     console.log(data);
            // })
            this.getEmployee(this.$route.params.id).then(res => {
                this.old_data = {
                    name: res.name,
                    surname: res.surname,
                    patronymic: res.patronymic,
                    gender: res.gender,
                    position: res.position,
                    city: res.city,
                    phone: res.phone,

                    login: res.login,
                    password: res.password,
                    uid: res.uid,
                    group_id: res.group_id
                };
                if(this.$store.state.positions.list === null){
                    this.getPositions();
                    this.getGroups();
                }
            });
        },
        methods: {
            ...mapActions({
                getEmployee: 'employees/GET_EMPLOYEE',
                getPositions: 'positions/GET_POSITIONS_LIST',
                getGroups: 'groups/GET_GROUPS_LIST',
                updateEmployee: 'employees/UPDATE_EMPLOYEE'
            }),
            save(){
                this.action_in_process = true;

                let access_employee = this.$refs.access.$refs.accessEmployee;
                let info_employee = this.$refs.info.$refs.editEmployee;

                let checks = 0;
                let tab_error = '';

                info_employee.validate((valid) => {
                    if (valid) {
                        checks++;
                    } else {
                        tab_error = 'info';
                        return false;
                    }
                });
                access_employee.validate((valid) => {
                    if (valid) {
                        checks++;
                    } else {
                        tab_error = 'access';
                        return false;
                    }
                });

                if(checks === 2){
                    let result = {...this.$refs.info.model, ...this.$refs.access.model};

                    if(this.checkHashSum(this.old_data, result)){
                        this.$notify.success({
                            title: 'Успешно',
                            message: 'Данные сотрудника были сохранены',
                            duration: 1750
                        });
                        this.action_in_process = false;
                    }else{
                        this.updateEmployee({
                            id: this.$route.params.id,
                            data: result
                        }).then(res => {
                            this.$notify.success({
                                title: 'Успешно',
                                message: 'Данные сотрудника были изменены',
                                duration: 1750
                            });
                        }).then(() => {
                            this.$router.push('/')
                        });
                    }
                }else{
                    this.activeName = tab_error;
                    this.action_in_process = false;
                }
            },
            goBack(){
                const new_data = {...this.$refs.info.model, ...this.$refs.access.model};

                if(this.checkHashSum(this.old_data, new_data)){
                    this.$router.push('/');
                }else{
                    this.warning_dialog = true;
                }
            },
            checkHashSum(old_val, new_val){
                return this.$hash(old_val) === this.$hash(new_val);
            }
        }
    }
</script>

<style scoped>

</style>
