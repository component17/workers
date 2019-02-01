module.exports = {
    name: "Сотрудники", // Наименование модуля
    desc: "Модуль работников", // Описание модуля
    version: "0.0.1", // Текущая версия
    namespace: 'workers', // Namespace нужен для разработки
    icon: "account", // Иконка приложения в основном меню
    endpoint: {
        dev: {
            type: "web",
            url: 'http://localhost:9004'
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
            name: 'positions',
            indexes: ['employees_id'],
        },
    ]
};