<template>
    <el-card-module
            title="Настройка прав доступа"
            btnBack
            showHeader
            @goBack="goBack"
            showFooter
    >
        <template slot="header-actions">
            <el-button plain @click="dialogGroupDelete = true" icon="mdi mdi-delete">Удалить группу</el-button>
        </template>
        <div class="editPermission">
            <div class="auto__search">
                <div class="auto__search-title">
                    <h2>Автозаполнение ФИО</h2>
                </div>
                <div class="auto__search-input">
                    <el-input placeholder="Введите название в свободной форме, адрес, ИНН или ОГРН"/>
                </div>
            </div>
            <el-card-module
                    title="Инвентаризиция"
                    showHeader
                    @goBack="goBack"
            >
                <template slot="header-actions">
                    <el-checkbox label="Закрыть доступ"></el-checkbox>
                </template>
                <div class="editPermission__item">
                    <div class="editPermission__item-group">
                        <div class="checkGroupHead">
                            <el-checkbox v-model="checkAll">Разрешить все</el-checkbox>
                        </div>
                        <el-checkbox-group>
                            <el-checkbox v-for="item in permissions" :label="item.name" :key="item.id"></el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
            </el-card-module>
            <el-card-module
                    title="Модуль"
                    showHeader
                    @goBack="goBack"
            >
                <template slot="header-actions">
                    <el-checkbox label="Закрыть доступ"></el-checkbox>
                </template>
                <div class="editPermission__item editPermission__item-disable">
                    <div class="editPermission__item-group">
                        <div class="checkGroupHead">
                            <el-checkbox v-model="checkAll">Разрешить все</el-checkbox>
                        </div>
                        <el-checkbox-group>
                            <el-checkbox v-for="item in permissions" :label="item.name" :key="item.id"></el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
            </el-card-module>

        </div>

        <template slot="footer-actions">
            <el-button type="primary" icon="mdi mdi-content-save">Сохранить группу / Сохранить изменения</el-button>
        </template>
        <!--Удалить группу-->
        <el-dialog
                title="Удалить группу прав доступа?"
                :visible.sync="dialogGroupDelete"
                width="520px"
                top="calc(50vh - 90px)"
                :show-close="false">
            <span>Вы действительно хотите удалить группу прав доступа? Данное действие невозможно отменить.</span>
            <span slot="footer" class="dialog-footer">
                <el-button plain @click="dialogGroupDelete = false">Отмена</el-button>
                <el-button type="primary" @click="dialogGroupDelete = false">Удалить</el-button>
            </span>
        </el-dialog>
    </el-card-module>
</template>

<script>
    export default {
        data() {
            return {
                checkAll: false,
                permissionCheck: [],
                dialogGroupDelete: false,
                permissions: [
                    {name: 'Название действия'},
                    {name: 'Название действия'},
                    {name: 'Название действия'},
                    {name: 'Название действия'},
                    {name: 'Название действия'},
                    {name: 'Название действия'},
                    {name: 'Название действия'},
                    {name: 'Название действия'},
                    {name: 'Название действия'},
                ],
                isIndeterminate: true
            };
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
