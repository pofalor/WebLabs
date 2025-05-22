const mysql = require("mysql2");
const express = require("express");
const Sequelize = require("sequelize");
const app = express();
app.set("view engine", "pug");
app.use(express.static(__dirname + "/client"));
app.use(express.urlencoded({ extended: true }));
// определяем объект Sequelize
const sequelize = new Sequelize("dbtodos", "root", "admin",
    {
        // logging: false,
        dialect: "mysql",
        host: "localhost",
        define: { timestamps: false }
    }
);
// определяем модель Task
const Task = sequelize.define("todos", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    tags: {
        type: Sequelize.JSON, // JSON строкой,
        // например,
        // {"tags": ["Тест", "66"], "description": "Задача №3"}
        allowNull: false
        // defaultValue: {}
    }
}
);
// синхронизация с бд, после успшной синхронизации запускаем сервер
sequelize.sync().then(() => {
    app.listen(3000, function () {
        console.log("Сервер ожидает подключения...");
    });
}).catch(err => console.log(err));
// Далее идут запросы
// Получение списка задач
app.get("/todos.json", function (req, res) {
    Task.findAll({ raw: true }).then(data => {
        console.log(data);
        res.json(data);
    }).catch(err => console.log(err));
});
// Добавлени новой задачи
app.post("/todos", (req, res) => {
    if (!req.body) return res.sendStatus(400);
    const description = req.body.description;
    const tags = req.body.tags;
    console.log(req.body);
    Task.create({
        tags: {
            "tags": tags, "description": description
        }
    }).then(() => {
        res.sendStatus(200);
    }).catch(err => console.log(err));
});
// удаляем задачу из бд по id
app.post("/api/todos/delete/:id", function (req, res) {
    const id = req.params.id;
    Task.destroy({
        where: { id: id }
    }).then(r => {
        // console.log(r);
        res.sendStatus(200);
    });
});
/* получем id редактируемой задачи,
 получаем её из БД и отправляем с формой редактирования*/
app.get("/api/todos/edit/:id", function (req, res) {
    const id = req.params.id;
    Task.findByPk(id).then(task => {
        if (!task) return; // задача не найден
        const description = task.dataValues.tags.description;
        const tags = task.dataValues.tags.tags;
        res.render("edit", {
            id: id,
            description: description,
            tags: tags
        });
    }).catch(err => console.log(err));
});
// получаем данные отредактированной задачи и отправляем их в БД
app.post("/api/todos/edit", /*urlencodedParser,*/ function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const id = req.body.id;
    const tags = {
        tags: req.body.tags.split(','),
        description: req.body.description
    };
    Task.update({ tags: tags },
        { where: { id: id } }
    ).then(r => {
        // console.log(r);
        res.redirect("/");
    }).catch(err => console.log(err));
});
