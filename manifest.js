module.exports = {
    name: "Сотрудники", // Наименование модуля
    desc: "Модуль работников", // Описание модуля
    version: "0.0.1", // Текущая версия
    namespace: 'workers', // Namespace нужен для разработки
    icon: "account", // Иконка приложения в основном меню
    endpoint: {
        dev: {
            type: "web",
            url: 'http://localhost:8082'
        },
        prod: {
            type: 'file',
            endpointDir: '/dist',
            endpointFile: 'index.html'
        }
    },
    databaseTables: [
        {
            name: 'employees',
            indexes: ['position'],
        },
        {
            name: 'employees_positions',
            indexes: ['employees_id'],
        },
        /*{
            name: 'counterparties_bank_details',
            indexes: ['counterparties_id'],
        },
        {
            name: 'counterparties_locations',
            indexes: ['counterparties_id'],
        }*/
    ],
    permission: [
        {
            key: 'user-get-all',
            name: 'Получение списка пользователей',
            desc: 'Может получать список пользователей'
        }
    ]
};