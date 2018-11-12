<template>
    <div class="settingWorkerCard">
        <div class="settingWorkerCard__head">
            <div class="settingWorkerCard__head-search">
                <el-input placeholder="Найти группу прав"></el-input>
            </div>
            <div class="settingWorkerCard__head-delete">
                <el-button plain @click="dialogAllDelete = true" icon="mdi mdi-delete">Удалить выбранные</el-button>
            </div>
        </div>
        <el-table
                :data="settingsWorker"
                border
                style="width: 100%">
            <el-table-column type="selection" width="35"></el-table-column>
            <el-table-column
                    label="Группа прав"
                    sortable>
                <template slot-scope="scope">
                    {{ scope.row.title }}
                </template>
            </el-table-column>
            <el-table-column
                    label="Действия"
                    width="90px"
                    align="center">
                <template slot-scope="scope">
                    <div class="settingWorkerCard__item-actions">
                        <el-button type="text" @click="dialogSetting = true"><i class="mdi mdi-settings"></i></el-button>
                        <el-button type="text"><i class="mdi mdi-pencil"></i></el-button>
                        <el-button type="text" @click="(setionDelete(scope.row.title)) || (dialogSectionDelete = true)"
                                   :disabled="scope.row.default ? true : false"><i class="mdi mdi-delete"></i></el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!--Настройка доступа к разделу-->
        <el-dialog
                title="Настройка доступа к разделу"
                :visible.sync="dialogSetting"
                top="calc(50vh - 275px)"
                class="dialogSettingWorkerCard">
            <vue-perfect-scrollbar class="scroll-area">
                <div class="dialogSettingWorkerCard-wrapper" style="height: 550px;">
                    <div class="dialogSettingWorkerCard__item" v-for="item in accessGroup" :key="item.id">
                        <div class="dialogSettingWorkerCard__item-title">{{item.name}}</div>
                        <div class="dialogSettingWorkerCard__item-check">
                            <el-checkbox :disabled="item.disable" v-model="item.check">Разрешить доступ</el-checkbox>
                        </div>
                    </div>
                </div>
            </vue-perfect-scrollbar>
            <span slot="footer" class="dialog-footer">
    <el-button plain @click="dialogSetting = false">Отмена</el-button>
    <el-button type="primary" @click="dialogSetting = false">Сохранить</el-button>
  </span>
        </el-dialog>
        <!--Удалить карточку-->
        <el-dialog
                title="Удалить раздел из карточки сотрудника?"
                :visible.sync="dialogSectionDelete"
                width="520px"
                top="calc(50vh - 90px)"
                :show-close="false">
            <span>Вы действительно хотите удалить раздел <b>{{sectionDelete}}</b> из карточки сотрудника? Данное действие невозможно отменить.</span>
            <span slot="footer" class="dialog-footer">
                <el-button plain @click="dialogSectionDelete = false">Отмена</el-button>
                <el-button type="primary" @click="dialogSectionDelete = false">Удалить</el-button>
            </span>
        </el-dialog>
        <!--Удалить Выбранные-->
        <el-dialog
                title="Удалить разделы из карточки сотрудника?"
                :visible.sync="dialogAllDelete"
                width="520px"
                top="calc(50vh - 90px)"
                :show-close="false">
            <span>Вы действительно хотите удалить разделы из карточки сотрудника? Данное действие невозможно отменить.</span>
            <span slot="footer" class="dialog-footer">
                <el-button plain @click="dialogAllDelete = false">Отмена</el-button>
                <el-button type="primary" @click="dialogAllDelete = false">Удалить</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dialogSetting: false,
                dialogSectionDelete: false,
                sectionDelete: '',
                dialogAllDelete: false,
                settingsWorker: [
                    {title: 'Основные', default: true,},
                    {title: 'Доступ к ПО', default: true,},
                    {title: 'Контакты'},
                    {title: 'Паспорт'},
                    {title: 'Новый раздел'},
                ],
                accessGroup: [
                    {name: 'Администратор', check: true, disable: true,},
                    {name: 'Менеджер',},
                    {name: 'Бригадир',},
                ],
            }
        },
        methods: {
            goBack() {
                this.$router.go(-1)
            },
            setionDelete(sectionDelete) {
                this.sectionDelete = sectionDelete;
            },
        },
    }
</script>

<style scoped>

</style>
