<template>
  <div class="newWorkerPassport">
    <el-form label-width="200px" label-position="left">
      <el-form-item label="Серия и номер" required>
        <el-input/>
        <span>10 цифр, без пробелов</span>
      </el-form-item>
      <el-form-item label="Дата выдачи" required>
        <el-input placeholder="дд"/>
        <el-input placeholder="мм"/>
        <el-input placeholder="гг"/>
      </el-form-item>
      <el-form-item label="Кем выдан" required>
        <el-input type="textarea" rows="2" resize="none"/>
      </el-form-item>
      <el-form-item label="Код подразделения" required>
        <el-input/>
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
