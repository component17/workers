<template>
    <el-col style="width: 100%; height: 100vh;" v-if="!employee" v-loading="true"></el-col>
    <el-card-module
            v-else
            :title="`${employee.surname} ${employee.name}${employee.patronymic !== '' ? ' ' + employee.patronymic : ''}`"
            btnBack
            showHeader
            @goBack="goBack"
            showFooter
    >
        <template slot="header-actions">
            <el-button plain icon="mdi mdi-pencil" @click="$router.push(`/employee/edit/${current_id}`)" :disabled="action_in_process">Редактировать</el-button>
            <el-button plain icon="mdi mdi-delete" @click="deleteEmployee(current_id)" :loading="action_in_process">Удалить</el-button>
        </template>
        <div class="personCard">
            <div class="personCardInfo">
                <div class="personCardInfo__head">
                    <div class="personCardInfo__head-title">
                        <h2>{{employee.surname}} {{employee.name}}{{employee.patronymic !== '' ? ' ' + employee.patronymic : ''}}</h2>
                    </div>
                </div>
                <div class="personCardInfo__info">
                    <div class="personCardInfo__info-item">
                        <h3>Пол:</h3>
                        <p>{{employee.gender}}</p>
                    </div>
                    <div class="personCardInfo__info-item">
                        <h3>Город:</h3>
                        <p>{{employee.city !== '' ? employee.city : 'Не указан'}}</p>
                    </div>
                    <div class="personCardInfo__info-item">
                        <h3>Контактный телефон:</h3>
                        <p>{{employee.phone !== '' ? employee.phone : 'Не указан'}}</p>
                    </div>
                    <div class="personCardInfo__info-item">
                        <h3>Метки:</h3>
                        <div class="personCardInfo__tags">
                            <div class="personCardInfo__tags-item"> ... </div>
                            <!--<div class="personCardInfo__tags-item">Прочее</div>-->
                            <!--<div class="personCardInfo__tags-item">Электроника</div>-->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="personCard__tabs">
            <el-tabs v-model="activeName" type="border-card">
                <el-tab-pane label="Доступ к ПО" name="accessPO">
                    <newWorkerAccessPO :main="employee" :showStatus="showAccount" showApp disabledEdit/>
                </el-tab-pane>
                <!--<el-tab-pane label="Контакты" name="contacts">-->
                <!--<newWorkerContacts/>-->
                <!--</el-tab-pane>-->
                <!--<el-tab-pane label="Паспорт" name="passport">-->
                <!--<newWorkerPassport/>-->
                <!--</el-tab-pane>-->
            </el-tabs>
        </div>
        <template slot="footer-actions">
            <!--<el-button type="danger" icon="mdi mdi-block-helper">Заблокировать</el-button>-->
        </template>
    </el-card-module>
</template>

<script>
    import { mapActions } from 'vuex';
    export default {
        data() {
            return {
                activeName: 'accessPO',
                current_id: null,
                action_in_process: false,

                showAccount: false,

                employee: null
            }
        },
        created(){
            this.current_id = this.$route.params.id;
            this.getGroups().then((res) => {
                console.log('Groups: ', res);
                this.getEmployee(this.current_id).then(result => {
                    console.log('employee information: ', result);
                    this.employee = result;
                    if(this.employee.uid.length){
                        this.showAccount = true;
                    }
                })
            });

        },
        methods: {
            ...mapActions({
                getEmployee: 'employees/GET_EMPLOYEE',
                getPositions: 'positions/GET_POSITIONS_LIST',
                getGroups: 'groups/GET_GROUPS_LIST',
                removeEmployee: 'employees/DELETE_EMPLOYEE',
            }),
            deleteEmployee(id){
                this.action_in_process = true;

                this.removeEmployee([id]).then(res => {
                    this.$notify.success({
                        title: 'Успешно',
                        message: 'Сотрудник был удален',
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
                    this.$router.push('/');

                    this.action_in_process = false;
                });
            },
            goBack() {
                this.$router.go(-1)
            },
        }
    }
</script>

<style scoped>

</style>
