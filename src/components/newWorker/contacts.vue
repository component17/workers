<template>
  <div class="newWorkerContacts">
    <el-form label-width="200px" label-position="left">
      <el-form-item label="Телефон" required>
        <el-input placeholder="+7 (___) ___ __ __"/>
      </el-form-item>
      <el-form-item label="Доп. телефон" required>
        <el-input placeholder="+7 (___) ___ __ __"/>
      </el-form-item>
      <el-form-item label="E-mail" required>
        <el-input/>
      </el-form-item>
      <el-form-item label="Адрес проживания" required>
        <el-input/>
        <span>Необходимо указать адрес фактического проживания</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {

  }
</script>

<style scoped>

</style>
