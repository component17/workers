<template>
    <div class="newWorkerInfo">
        <el-form label-width="200px" label-position="left">
            <el-form-item label="Фамилия" required>
                <el-input/>
            </el-form-item>
            <el-form-item label="Имя" required>
                <el-input/>
            </el-form-item>
            <el-form-item label="Отчество" required>
                <el-input/>
            </el-form-item>
            <el-form-item label="Пол" required>
                <el-select placeholder="Select" value="man">
                    <el-option
                            label="Мужской"
                            value="man">
                    </el-option>
                    <el-option
                            label="Женский"
                            value="woman">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="Должность" required>
                <el-select placeholder="Выберите из списка" value="">
                    <el-option
                            label="test1"
                            value="test1">
                    </el-option>
                    <el-option
                            label="test2"
                            value="test2">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="Город">
                <div class="form__mediumInput">
                    <el-input/>
                </div>
            </el-form-item>
            <el-form-item label="Контактный телефон">
                <div class="form__mediumInput">
                    <el-input/>
                </div>
            </el-form-item>
            <el-form-item>
                <template slot="label">
                    Теги
                    <el-tooltip content="Теги используются для быстрой идентификации" placement="top">
                        <i class="mdi mdi-help-circle"></i>
                    </el-tooltip>
                </template>
                <div class="form__tags">
                    <el-tag
                            :key="tag"
                            v-for="tag in dynamicTags"
                            closable
                            :disable-transitions="false"
                            @close="handleClose(tag)">
                        {{tag}}
                    </el-tag>
                    <el-input
                            class="input-new-tag"
                            v-if="inputVisible"
                            v-model="inputValue"
                            ref="saveTagInput"
                            size="mini"
                            @keyup.enter.native="handleInputConfirm"
                            @blur="handleInputConfirm"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" @click="showInput" plain icon="mdi mdi-plus">Добавить тег</el-button>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                value: '',
                access: true,
                dynamicTags: [],
                inputVisible: false,
                inputValue: '',
            }
        },
        methods: {
            goBack() {
                this.$router.go(-1)
            },
            handleClose(tag) {
                this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
            },

            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },

            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue) {
                    this.dynamicTags.push(inputValue);
                }
                this.inputVisible = false;
                this.inputValue = '';
            }
        }

    }
</script>

<style scoped>

</style>
