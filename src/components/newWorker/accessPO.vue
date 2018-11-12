<template>
    <div class="newWorkerAccessPO">
        <el-form label-width="200px" label-position="left">
            <h2>Учетная запись UPoint</h2>
            <p>Указанные данные предназначены для авторизации сотрудника в UPoint.</p>
            <el-form-item label="E-mail">
                <div class="form__mediumInput">
                    <el-input/>
                </div>
            </el-form-item>
            <el-form-item label="Группа доступа">
                <div class="form__mediumInput">
                    <el-select placeholder="Select" value="test">
                        <el-option
                                label="test"
                                value="test">
                        </el-option>
                    </el-select>
                </div>
            </el-form-item>
            <h2>Сторонние приложения</h2>
            <p>Указанные данные предназначены для авторизации в стороннем ПО (приложения для ТСД, кассы, приложения контроля заказов и др.) Пароль должен
                содержать не менее 4 символов.</p>
            <el-form-item label="Логин">
                <div class="form__mediumInput">
                    <el-input/>
                </div>
            </el-form-item>
            <el-form-item label="Пароль">
                <div class="form__mediumInput">
                    <el-input>
                        <el-button slot="append">Сгенерировать</el-button>
                    </el-input>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                showPassword: false,
            }
        }
    }
</script>

<style scoped>

</style>
