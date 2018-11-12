<template>
    <el-card-module
            title="Табель учета рабочего времени"
            btnBack
            showHeader
            @goBack="goBack"
            showFooter
    >
        <template slot="header-actions">
            <el-button type="info">Редактировать вручную</el-button>
        </template>
        <div class="workTable">
            <div class="workTable__head">
                <div class="workTable__head-group">
                    <el-select v-model="value" placeholder="Все группы">
                        <el-option value="test">
                            test
                        </el-option>
                    </el-select>
                </div>
                <div class="workTable__head-workers">
                    <el-select v-model="value" placeholder="Все сотрудники">
                        <el-option value="test">
                            test
                        </el-option>
                    </el-select>
                </div>
                <div class="workTable__head-date">
                    <el-date-picker
                            v-model="value1"
                            type="month"
                            placeholder="Август 2018">
                    </el-date-picker>
                </div>
            </div>
            <div class="workTable__table">
                <el-table
                        :data="dataTable.items"
                        style="width: 100%"
                        max-height="10000"
                        border
                        :span-method="arraySpanMethod"
                        :cell-class-name="cellClass"
                >
                    <el-table-column
                            fixed
                            label="Сотрудник"
                            width="320"
                            align="left"
                            :resizable="false">
                        <template slot-scope="scope">
                            <p :class="arraySpanMethod">{{scope.row.name && scope.row.name ? scope.row.name : 'none'}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column :resizable="false" v-for="item in dataTable.days" :key="item" :label="item.toString()" min-width="36" align="center">
                        <template slot-scope="scope">
                            <span :class="noEmpty(item, scope)">{{ scope.row.id !== undefined ? workHours(item, scope) : '' }}</span>
                            <!--<span v-if="!scope.row.group">1</span>-->
                        </template>
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label="Смены"
                            width="70"
                            align="center"
                            :resizable="false">
                        <template slot-scope="scope">
                            <!--<span v-if="!scope.row.group">0</span>-->
                        </template>
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label="Часы"
                            width="70"
                            align="center"
                            :resizable="false">
                        <template slot-scope="scope">
                            <!--<span v-if="!scope.row.group">133</span>-->
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <template slot="footer">
            <el-pagination
                    :page-sizes="[100, 200, 300, 400]"
                    :page-size="100"
                    layout="sizes, prev, pager, next"
                    :total="400">
            </el-pagination>
        </template>

        <template slot="footer-actions">
            <el-button plain icon="mdi mdi-printer">Напечатать отчет</el-button>
            <el-button type="success" icon="mdi mdi-file-document">Экспорт в Excel</el-button>
        </template>
    </el-card-module>
</template>

<script>
    export default {
        data() {
            return {
                value: '',
                value1: '',
                tableData4: [
                    {worker: 'Администратор', group: true,},
                    {worker: 'Алексеева Светлана Николаевна',}, {
                        worker: 'Менеджер',
                        group: true,
                    }, {
                        worker: 'Александрова Екатерина Алексеевна',
                    }, {
                        worker: 'Борисов Николай Семенович',
                    }, {
                        worker: 'Старикова Алевтина Евгеньевна',
                    }, {
                        worker: 'Старикова Алевтина Евгеньевна',
                    }],
                dataTable: {
                    days: 31,
                    items: [
                        {
                            name: 'Администратор',
                        },
                        {
                            id: 1,
                            name: 'Алексеева Светлана Николаевна',
                            hours: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                        },
                        {
                            id: 2,
                            name: 'Борисов Николай Семенович',
                            hours: [0, 5, 0, 0, 0, 6, 8, 9, 7, 0, 5, 21, 5, 4, 47, 45, 45, 4],
                        },
                        {
                            id: 3,
                            name: 'Старикова Алевтина Евгеньевна',
                            hours: [0, 5, 0, 0, 0, 6, 8, 9, 7, 0],
                        },
                        {
                            name: 'Манагер',
                        },
                        {
                            id: 4,
                            name: 'Алексеева Светлана Николаевна',
                            hours: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 0],
                        },
                        {
                            id: 5,
                            name: 'Борисов Николай Семенович',
                            hours: [0, 5, 0, 0, 0, 6, 8, 9, 7, 0],
                        },
                        {
                            id: 6,
                            name: 'Старикова Алевтина Евгеньевна',
                            hours: [0, 5, 0, 0, 0, 6, 8, 9, 7, 0],
                        }
                    ],
                },
            }
        },
        methods: {
            goBack() {
                this.$router.go(-1)
            },
            workHours(a, b) {
                if (this.dataTable.items[b.$index].hours) {
                    return this.dataTable.items[b.$index].hours[a - 1] !== 0 ? this.dataTable.items[b.$index].hours[a - 1] : ''
                } else {
                    return '';
                }
            },
            noEmpty(a, b) {
                if (this.dataTable.items[b.$index].hours) {
                    return (this.dataTable.items[b.$index].hours[a - 1] !== 0) && (this.dataTable.items[b.$index].hours[a - 1] !== undefined) ? 'noEmptyHour' : ''
                } else {
                    return '';
                }
            },
            arraySpanMethod({row, column, rowIndex, columnIndex}) {
                if (row.hours === undefined) {
                    let spanArray = [1];
                    let last = this.dataTable.days + 3;
                    spanArray.push(last);
                    if (columnIndex === 0) {
                        return spanArray;
                        return 'test';
                    } else {
                        return [0, 0];
                    }
                }
            },
            cellClass({row}) {
                if (row.hours) {
                    return ''
                } else {
                    return 'groupTable'
                }
            }
        }
    }
</script>

<style scoped>

</style>
