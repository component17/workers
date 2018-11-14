<template>
    <div v-if="$route.query">
        <div v-if="$route.query.code == 500">
            <h2>Ошибка сервера (CODE: {{ $route.query.code }})</h2>
            <p>Возникли проблемы на стороне сервера.<br>Приносим свои извинения, повторите операцию позже!</p>

            <el-button @click="$router.go(-1)">Назад</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        created(){}
    }
</script>

<style scoped>

</style>