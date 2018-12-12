<template>
    <div class="newWorkerAccessPO">
        <el-form label-width="200px" label-position="left" ref="accessEmployee" :model="model" :disabled="is_loading_action" :rules="rules">
            <h2>Учетная запись UPoint <el-checkbox v-model="account_checked" v-if="!showStatus">Создать</el-checkbox></h2>
            <p>Указанные данные предназначены для авторизации сотрудника в UPoint.</p>

            <el-form-item label="E-mail" :required="account_checked" prop="email" v-if="account_checked">
                <div class="form__mediumInput">
                    <el-input placeholder="Введите email пользователя" v-model="model.email" ref="emailInput" :disabled="model.uid.length > 0"/>
                </div>
            </el-form-item>
            <el-form-item label="Группа доступа" :required="account_checked" prop="group_id" v-if="account_checked">
                <div class="form__mediumInput">
                    <el-select placeholder="Выберите группу" v-model="model.group_id" :disabled="model.uid.length > 0">
                        <el-option v-for="group in $store.state.groups.list"
                            :label="group.name"
                            :value="group.id"
                            :key="group.id"
                        >
                        </el-option>
                    </el-select>
                </div>
                <el-button type="primary" style="margin-left: 15px;" :disabled="model.email.length < 5 || model.group_id === '' || model.uid.length > 0" @click="inviteUser" v-if="!showStatus">{{model.uid.length ? 'Приглашение отправленно' : 'Пригласить'}}</el-button>
            </el-form-item>


            <!--<h2>Сторонние приложения <el-checkbox v-model="software_checked" v-if="!showApp">Предоставить</el-checkbox></h2>-->
            <h2>Сторонние приложения</h2>
            <p>Указанные данные предназначены для авторизации в стороннем ПО (приложения для ТСД, кассы, приложения контроля заказов и др.) Пароль ниже
                нужно указать в стороннем приложении.</p>

            <!--<el-form-item label="Логин" :required="software_checked" prop="login" v-if="software_checked">-->
                <!--<div class="form__mediumInput">-->
                    <!--<el-input placeholder="Укажите логин пользователя" v-model="model.login" ref="loginInput" :disabled="disabledEdit"/>-->
                <!--</div>-->
            <!--</el-form-item>-->
            <el-form-item label="Пароль" :required="software_checked" prop="password">
                <!--v-if="software_checked"-->
                <div class="form__mediumInput">
                    <el-input placeholder="Укажите пароль" v-model="model.password" ref="pinInput" :disabled="true">
                        <!--<el-button slot="append" @click="generatePassword" :disabled="disabledEdit">Сгенерировать</el-button>-->
                    </el-input>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        props: {
            main: {
                type: Object,
                default: function(){ return {} }
            },
            showStatus: {
                type: Boolean,
                default: false
            },
            showApp: {
                type: Boolean,
                default: false
            },
            disabledEdit: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                is_loading_action: false,
                showPassword: false,

                account_checked: false,
                software_checked: false,

                model: {
                    uid: '',
                    email: '',
                    group_id: '',

                    // login: '',
                    // password: ''
                },

                rules: {
                    email: [
                        { required: true, message: 'Email является обязательным полем', trigger: ['change' ,'blur'] },
                        { type: 'email', message: 'Введите корректный email', trigger: 'blur' }
                    ],
                    group_id: [
                        { required: true, message: 'Выберите группу для сотрудника', trigger: ['change' ,'blur'] },
                    ],
                    // login: [
                    //     { required: true, message: 'Логин является обязательным полем', trigger: ['change' ,'blur'] },
                    //     { min: 3, message: 'Логин должен быть минимум 3 символа', trigger: 'blur' }
                    // ],
                    // password: [
                    //     { required: true, message: 'Пароль является обязательным полем', trigger: ['change' ,'blur'] },
                    //     { min: 4, message: 'Пароль должен быть минимум в 4 символа', trigger: 'blur' }
                    // ]
                },
            }
        },
        watch:{
            // software_checked(value){
            //     if(value){
            //         setTimeout(() => {
            //             this.$refs.pinInput.focus();
            //         }, 100)
            //     }
            // },
            account_checked(value){
                if(value){
                    setTimeout(() => {
                        this.$refs.emailInput.focus();
                    }, 100)
                }
            }
        },
        created(){
            this.model = {
                uid: this.main.uid ? this.main.uid : '',
                email: this.main.email ? this.main.email : '',
                group_id: this.main.group_id ? this.main.group_id : '',

                // login: this.main.login ? this.main.login : '',
                password: this.main.password ? this.main.password : ''
            };

            for(let i in this.$store.state.groups.list){
                if(this.$store.state.groups.list[i].id !== this.model.group_id) this.model.group_id = '';
            }


            if(this.model.password.length){
                this.software_checked = true;
            }

            if(this.showApp){
                this.software_checked = true;
            }
            if(this.showStatus){
                this.account_checked = true;
            }
        },
        methods: {
            ...mapActions({
                getEmployee: 'employees/GET_EMPLOYEE',
                updateEmployeeAccess: 'employees/UPDATE_EMPLOYEE_ACCESS',
                checkPin: 'employees/CHECK_PIN_DUBLICATE'

            }),
            inviteUser(){
                this.$emit('proccessLoading', true);

                upoint.uPassport.user.invite(this.model.email, this.model.group_id).then(res => {
                    let uid = res.uid;
                    this.updateEmployeeAccess({
                        id: this.$route.params.id,
                        data: {
                            uid: res.uid,
                            email: this.model.email,
                            group_id: this.model.group_id
                        }
                    }).then(() => {
                        this.model.uid = uid;
                        this.$emit('updateData', {
                            uid: uid,
                            email: this.model.email,
                            group_id: this.model.group_id
                        });
                    });
                    this.$notify.success({
                        title: 'Успешно',
                        message: 'Пользователю было отправленно приглашение в UPoint',
                        duration: 1750
                    });
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
                            message: 'Возникли трудности, повторите операцию позже',
                            duration: 1750
                        });
                    }
                }).then(() => {
                    this.$emit('proccessLoading', false);
                });
            },
            generatePassword(){
                this.$pin.generatePin(1, pin => {
                    this.checkPin(pin).then(res => {
                        console.log('Got answer: ', res);
                        if(res) this.model.password = pin;
                        else this.generatePassword();
                    })
                    // this.model.password = pin;
                });
                // let chars = "1234567890";
                // this.model.password = '';
                //
                // for (let x = 0; x < 6; x++) {
                //     this.model.password += chars.charAt(Math.floor(Math.random() * chars.length));
                // }
            },
            loading(value){
                this.is_loading_action = value;
            },
        }
    }
</script>

<style scoped>

</style>
