<template>
    <el-card-module
            title="Константинопольский Константин Александрович"
            btnBack
            showHeader
            @goBack="goBack"
            showFooter
    >
        <template slot="header-actions">
            <el-button plain icon="mdi mdi-pencil">Редактировать</el-button>
            <el-button plain icon="mdi mdi-delete">Удалить</el-button>
        </template>
        <div class="personCard">
            <div class="personCardInfo">
                <div class="personCardInfo__head">
                    <div class="personCardInfo__head-title">
                        <h2>Александрова Екатерина Алексеевна</h2>
                    </div>
                </div>
                <div class="personCardInfo__info">
                    <div class="personCardInfo__info-item">
                        <h3>Пол:</h3>
                        <p>мужской</p>
                    </div>
                    <div class="personCardInfo__info-item">
                        <h3>Город:</h3>
                        <p>Москва</p>
                    </div>
                    <div class="personCardInfo__info-item">
                        <h3>Контактный телефон:</h3>
                        <p>+7(999)999-9999</p>
                    </div>
                    <div class="personCardInfo__info-item">
                        <h3>Метки:</h3>
                        <div class="personCardInfo__tags">
                            <div class="personCardInfo__tags-item">Продукты питания</div>
                            <div class="personCardInfo__tags-item">Прочее</div>
                            <div class="personCardInfo__tags-item">Электроника</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="personCard__tabs">
            <el-tabs v-model="activeName" type="border-card">
                <el-tab-pane label="Доступ к ПО" name="accessPO">
                    <newWorkerAccessPO/>
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
            <el-button type="danger" icon="mdi mdi-block-helper">Заблокировать</el-button>
        </template>
    </el-card-module>
</template>

<script>
    export default {
        data() {
            return {
                activeName: 'accessPO',
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
