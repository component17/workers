<template>
    <el-template-module show-nav>
        <template slot="navbar">
            <router-link to="/"><i class="mdi mdi-contacts" style="margin-right: 10px;"></i>Сотрудники</router-link>
            <!--<router-link to="/workTable"><i class="mdi mdi-calendar-check" style="margin-right: 10px;"></i>Учет рабочего времени</router-link>-->
        </template>
        <div id="appWorkers">
            <router-view/>
        </div>
    </el-template-module>
</template>

<script>
    export default {
        name: 'App',
        mounted() {
            upoint.module.ready();
        }
    }
</script>

<style>

</style>
