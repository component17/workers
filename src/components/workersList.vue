<template>
    <div class="workersList">
        <div class="workersList__head">
            <div class="workersList__head-search">
                <el-input placeholder="Найти сотрудника" :disabled="true"/>
            </div>
            <div class="workersList__head-actions">
                <el-button icon="mdi mdi-delete" :disabled="true">Удалить выбранные</el-button>
                <!--<el-select v-model="groupActionsValue" placeholder="Групповые действия" :disabled="true">-->
                    <!--<el-option-->
                            <!--v-for="item in groupActions"-->
                            <!--:label="item.title"-->
                            <!--:value="item.value">-->
                    <!--</el-option>-->
                <!--</el-select>-->
            </div>
        </div>
        <div class="workersList__table">
            <el-table
                    :data="list"
                    border
                    style="width: 100%"
                    :cell-class-name="cellClass">
                <el-table-column
                        type="selection"
                        width="35"
                        :resizable="false">
                </el-table-column>
                <el-table-column
                        label="ФИО"
                        sortable
                        :resizable="false">
                    <template slot-scope="scope">
                        <!--<router-link :to="scope.row.link" class="workersList__table-name" :title="scope.row.name">-->
                            {{ scope.row.surname }} {{ scope.row.name }}{{ scope.row.patronymic.length ? ' ' + scope.row.patronymic : ''}}
                        <!--</router-link>-->
                    </template>
                </el-table-column>
                <el-table-column
                        label="Пол"
                        :filters="[{text: 'test', value: 'test'}]"
                        :resizable="false"
                        width="80"
                        prop="gender"
                        show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        {{ scope.row.gender === 'MALE' ? 'Мужской' : 'Женский' }}
                    </template>
                </el-table-column>
                <el-table-column
                        label="Город"
                        sortable
                        :resizable="false"
                        prop="city">
                    <template slot-scope="scope">
                        <span :class="scope.row.city.length ? '' : 'table__cell_empty'">
                          {{ scope.row.city.length ? scope.row.city : 'Не указан' }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="Телефон"
                        width="120"
                        :resizable="false">
                    <template slot-scope="scope">
                        <span class="workersList__table-phone" :class="scope.row.phone.length ? '' : 'table__cell_empty'" :title="scope.row.phone">
                          {{ scope.row.phone.length ? scope.row.phone : 'Не указан' }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="Должность"
                        width="160px"
                        :resizable="false">
                    <template slot-scope="scope">
                        <span>{{ scope.row.position.name }}</span>
                        <!--<el-select v-model="scope.row.position" placeholder="Должность" :disabled="true">-->
                            <!--<el-option v-for="(position, index) in $store.state.positions.list" :value="position.id" :label="position.name" :key="index">-->
                            <!--</el-option>-->
                        <!--</el-select>-->
                    </template>
                </el-table-column>
                <el-table-column
                        v-show="false"
                        label="Теги"
                        :filters="[{text: 'test', value: 'test'}]"
                        :resizable="false">
                    <template slot-scope="scope" v-show="false">
                        <div class="workersList__table-tags">
                            <span v-for="item in scope.row.tags" :key="item.id">
                                {{ item.name }}
                            </span>
                            <el-button type="text"><i class="mdi mdi-dots-horizontal"></i></el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        label="Действия"
                        width="100px"
                        align="center"
                        :resizable="false">
                    <template slot-scope="scope">
                        <div class="cell-buttons workersList__table-buttons">
                            <el-button type="text" @click="$router.push(`employee/edit/${scope.row.id}`)">
                                <i class="mdi mdi-pencil"></i>
                            </el-button>
                            <!--<el-button type="text"-->
                                       <!--:disabled="true"-->
                                <!--:class="scope.row.blocked? 'userBlock' : ''"-->
                                <!--@click="!scope.row.blocked ? dialogUserBlock = true : dialogUserUnblock = true"-->
                            <!--&gt;-->
                                <!--&lt;!&ndash;@click="(!scope.row.blocked ? dialogUserBlock = true : dialogUserUnblock = true) ..... blockUser(scope.$index, !scope.row.blocked))&ndash;&gt;-->
                                <!--<i class="mdi mdi-block-helper"></i>-->
                            <!--</el-button>-->
                            <el-button type="text" @click="dialogUserDelete = true" :disabled="true">
                                <i class="mdi mdi-delete"></i>
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--&lt;!&ndash;Заблокировать сотрудника&ndash;&gt;-->
        <!--<el-dialog-->
                <!--title="Заблокировать сотрудника"-->
                <!--:visible.sync="dialogUserBlock"-->
                <!--width="520px"-->
                <!--top="calc(50vh - 90px)"-->
                <!--:show-close="false">-->
            <!--<span>Вы действительно хотите ограничить доступ сотрудника <b>{{userMail}}</b> к конфигурации? Активный сеанс будет автоматически завершен.</span>-->
            <!--<span slot="footer" class="dialog-footer">-->
                <!--<el-button plain @click="dialogUserBlock = false">Отмена</el-button>-->
                <!--<el-button type="primary"-->
                           <!--@click="dialogUserBlock = false">-->
                    <!--Заблокировать-->
                <!--</el-button>-->
            <!--</span>-->
        <!--</el-dialog>-->
        <!--&lt;!&ndash;Разблокировать сотрудника&ndash;&gt;-->
        <!--<el-dialog-->
                <!--title="Разблокировать сотрудника"-->
                <!--:visible.sync="dialogUserUnblock"-->
                <!--width="520px"-->
                <!--top="calc(50vh - 90px)"-->
                <!--:show-close="false">-->
            <!--<span>Доступ сотрудника <b>{{userMail}}</b> к конфигурации будет восстановлен.</span>-->
            <!--<span slot="footer" class="dialog-footer">-->
                <!--<el-button plain @click="dialogUserBlock = false">Отмена</el-button>-->
                <!--<el-button type="primary"-->
                           <!--@click="dialogUserUnblock = false">-->
                    <!--Разблокировать-->
                <!--</el-button>-->
            <!--</span>-->
        <!--</el-dialog>-->
        <!--Удалить сотрудника-->
        <el-dialog
                title="Удалить сотрудника?"
                :visible.sync="dialogUserDelete"
                width="520px"
                top="calc(50vh - 90px)"
                :show-close="false">
            <span>Вы действительно хотите удалить сотрудника <b>ФИО</b> из конфигурации? Данное действие невозможно отменить.</span>
            <span slot="footer" class="dialog-footer">
                <el-button plain @click="dialogUserDelete = false">Отмена</el-button>
                <el-button type="primary" @click="dialogUserDelete = false">Удалить</el-button>
            </span>
        </el-dialog>
        <!--Массовое удаление-->
        <el-dialog
                title="Удалить выбранные объекты?"
                :visible.sync="dialogGroupDelete"
                width="520px"
                top="calc(50vh - 90px)"
                :show-close="false">
            <span>Вы действительно хотите удалить выбранные объекты?
                Данное действие невозможно отменить.</span>
            <span slot="footer" class="dialog-footer">
                <el-button plain @click="dialogGroupDelete = false">Отмена</el-button>
                <el-button type="primary" @click="dialogGroupDelete = false">Удалить</el-button>
            </span>
        </el-dialog>
        <!--Массовая блокировка-->
        <!--<el-dialog-->
                <!--title="Заблокировать выбранные объекты?"-->
                <!--:visible.sync="dialogGroupBlock"-->
                <!--width="520px"-->
                <!--top="calc(50vh - 90px)"-->
                <!--:show-close="false">-->
            <!--<span>Вы действительно хотите ограничить доступ выбранных объектов к конфигурации?-->
                <!--Сеансы всех активных пользователей будут автоматически завершены.</span>-->
            <!--<span slot="footer" class="dialog-footer">-->
                <!--<el-button plain @click="dialogGroupBlock = false">Отмена</el-button>-->
                <!--<el-button type="primary" @click="dialogGroupBlock = false">Подтвердить</el-button>-->
            <!--</span>-->
        <!--</el-dialog>-->
        <!--Массовая разблокировка-->
        <!--<el-dialog-->
                <!--title="Разблокировать выбранные объекты?"-->
                <!--:visible.sync="dialogGroupUnblock"-->
                <!--width="520px"-->
                <!--top="calc(50vh - 90px)"-->
                <!--:show-close="false">-->
            <!--<span>Доступ выбранных объектов к конфигурации будет восстановлен.</span>-->
            <!--<span slot="footer" class="dialog-footer">-->
                <!--<el-button plain @click="dialogGroupUnblock = false">Отмена</el-button>-->
                <!--<el-button type="primary" @click="dialogGroupUnblock = false">Подтвердить</el-button>-->
            <!--</span>-->
        <!--</el-dialog>-->
        <!--Новый сотрудник-->
        <!--<el-dialog-->
                <!--title="Новый сотрудник"-->
                <!--:visible.sync="dialogNewWorker"-->
                <!--width="520px"-->
                <!--top="calc(50vh - 123px)"-->
                <!--:show-close="false">-->
            <!--<div class="dialogNewWorker">-->
                <!--<p>Приглашение будет отправлено на указанный e-mail.</p>-->
                <!--<el-form>-->
                    <!--<el-form-item>-->
                        <!--<el-input placeholder="Введите e-mail"/>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item>-->
                        <!--<el-select v-model="value2" placeholder="Группа доступа">-->
                            <!--<el-option value="test">-->
                                <!--test-->
                            <!--</el-option>-->
                        <!--</el-select>-->
                    <!--</el-form-item>-->
                <!--</el-form>-->
            <!--</div>-->
            <!--<span slot="footer" class="dialog-footer">-->
                <!--<el-button plain @click="dialogNewWorker = false">Отмена</el-button>-->
                <!--<el-button type="primary" @click="dialogNewWorker = false">Пригласить</el-button>-->
            <!--</span>-->
        <!--</el-dialog>-->
    </div>
</template>

<script>
    import { mapActions } from 'vuex'

    export default {
        props: ['list'],
        data() {
            return {
                is_loading_action: false,

                tmp_index: '',
                tmp_user: '',



                value: '',
                value2: '',
                groupActionsValue: '',
                dialogUserBlock: false,
                dialogUserUnblock: false,
                dialogUserDelete: false,
                userBlock: false,
                userMail: '',
                dialogGroupDelete: false,
                dialogGroupBlock: false,
                dialogGroupUnblock: false,
                dialogNewWorker: false,
                groupActions: [
                    {title: 'Удалить выбранные', value: 'delete'},
                    {title: 'Заблокировать выбранные', value: 'block'},
                ],
                usersTable: [
                    {
                        mail: 'ali.adams@yahoo.com',
                        name: 'Константинопольский Константин Александрович',
                        phone: '+7 831-090-2171',
                        link: '/personCard',
                        gender: 'Человек',
                        city: 'Нижний Новгород',
                        tags: [
                            {name: 'Продукты питания'},
                            {name: 'Продукты питания'},
                            {name: 'Одежда'},
                        ]
                    },
                    {
                        mail: 'valentin.runolfsson@erdman.net',
                        name: 'Алексеева Светлана Николаевна',
                        phone: '909-828-7928',
                        link: '/personCard',
                        gender: 'Почти человек',
                        city: 'Воронеж',
                        tags: [
                            {name: 'Электроника'},
                            {name: 'Прочее'},
                        ]
                    },
                ]
            }
        },
        watch: {
            groupActionsValue(state) {
                this.clickSelect(state)
            }
        },
        methods: {
            ...mapActions({
                blockEmployee: 'employees/BLOCK_EMPLOYEE'
            }),
            blockUser(index){

            },


            cellClass({columnIndex}) {
                if (columnIndex === 5) {
                    return 'cellSelect'
                }
                else {
                    return ''
                }
            },
            thisUserMail(userMail) {
                this.userMail = userMail;
            },
            clickSelect(value) {
                if (value === 'delete') {
                    this.dialogGroupDelete = true;
                } else if (value === 'block') {
                    this.dialogGroupBlock = true;
                } else if (value === 'unblock') {
                    this.dialogGroupUnblock = true;
                }
            },
        },
    }
</script>

<style>
    .table__cell_empty{
        font-size: 12px;
        color: #bcbec2;
    }
</style>
