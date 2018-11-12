<template>
    <el-card-module
            title="Настройки"
            btnBack
            showHeader
            @goBack="goBack"
            showFooter
    >
        <div class="settingsWrapper">
            <div class="settingsTabs">
                <el-tabs v-model="activeName" type="border-card">
                    <el-tab-pane label="Группы прав доступа" name="permissions"><permissions/></el-tab-pane>
                    <el-tab-pane label="Шаблон карточки сотрудника" name="workerCard"><settingWorkerCard/></el-tab-pane>
                    <el-tab-pane label="Справочник должностей" name="functions"><functions/></el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <template slot="footer">
            <el-pagination
                    :page-sizes="[100, 200, 300, 400]"
                    :page-size="100"
                    layout="sizes, prev, pager, next"
                    :total="400">
            </el-pagination>
        </template>

        <template slot="footer-actions">
            <el-button type="primary" @click="$router.push('/editPermission')" icon="mdi mdi-plus" v-if="activeName === 'permissions'">Создать группу</el-button>
            <el-button type="primary" @click="$router.push('/formMaker')" icon="mdi mdi-plus" v-if="activeName === 'workerCard'">Новый раздел</el-button>
            <el-button type="primary" @click="dialogAddFunction = !dialogAddFunction" icon="mdi mdi-plus" v-if="activeName === 'functions'">Добавить должность</el-button>
        </template>
        <!--Добавить должность-->
        <el-dialog
                title="Новая должность"
                :visible.sync="dialogAddFunction"
                width="520px"
                top="calc(50vh - 90px)"
                :show-close="false">
            <span>Введите название должности</span>
            <el-input/>
            <span slot="footer" class="dialog-footer">
                <el-button plain @click="dialogAddFunction = false">Отмена</el-button>
                <el-button type="primary" @click="dialogAddFunction = false">Добавить</el-button>
            </span>
        </el-dialog>
    </el-card-module>
</template>

<script>
    export default {
        data() {
            return {
                activeName: 'permissions',
                dialogAddFunction: false,
            };
        },
        methods: {
            goBack(){
                this.$router.go(-1)
            },
        }
    }
</script>

<style scoped>

</style>
