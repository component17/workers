<template>
    <div class="requestPagination" v-if="total > 0">

        <!--<span>Показано {{(page - 1) * limit + 1 }} - {{ total > page * limit ? page * limit : total }} из {{total}} записей</span>-->
        <!--<p class="requestPagination-po" v-if="total > 10">Показать по</p>-->

        <!--<el-pagination-->
                <!--small-->
                <!--:page-sizes="[100, 200, 300, 400]"-->
                <!--:page-size="100"-->
                <!--layout="sizes, prev, pager, next"-->
                <!--:total="400">-->
        <!--</el-pagination>-->
        <el-pagination
                small
                :page-sizes="[10, 20, 50, 100]"
                :current-page="page"
                :page-size="limit"
                :total="total"
                @current-change="changeCurrentPage"
                @size-change="changeSize"
                layout="sizes, prev, pager, next">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        name: 'pagination-block',
        props: {
            limit: {type: Number, default: 10},
            page: {type: Number, default: 1},
            total: {type: Number, default: 0},
        },
        methods: {
            changeCurrentPage(new_val){
                this.$emit('changeCurrentPage', new_val);
            },
            changeSize(new_val){
                this.$emit('changeSize', new_val);
            }
        }

    }
</script>

<style>

</style>