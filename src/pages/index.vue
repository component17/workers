<template>
    <vue-perfect-scrollbar class="scroll-area">
        <div class="workersWrapper">
            <div class="workersTabs">
                <el-card-module
                        title="Сотрудники"
                        showHeader
                        @goBack="goBack"
                        showFooter
                >
                    <template slot="header-actions">
                        <el-button plain @click="$router.push('/settings')" icon="mdi mdi-settings">Настройки</el-button>
                    </template>

                    <workersList/>

                    <template slot="footer">
                        <el-pagination
                                :page-sizes="[100, 200, 300, 400]"
                                :page-size="100"
                                layout="sizes, prev, pager, next"
                                :total="400">
                        </el-pagination>
                    </template>

                    <template slot="footer-actions">
                        <el-button type="primary" @click="$router.push('/newWorker')" icon="mdi mdi-account-plus">Добавить сотрудника</el-button>
                    </template>

                </el-card-module>
            </div>
        </div>
    </vue-perfect-scrollbar>
</template>

<script>
    export default {
        data() {
            return {
                activeName: 'workersList'
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
