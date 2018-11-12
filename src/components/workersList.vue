<template>
  <div class="workersList">
    <div class="workersList__head">
      <div class="workersList__head-search">
        <el-input placeholder="Найти сотрудника"/>
      </div>
      <div class="workersList__head-actions">
        <el-select v-model="groupActionsValue" placeholder="Групповые действия">
          <el-option
            v-for="item in groupActions"
            :label="item.title"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="workersList__table">
      <el-table
        :data="usersTable"
        border
        style="width: 100%"
        :cell-class-name="cellClass">
        <el-table-column
          type="selection"
          width="35"
          :resizable="false">
        </el-table-column>
        <el-table-column
          label="Имя"
          sortable
          :resizable="false">
          <template slot-scope="scope">
            <router-link :to="scope.row.link" class="workersList__table-name" :title="scope.row.name">
              {{ scope.row.name }}
            </router-link>
          </template>
        </el-table-column>
          <el-table-column
                  label="Пол"
                  :filters="[{text: 'test', value: 'test'}]"
                  :resizable="false"
                  width="80"
                  prop="gender"
                  show-overflow-tooltip>
          </el-table-column>
          <el-table-column
                  label="Город"
                  sortable
                  :resizable="false"
                  prop="city">
          </el-table-column>
          <el-table-column
                  label="Телефон"
                  width="120"
                  :resizable="false">
              <template slot-scope="scope">
            <span class="workersList__table-phone" :title="scope.row.phone">
              {{ scope.row.phone }}
            </span>
              </template>
          </el-table-column>
        <el-table-column
          label="Должность"
          width="160px"
          :filters="[{text: 'test', value: 'test'}]"
          :resizable="false">
          <template slot-scope="scope">
            <el-select v-model="value" placeholder="Группа доступа">
              <el-option value="test">
                test
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="Теги"
          :filters="[{text: 'test', value: 'test'}]"
          :resizable="false">
          <template slot-scope="scope">
            <div class="workersList__table-tags">
              <span v-for="item in scope.row.tags" :key="item.id">
              {{ item.name }}
              </span>
              <el-button type="text"><i class="mdi mdi-dots-horizontal"></i></el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="Действия"
          width="100px"
          align="center"
          :resizable="false">
          <template slot-scope="scope">
            <div class="cell-buttons workersList__table-buttons">
              <el-button type="text">
                <i class="mdi mdi-pencil"></i>
              </el-button>
              <el-button type="text"
                         :class="userBlock === true ? 'userBlock' : ''"
                         @click="(userBlock === false ? dialogUserBlock = true : dialogUserUnblock = true) && (thisUserMail(scope.row.mail))">
                <i class="mdi mdi-block-helper"></i>
              </el-button>
              <el-button type="text" @click="dialogUserDelete = true">
                <i class="mdi mdi-delete"></i>
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--Заблокировать сотрудника-->
    <el-dialog
      title="Заблокировать сотрудника"
      :visible.sync="dialogUserBlock"
      width="520px"
      top="calc(50vh - 90px)"
      :show-close="false">
      <span>Вы действительно хотите ограничить доступ сотрудника <b>{{userMail}}</b> к конфигурации? Активный сеанс будет автоматически завершен.</span>
      <span slot="footer" class="dialog-footer">
                <el-button plain @click="dialogUserBlock = false">Отмена</el-button>
                <el-button type="primary"
                           @click="(dialogUserBlock = false) || (userBlock = true)">
                    Заблокировать
                </el-button>
            </span>
    </el-dialog>
    <!--Разблокировать сотрудника-->
    <el-dialog
      title="Разблокировать сотрудника"
      :visible.sync="dialogUserUnblock"
      width="520px"
      top="calc(50vh - 90px)"
      :show-close="false">
      <span>Доступ сотрудника <b>{{userMail}}</b> к конфигурации будет восстановлен.</span>
      <span slot="footer" class="dialog-footer">
                <el-button plain @click="dialogUserBlock = false">Отмена</el-button>
                <el-button type="primary"
                           @click="(dialogUserUnblock = false) || (userBlock = false)">
                    Разблокировать
                </el-button>
            </span>
    </el-dialog>
    <!--Удалить сотрудника-->
    <el-dialog
      title="Удалить сотрудника?"
      :visible.sync="dialogUserDelete"
      width="520px"
      top="calc(50vh - 90px)"
      :show-close="false">
      <span>Вы действительно хотите удалить сотрудника <b>{{userMail}}</b> из конфигурации? Данное действие невозможно отменить.</span>
      <span slot="footer" class="dialog-footer">
                <el-button plain @click="dialogUserDelete = false">Отмена</el-button>
                <el-button type="primary" @click="dialogUserDelete = false">Удалить</el-button>
            </span>
    </el-dialog>
    <!--Массовое удаление-->
    <el-dialog
      title="Удалить выбранные объекты?"
      :visible.sync="dialogGroupDelete"
      width="520px"
      top="calc(50vh - 90px)"
      :show-close="false">
            <span>Вы действительно хотите удалить выбранные объекты?
                Данное действие невозможно отменить.</span>
      <span slot="footer" class="dialog-footer">
                <el-button plain @click="dialogGroupDelete = false">Отмена</el-button>
                <el-button type="primary" @click="dialogGroupDelete = false">Удалить</el-button>
            </span>
    </el-dialog>
    <!--Массовая блокировка-->
    <el-dialog
      title="Заблокировать выбранные объекты?"
      :visible.sync="dialogGroupBlock"
      width="520px"
      top="calc(50vh - 90px)"
      :show-close="false">
            <span>Вы действительно хотите ограничить доступ выбранных объектов к конфигурации?
                Сеансы всех активных пользователей будут автоматически завершены.</span>
      <span slot="footer" class="dialog-footer">
                <el-button plain @click="dialogGroupBlock = false">Отмена</el-button>
                <el-button type="primary" @click="dialogGroupBlock = false">Подтвердить</el-button>
            </span>
    </el-dialog>
    <!--Массовая разблокировка-->
    <el-dialog
      title="Разблокировать выбранные объекты?"
      :visible.sync="dialogGroupUnblock"
      width="520px"
      top="calc(50vh - 90px)"
      :show-close="false">
      <span>Доступ выбранных объектов к конфигурации будет восстановлен.</span>
      <span slot="footer" class="dialog-footer">
                <el-button plain @click="dialogGroupUnblock = false">Отмена</el-button>
                <el-button type="primary" @click="dialogGroupUnblock = false">Подтвердить</el-button>
            </span>
    </el-dialog>
    <!--Новый сотрудник-->
    <el-dialog
      title="Новый сотрудник"
      :visible.sync="dialogNewWorker"
      width="520px"
      top="calc(50vh - 123px)"
      :show-close="false">
      <div class="dialogNewWorker">
        <p>Приглашение будет отправлено на указанный e-mail.</p>
        <el-form>
          <el-form-item>
            <el-input placeholder="Введите e-mail"/>
          </el-form-item>
          <el-form-item>
            <el-select v-model="value2" placeholder="Группа доступа">
              <el-option value="test">
                test
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
                <el-button plain @click="dialogNewWorker = false">Отмена</el-button>
                <el-button type="primary" @click="dialogNewWorker = false">Пригласить</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        value: '',
        value2: '',
        groupActionsValue: '',
        dialogUserBlock: false,
        dialogUserUnblock: false,
        dialogUserDelete: false,
        userBlock: false,
        userMail: '',
        dialogGroupDelete: false,
        dialogGroupBlock: false,
        dialogGroupUnblock: false,
        dialogNewWorker: false,
        groupActions: [
          {title: 'Удалить выбранные', value: 'delete'},
          {title: 'Заблокировать выбранные', value: 'block'},
        ],
        usersTable: [
          {
            mail: 'ali.adams@yahoo.com',
            name: 'Константинопольский Константин Александрович',
            phone: '+7 831-090-2171',
            link:'/personCard',
            gender: 'Человек',
            city: 'Нижний Новгород',
            tags: [
              {name: 'Продукты питания'},
              {name: 'Продукты питания'},
              {name: 'Одежда'},
            ]
          },
          {
            mail: 'valentin.runolfsson@erdman.net',
            name: 'Алексеева Светлана Николаевна',
            phone: '909-828-7928',
            link:'/personCard',
            gender: 'Почти человек',
            city: 'Воронеж',
            tags: [
              {name: 'Электроника'},
              {name: 'Прочее'},
            ]
          },
        ]
      }
    },
    watch: {
      groupActionsValue(state) {
        this.clickSelect(state)
      }
    },
    methods: {
      cellClass({columnIndex}) {
        if (columnIndex === 5) {
          return 'cellSelect'
        }
        else {
          return ''
        }
      },
      thisUserMail(userMail) {
        this.userMail = userMail;
      },
      clickSelect(value) {
        if (value === 'delete') {
          this.dialogGroupDelete = true;
        } else if (value === 'block') {
          this.dialogGroupBlock = true;
        } else if (value === 'unblock') {
          this.dialogGroupUnblock = true;
        }
      },
    },
  }
</script>

<style scoped>

</style>
