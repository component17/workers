<template>
    <!--<div>-->
        <!--<div class="auto__search">-->
            <!--<div class="auto__search-title">-->
                <!--<h2>Автозаполнение ФИО</h2>-->
            <!--</div>-->
            <!--<div class="auto__search-input">-->
                <!--<el-autocomplete-->
                        <!--class="inline-input"-->
                        <!--v-model="autocomplete"-->
                        <!--:fetch-suggestions="querySearch"-->
                        <!--placeholder="Введите ФИО в свободной форме"-->
                        <!--:trigger-on-focus="false"-->
                        <!--@select="handleSelect"-->
                        <!--style="width: 100%"-->
                        <!--:disabled="is_loading_action"-->
                <!--&gt;</el-autocomplete>-->
            <!--</div>-->
        <!--</div>-->
        <div class="newWorkerInfo">
            <el-form label-width="200px" label-position="left" :model="model" ref="editEmployee" :rules="rules" :disabled="is_loading_action">
                <el-form-item label="Фамилия" required prop="surname">
                    <el-input v-model="model.surname" placeholder="Введите фамилию"/>
                </el-form-item>
                <el-form-item label="Имя" required prop="name">
                    <el-input v-model="model.name" placeholder="Введите имя"/>
                </el-form-item>
                <el-form-item label="Отчество" required prop="patronymic">
                    <el-input v-model="model.patronymic" placeholder="Введите отчество"/>
                </el-form-item>
                <el-form-item label="Пол" required prop="gender">
                    <el-select placeholder="Укажите пол" value="MALE" v-model="model.gender">
                        <el-option
                                label="Мужской"
                                value="MALE">
                        </el-option>
                        <el-option
                                label="Женский"
                                value="FEMALE">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Должность" required prop="position" placeholder="Укажите должность">
                    <el-select placeholder="Выберите из списка" v-model="model.position">
                        <el-option
                                v-for="(position, index) in $store.state.positions.list"
                                :key="index"
                                :label="position.name"
                                :value="position.id">
                        </el-option>
                    </el-select>
                    <el-button type="primary" @click="dialog_add_position = true" icon="mdi mdi-plus">Добавить должность</el-button>
                </el-form-item>
                <el-form-item label="Город">
                    <div class="form__mediumInput">
                        <el-input v-model="model.city" placeholder="Укажите город"/>
                    </div>
                </el-form-item>
                <el-form-item label="Контактный телефон">
                    <div class="form__mediumInput">
                        <el-input v-model="model.phone" placeholder="Введите номер телефона"/>
                    </div>
                </el-form-item>
                <el-form-item v-show="false">
                    <template slot="label">
                        Теги
                        <el-tooltip content="Теги используются для быстрой идентификации" placement="top">
                            <i class="mdi mdi-help-circle"></i>
                        </el-tooltip>
                    </template>
                    <div class="form__tags">
                        <el-tag
                                :key="tag"
                                v-for="tag in dynamicTags"
                                closable
                                :disable-transitions="false"
                                @close="handleClose(tag)">
                            {{tag}}
                        </el-tag>
                        <el-input
                                class="input-new-tag"
                                v-if="inputVisible"
                                v-model="inputValue"
                                ref="saveTagInput"
                                size="mini"
                                @keyup.enter.native="handleInputConfirm"
                                @blur="handleInputConfirm"
                        >
                        </el-input>
                        <el-button v-else class="button-new-tag" @click="showInput" plain icon="mdi mdi-plus">Добавить тег</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>
    <!--</div>-->
</template>

<script>
    import { mapActions } from 'vuex';
    export default {
        props: ['main'],
        data() {
            return {
                action_in_process: false,

                is_loading_action: false,

                dialog_add_position: false,
                is_creating_position: false,
                new_position: '',

                autocomplete: '',

                model: {
                    name: '',
                    surname: '',
                    patronymic: '',
                    gender: '',
                    position: '',
                    city: '',
                    phone: ''
                },
                rules: {
                    name: [
                        { required: true, message: 'Имя является обязательным полем', trigger: ['change' ,'blur'] },
                        { min: 2, message: 'Имя должно быть минимум 2 символа', trigger: 'blur' }
                    ],
                    surname: [
                        { required: true, message: 'Фмилия является обязательным полем', trigger: ['change' ,'blur'] },
                        { min: 2, message: 'Фамилия должна быть минимум 2 символа', trigger: 'blur' }
                    ],
                    patronymic: [
                        { required: true, message: 'Отчество является обязательным полем', trigger: ['change' ,'blur'] },
                        { message: 'Укажите отчество сотрудника', trigger: 'blur' }
                    ],
                    gender: [
                        { required: true, message: 'Пол является обязательным полем', trigger: ['change' ,'blur'] },
                    ],
                    position: [
                        { required: true, message: 'Укажите должность сотрудника', trigger: ['change' ,'blur'] },
                    ],
                },

                model_hash: null,


                value: '',
                access: true,
                dynamicTags: [],
                inputVisible: false,
                inputValue: '',
            }
        },
        created(){
            console.log('Main: ', this.main)
            this.model = {
                name: this.main.name,
                surname: this.main.surname,
                patronymic: this.main.patronymic,
                gender: this.main.gender,
                position: this.main.position,
                city: this.main.city,
                phone: this.main.phone
            };

            this.model_hash = this.$hash(this.model)
        },
        methods: {
            ...mapActions({
                // getPositions: 'positions/GET_POSITIONS_LIST',
                createPosition: 'positions/CREATE_NEW_POSITION',
                // createEmployee: 'employees/CREATE_NEW_EMPLOYEE',
            }),

            querySearch(queryString, cb) {
                upoint.dadata.sug.fio(this.autocomplete).then((data) => {
                    cb(data);
                });
            },

            handleSelect(item) {
                let val = item.data;
                console.log(val);
                this.$nextTick(() => {

                    this.model = {
                        name: val.name !== null ? val.name : this.model.name,
                        surname: val.surname !== null ? val.surname : this.model.surname,
                        patronymic: val.patronymic !== null ? val.patronymic : this.model.patronymic,
                        gender: val.gender !== 'UNKNOWN' ? val.gender : this.model.gender,
                        position: this.model.position,

                        city: this.model.city,
                        phone: this.model.phone
                    };
                });
            },

            loading(value){
                this.is_loading_action = value;
            },





            goBack() {
                this.$router.go(-1)
            },
            handleClose(tag) {
                this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
            },

            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },

            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue) {
                    this.dynamicTags.push(inputValue);
                }
                this.inputVisible = false;
                this.inputValue = '';
            }
        }

    }
</script>

<style scoped>

</style>
