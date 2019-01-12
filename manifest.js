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
    ],
    permission: [
        {
            key: 'user-get-all',
            name: 'Получение списка пользователей',
            desc: 'Может получать список пользователей'
        }
    ],
    serverWorker: 'https://firebasestorage.googleapis.com/v0/b/ustore-2d4e9.appspot.com/o/simple%20server.zip?alt=media&token=75af985a-084c-42ef-a75c-ce42389c6523',
    dependencies: [
        'workers'
    ]
};