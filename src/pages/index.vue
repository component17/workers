<template>
    <vue-perfect-scrollbar class="scroll-area">
        <div class="workersWrapper">
            <div class="workersTabs">
                <el-col style="width: 100%; height: 100vh;" v-if="!$store.state.employees.list" v-loading="true"></el-col>
                <el-card-module
                        v-else
                        title="Сотрудники"
                        showHeader
                        @goBack="goBack"
                        showFooter
                >
                    <template slot="header-actions">
                        <el-button plain @click="$router.push('/settings')" icon="mdi mdi-settings">Настройки</el-button>
                    </template>

                    <workersList :list="$store.state.employees.list"/>

                    <template slot="footer">
                        <el-pagination
                                small
                                :page-sizes="[100, 200, 300, 400]"
                                :page-size="100"
                                layout="sizes, prev, pager, next"
                                :total="400">
                        </el-pagination>
                    </template>

                    <template slot="footer-actions">
                        <el-button type="primary" @click="$router.push('/employee/create')" icon="mdi mdi-account-plus">Добавить сотрудника</el-button>
                    </template>

                </el-card-module>
            </div>
        </div>
    </vue-perfect-scrollbar>
</template>

<script>
    import { mapActions } from 'vuex'
    export default {
        data() {
            return {
                activeName: 'workersList'
            };
        },
        created(){
            this.getPositions().then(() => {
                this.getWorkers().then(result => {
                    console.log('Your employees list: ', result);
                }).catch(error => {
                    this.$router.push('/error?code=500');
                });
            });
        },
        methods: {
            ...mapActions({
                getWorkers: 'employees/GET_EMPLOYEES_LIST',
                getPositions: 'positions/GET_POSITIONS_LIST',
            }),
            getWorkerList(){

                // r.table('employee').get(this.id).merge((contr) => {
                //     return {
                //         faces: r.table("counterparties_faces").getAll(contr('id'), {index: 'counterparties_id'}).filter({deletedAt: null}).coerceTo('array'),
                //         banks: r.table("counterparties_bank_details").getAll(contr('id'), {index: 'counterparties_id'}).filter({deletedAt: null}).coerceTo('array'),
                //         locations: r.table("counterparties_locations").getAll(contr('id'), {index: 'counterparties_id'}).filter({deletedAt: null}).coerceTo('array'),
                //     }
                // }).run(conn, (err, data) => {
                //     if(interval){
                //         clearTimeout(interval);
                //     }
                //
                //     this.model = data;
                //     this.is_loading_data = false;
                // });
            },
            goBack() {
                this.$router.go(-1)
            },
        }
    }
</script>

<style scoped>

</style>
