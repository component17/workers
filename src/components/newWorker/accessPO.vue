<template>
    <div class="newWorkerAccessPO">
        <el-form label-width="200px" label-position="left" ref="accessEmployee" :model="model" :disabled="is_loading_action" :rules="rules">
            <h2>Учетная запись UPoint <el-checkbox v-model="account_checked">Создать</el-checkbox></h2>
            <p>Указанные данные предназначены для авторизации сотрудника в UPoint.</p>

            <el-form-item label="E-mail" :required="account_checked" prop="uid" v-if="account_checked">
                <div class="form__mediumInput">
                    <el-input placeholder="Введите email пользователя" v-model="model.uid" ref="emailInput"/>
                </div>
            </el-form-item>
            <el-form-item label="Группа доступа" :required="account_checked" prop="group_id" v-if="account_checked">
                <div class="form__mediumInput">
                    <el-select placeholder="Выберите группу" v-model="model.group_id">
                        <el-option v-for="group in $store.state.groups.list"
                                :label="group.name"
                                :value="group.id">
                        </el-option>
                    </el-select>
                </div>
            </el-form-item>

            <h2>Сторонние приложения <el-checkbox v-model="software_checked">Предоставить</el-checkbox></h2>
            <p>Указанные данные предназначены для авторизации в стороннем ПО (приложения для ТСД, кассы, приложения контроля заказов и др.) Пароль должен
                содержать не менее 4 символов.</p>

            <el-form-item label="Логин" :required="software_checked" prop="login" v-if="software_checked">
                <div class="form__mediumInput">
                    <el-input placeholder="Укажите логин пользователя" v-model="model.login" ref="loginInput"/>
                </div>
            </el-form-item>
            <el-form-item label="Пароль" :required="software_checked" prop="password" v-if="software_checked">
                <div class="form__mediumInput">
                    <el-input placeholder="Укажите пароль" v-model="model.password">
                        <el-button slot="append" @click="generatePassword">Сгенерировать</el-button>
                    </el-input>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        props: ['main'],
        data() {
            return {
                is_loading_action: false,
                showPassword: false,

                account_checked: false,
                software_checked: false,

                model: {
                    uid: '',
                    group_id: '',

                    login: '',
                    password: ''
                },

                rules: {
                    uid: [
                        { required: true, message: 'Email является обязательным полем', trigger: ['change' ,'blur'] },
                        { type: 'email', message: 'Введите корректный email', trigger: 'blur' }
                    ],
                    group_id: [
                        { required: true, message: 'Выберите группу для сотрудника', trigger: ['change' ,'blur'] },
                    ],
                    login: [
                        { required: true, message: 'Логин является обязательным полем', trigger: ['change' ,'blur'] },
                        { min: 3, message: 'Логин должен быть минимум 3 символа', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: 'Пароль является обязательным полем', trigger: ['change' ,'blur'] },
                        { min: 4, message: 'Пароль должен быть минимум в 4 символа', trigger: 'blur' }
                    ]
                },
            }
        },
        watch:{
            software_checked(value){
                if(value){
                    setTimeout(() => {
                        this.$refs.loginInput.focus();
                    }, 100)
                }
            },
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
                group_id: this.main.group_id ? this.main.group_id : '',

                login: this.main.login ? this.main.login : '',
                password: this.main.password ? this.main.password : ''
            };

            if(this.model.login.length){
                this.software_checked = true;
            }
            if(this.model.uid.length){
                this.account_checked = true;
            }
        },
        methods: {
            generatePassword(){
                let chars = "1234567890";
                this.model.password = '';

                for (let x = 0; x < 4; x++) {
                    this.model.password += chars.charAt(Math.floor(Math.random() * chars.length));
                }
            },
            loading(value){
                this.is_loading_action = value;
            },
        }
    }
</script>

<style scoped>

</style>
