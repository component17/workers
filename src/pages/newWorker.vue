<template>
  <vue-perfect-scrollbar class="scroll-area">
    <el-card-module
            title="Новый сотрудник"
            btnBack
            showHeader
            @goBack="goBack"
            showFooter
    >
      <template slot="header-actions">
        <el-button plain icon="mdi mdi-delete">Удалить запись (если редактирование)</el-button>
      </template>
    <div class="newWorker">
      <div class="auto__search">
        <div class="auto__search-title">
          <h2>Автозаполнение ФИО</h2>
        </div>
        <div class="auto__search-input">
          <el-input placeholder="Введите название в свободной форме, адрес, ИНН или ОГРН"/>
        </div>
      </div>
      <div class="newWorker__tabs">
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane label="Основные" name="info"><newWorkerInfo/></el-tab-pane>
          <el-tab-pane label="Доступ к ПО " name="accessPO"><newWorkerAccessPO/></el-tab-pane>
        </el-tabs>
      </div>
    </div>
      <template slot="footer-actions">
        <el-button type="primary" @click="$router.push('/newWorker')" icon="mdi mdi-content-save">Создать сотрудника1 / Сохранить изменения</el-button>
      </template>

    </el-card-module>
  </vue-perfect-scrollbar>
</template>

<script>
  export default {
    data() {
      return {
        activeName: 'info',
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
