<template>
    <vue-perfect-scrollbar class="scroll-area">
        <el-card-module
                title="Новый сотрудник"
                btnBack
                showHeader
                showFooter
        >
            <!--<template slot="header-actions">-->
                <!--<el-button plain icon="mdi mdi-delete">Удалить запись (если редактирование)</el-button>-->
            <!--</template>-->
            <div class="newWorker">
                <div class="auto__search">
                    <div class="auto__search-title">
                        <h2>Автозаполнение ФИО</h2>
                    </div>
                    <div class="auto__search-input">
                        <el-autocomplete
                                class="inline-input"
                                v-model="autocomplete"
                                :fetch-suggestions="querySearch"
                                placeholder="Введите ФИО в свободной форме"
                                :trigger-on-focus="false"
                                @select="handleSelect"
                                style="width: 100%"
                                :disabled="is_loading_action"
                        ></el-autocomplete>
                    </div>
                </div>

                <div class="newWorkerInfo">
                    <el-form label-width="200px" label-position="left" :model="model" ref="createEmployee" :rules="rules" :disabled="is_loading_action">
                        <el-form-item label="Фамилия" required prop="surname">
                            <el-input v-model="model.surname" placeholder="Введите фамилию"/>
                        </el-form-item>
                        <el-form-item label="Имя" required prop="name">
                            <el-input v-model="model.name" placeholder="Введите имя"/>
                        </el-form-item>
                        <el-form-item label="Отчество">
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
                <!--<div class="newWorker__tabs">-->
                    <!--<el-tabs v-model="activeName" type="border-card">-->
                        <!--<el-tab-pane label="Основные" name="info"><newWorkerInfo/></el-tab-pane>-->
                        <!--&lt;!&ndash;<el-tab-pane label="Доступ к ПО " name="accessPO"><newWorkerAccessPO/></el-tab-pane>&ndash;&gt;-->
                    <!--</el-tabs>-->
                <!--</div>-->
            </div>
            <template slot="footer-actions">
                <el-button @click="$router.push('/')" :disabled="is_loading_action">Отмена</el-button>
                <el-button type="primary"
                           :icon="is_loading_action ? '' : 'mdi mdi-content-save'"
                           :disabled="model.name.length < 2 || model.surname.length < 2 || !model.position.length"
                           :loading="is_loading_action"
                           @click="createNewEmployee"
                >Создать сотрудника</el-button>
            </template>

            <el-dialog
                    title="Добавить новую должность"
                    :visible.sync="dialog_add_position"
                    width="520px"
                    top="calc(50vh - 90px)"
                    :close-on-click-modal="!is_creating_position"
                    :close-on-press-escape="!is_creating_position"
                    :show-close="!is_creating_position">
                <span>Введите название должности</span>
                <el-input placeholder="Введите название" required v-model="new_position" :disabled="is_creating_position"/>
                <span slot="footer" class="dialog-footer">
                    <el-button plain @click="dialog_add_position = false" :disabled="is_creating_position">Отмена</el-button>
                    <el-button type="primary" @click="createNewPosition" :disabled="new_position.length < 2" :loading="is_creating_position">Создать</el-button>
                </span>
            </el-dialog>
        </el-card-module>
    </vue-perfect-scrollbar>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        data() {
            return {
                is_loading_action: false,

                dialog_add_position: false,
                is_creating_position: false,
                new_position: '',

                autocomplete: '',

                model: {
                    name: '',
                    surname: '',
                    patronymic: '',

                    gender: 'MALE',
                    position: '',

                    city: '',
                    phone: '',

                    deletedAt: null,
                    uid: '',
                    group_id: '',
                    login: '',
                    password: '',
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
                    // patronymic: [
                    //     { required: true, message: 'Отчество является обязательным полем', trigger: ['change' ,'blur'] },
                    //     { message: 'Укажите отчество сотрудника', trigger: 'blur' }
                    // ],
                    gender: [
                        { required: true, message: 'Пол является обязательным полем', trigger: ['change' ,'blur'] },
                    ],
                    position: [
                        { required: true, message: 'Укажите должность сотрудника', trigger: ['change' ,'blur'] },
                    ],
                },


                // activeName: 'info',
                // value: '',
                // access: true,
                dynamicTags: [],
                inputVisible: false,
                // inputValue: '',
            }
        },
        watch: {
            dialog_add_position(val){
                if(!val){
                    this.is_creating_position = false;
                    setTimeout(() => {
                        this.new_position = '';
                    }, 700)
                }
            }
        },
        created(){
            this.getPositions().then(res => {
                console.log('Get list: ', res);
            })
        },
        methods: {
            ...mapActions({
                getPositions: 'positions/GET_POSITIONS_LIST',
                createPosition: 'positions/CREATE_NEW_POSITION',
                createEmployee: 'employees/CREATE_NEW_EMPLOYEE',
            }),

            createNewPosition(){
                this.is_creating_position = true;

                this.createPosition(this.new_position).then(res => {
                    console.log('Create new position: ', res);

                    this.$notify.success({
                        title: 'Успешно',
                        message: 'Новая дожность была создана!',
                        duration: 1750
                    });
                }).catch(error => {
                    this.$notify.error({
                        title: 'Ошибка',
                        message: 'Возникли трудности, повторите операцию позже!',
                        duration: 1750
                    });
                }).then(() => {
                    this.dialog_add_position = false;
                })
            },
            createNewEmployee(){
                this.is_loading_action = true;

                this.createEmployee(this.model).then(res => {
                    console.log('Create new employee: ', res);

                    this.$router.push(`/employee/edit/${res.generated_keys[0]}`)
                }).catch(error => {
                    this.$notify.error({
                        title: 'Ошибка',
                        message: 'Возникли трудности, повторите операцию позже!',
                        duration: 1750
                    });
                }).then(() => {
                    this.is_loading_action = false;
                })
            },

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




            goBack(){
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
