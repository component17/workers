<template>
    <el-card-module
            title="Новый раздел / Редактировать раздел"
            btnBack
            showHeader
            @goBack="goBack"
            showFooter
    >
        <template slot="header-actions">
            <el-button plain icon="mdi mdi-delete">Удалить раздел</el-button>
        </template>
        <div class="formMaker">
            <div class="auto__search">
                <div class="auto__search-title">
                    <h2>Название раздела в карточке сотрудника</h2>
                </div>
                <div class="auto__search-input">
                    <el-input placeholder="Новый раздел"/>
                </div>
            </div>
            <div class="formMaker__row">
                <div class="formMakerLeft">
                    <div class="formMakerLeft__item" v-for="item in formMakerLeftItems" :key="item.id">
                        <div class="formMakerLeft__item-title">
                            {{item.title}}
                        </div>
                        <div class="formMakerLeft__item-icon">
                            <i class="mdi" :class="item.icon"></i>
                        </div>
                    </div>
                </div>
                <div class="formMakerContent">
                    <vue-perfect-scrollbar class="scroll-area">
                        <el-form label-width="200px" label-position="left">
                            <el-form-item class="formMakerContent__item" v-for="item in formMakerContent" :label="item.label" :key="item.id"
                                          :required="item.required"> <!--formMakerContent__item-active активный класс-->
                                <div class="formMakerContent__item-input" v-if="item.type == 'input'">
                                    <div class="form__smallInput" v-if="item.size === 'small'">
                                        <el-input/>
                                    </div>
                                    <div class="form__mediumInput" v-else-if="item.size === 'medium'">
                                        <el-input/>
                                    </div>
                                    <el-input v-else/>
                                </div>
                                <div class="formMakerContent__item-input" v-if="item.type == 'inputNumber'">
                                    <div class="form__smallInput">
                                        <el-input v-model="item.number"/>
                                    </div>
                                </div>
                                <div class="formMakerContent__item-textarea" v-if="item.type == 'textarea'">
                                    <el-input type="textarea" resize="none" :rows="item.rows"/>
                                </div>
                                <div class="formMakerContent__item-select" v-if="item.type == 'select'">
                                    <div class="form__mediumInput">
                                        <el-select :value="item.value" v-model="item.value" :placeholder="item.placeholder">
                                            <el-option
                                                    v-for="option in item.options"
                                                    :key="option.value"
                                                    :label="option.label"
                                                    :value="option.value">
                                            </el-option>
                                        </el-select>
                                    </div>
                                </div>
                                <div class="formMakerContent__item-checkbox" v-if="item.type == 'checkbox'">
                                    <el-checkbox-group v-model="item.value">
                                        <el-checkbox v-for="option in item.options" :label="option.label" :value="option.value"/>
                                    </el-checkbox-group>
                                </div>
                                <div class="formMakerContent__item-radio" v-if="item.type == 'radio'">
                                    <el-radio-group v-model="item.value">
                                        <el-radio v-for="option in item.options" :label="option.label" :value="option.value"/>
                                    </el-radio-group>
                                </div>
                                <div class="formMakerContent__item-date" v-if="item.type == 'date'">
                                    <div class="form__smallInput">
                                        <el-date-picker
                                                v-model="item.dateInputs"
                                                type="date"
                                                placeholder="Pick a day">
                                        </el-date-picker>
                                    </div>
                                </div>
                                <div class="formMakerContent__item-time" v-if="item.type == 'time'">
                                    <div class="form__smallInput">
                                        <el-time-select
                                                v-model="item.timeInputs"
                                                :picker-options="{
                                                start: '0:00',
                                                step: '00:15',
                                                end: '23:59'
                                            }"
                                                placeholder="Select time">
                                        </el-time-select>
                                    </div>
                                </div>
                                <div class="formMakerContent__item-actions">
                                    <el-button type="text"><i class="mdi mdi-content-copy"></i></el-button>
                                    <el-button type="text"><i class="mdi mdi-delete"></i></el-button>
                                </div>
                            </el-form-item>
                        </el-form>
                    </vue-perfect-scrollbar>
                </div>
                <div class="formMakerSetting">
                    <div class="formMakerSetting__head">
                        <div class="formMakerSetting__head-icon">
                            <i class="mdi mdi-checkbox-marked"></i>
                        </div>
                        <div class="formMakerSetting__head-title">
                            <h2>Список (select)</h2>
                        </div>
                        <div class="formMakerSetting__head-button">
                            <el-button plain @click="dialogSetting = true"><i class="mdi mdi-settings"></i></el-button>
                        </div>
                    </div>
                    <div class="formMakerSetting__body">
                        <div class="formMakerSetting__item">
                            <div class="formMakerSetting__item-title"><h3>Заголовок</h3></div>
                            <div class="formMakerSetting__item-input">
                                <el-input></el-input>
                                <div class="form-count">25 / 25</div>
                            </div>
                            <div class="formMakerSetting__item-check">
                                <el-checkbox label="Обязательное поле"></el-checkbox>
                            </div>
                        </div>
                        <div class="formMakerSetting__item">
                            <div class="formMakerSetting__item-title"><h3>Элемента списка</h3></div>
                            <div class="formMakerSetting__item-input">
                                <el-input type="textarea" rows="3" resize="none"/>
                            </div>
                        </div>
                        <div class="formMakerSetting__item">
                            <div class="formMakerSetting__item-title"><h3>Плейсхолдер</h3></div>
                            <div class="formMakerSetting__item-input">
                                <el-input/>
                                <div class="form-count">25 / 25</div>
                            </div>
                        </div>
                        <div class="formMakerSetting__item">
                            <div class="formMakerSetting__item-title"><h3>Ограничение символов</h3></div>
                            <div class="formMakerSetting__item-input">
                                <el-input placeholder="от"/>
                                <div class="separator">-</div>
                                <el-input placeholder="до"/>
                            </div>
                            <div class="formMakerSetting__item-check">
                                <el-checkbox label="Показывать счетчик"></el-checkbox>
                            </div>
                        </div>
                        <div class="formMakerSetting__item">
                            <div class="formMakerSetting__item-title"><h3>Количество видимых строк</h3></div>
                            <div class="formMakerSetting__item-input">
                                <el-input placeholder="По умолчанию (3)"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--Настройка доступа к элементу-->
        <el-dialog
                title="Настройка доступа к разделу"
                :visible.sync="dialogSetting"
                top="calc(50vh - 275px)"
                class="dialogSettingAccessElem">
            <vue-perfect-scrollbar class="scroll-area">
                <div class="dialogSettingAccessElem-wrapper"  style="height: 550px;">
                    <div class="dialogSettingAccessElem__item" v-for="item in accessGroup" :key="item.id">
                        <div class="dialogSettingAccessElem__item-title">{{item.name}}</div>
                        <div class="dialogSettingAccessElem__item-check">
                            <el-checkbox :disabled="item.disable" v-model="item.view">Просмотр</el-checkbox>
                            <el-checkbox :disabled="item.disable" v-model="item.edit">Редактирование</el-checkbox>
                        </div>
                    </div>
                </div>
            </vue-perfect-scrollbar>
            <span slot="footer" class="dialog-footer">
    <el-button plain @click="dialogSetting = false">Отмена</el-button>
    <el-button type="primary" @click="dialogSetting = false">Сохранить</el-button>
  </span>
        </el-dialog>

        <template slot="footer-actions">
            <el-button type="primary" icon="mdi mdi-content-save">Создать раздел / Сохранить изменения</el-button>
        </template>
    </el-card-module>
</template>

<script>
    export default {
        data() {
            return {
                dialogSetting: false,
                formMakerLeftItems: [
                    {title: 'Текстовое поле', icon: "mdi-format-text"},
                    {title: 'Числовое поле', icon: "mdi-numeric"},
                    {title: 'Параграф', icon: "mdi-note-text"},
                    {title: 'E-mail', icon: "mdi-email-outline"},
                    {title: 'Телефон', icon: "mdi-phone-in-talk"},
                    {title: 'Список(select)', icon: "mdi-menu-down"},
                    {title: 'Список(checkbox)', icon: "mdi-checkbox-marked"},
                    {title: 'Список(radio)', icon: "mdi-radiobox-marked"},
                    {title: 'Дата', icon: "mdi-calendar-check"},
                    {title: 'Время', icon: "mdi-clock"},
                ],
                formMakerContent: [
                    {label: 'Текстовое поле', type: 'input', required: true,},
                    {label: 'Числовое поле', type: 'inputNumber', number: ''},
                    {label: 'Параграф', type: 'textarea', rows: 3,},
                    {label: 'E-mail', type: 'input', size: 'medium'},
                    {label: 'Телефон', type: 'input', size: 'small'},
                    {
                        label: 'Список (select)', required: true, type: 'select', value: '', options: [
                            {value: 'Option1', label: 'Option1'},
                            {value: 'Option2', label: 'Option2'},
                        ]
                    },
                    {
                        label: 'Список (checkbox)', type: 'checkbox', value: [], options: [
                            {value: 'Option1', label: 'Option1'},
                            {value: 'Option2', label: 'Option2'},
                        ]
                    },
                    {
                        label: 'Список (radio)', type: 'radio', value: '', options: [
                            {value: 'Option1', label: 'Option1'},
                            {value: 'Option2', label: 'Option2'},
                        ]
                    },
                    {
                        label: 'Дата', type: 'date', dateInputs: '',
                    },
                    {
                        label: 'Время', type: 'time', timeInputs: '',
                    },
                ],
                accessGroup: [
                    {name: 'Администратор', view: true, edit: true, disable: true,},
                    {name: 'Менеджер',},
                    {name: 'Бригадир',},
                ],
            }
        },
        methods: {
            goBack() {
                this.$router.go(-1)
            },
        }
    }
</script>

<style scoped>

</style>
