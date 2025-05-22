const mysql = require("mysql2");
const express = require("express");
const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    database: "dbtodos",
    password: "admin"
});
const app = express();
app.set("views", __dirname + "/client/views");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/client/"));
app.use(express.urlencoded({ extended: true }));
app.get("/todos.json", function (req, res) {
    pool.query("SELECT * FROM todos", function (err, data) {
        if (err)
            return console.log(err);
        // console.log(data);
        res.json(data);
    });
});
app.post("/todos", (req, res) => {
    if (!req.body) return res.sendStatus(400);
    const description = req.body.description;
    const tags = req.body.tags;
    // console.log(req.body);
    pool.query('INSERT INTO todos(tags) VALUES(?)', [JSON.stringify(req.body)],
        function (err, data) {
            if (err) return console.log(err);
            res.sendStatus(200); // остаться на табе №4
            // res.redirect("/"); // перейти на таб №1
        });
});
// удаляем пользователя из бд по id
app.post("/api/todos/delete/:id", function (req, res) {
    const id = req.params.id;
    pool.query("DELETE FROM todos WHERE id=?", [id], function (err, data) {
        if (err) return console.log(err);
        res.sendStatus(200); // остаться на табе №4
        // res.redirect("/");
    });
});
/* получем id редактируемого пользователя,
 получаем его из бд и отправляем с формой редактирования*/
app.get("/api/todos/edit/:id", function (req, res) {
    const id = req.params.id;
    pool.query("SELECT * FROM todos WHERE id=?", [id], function (err, data) {
        if (err) return console.log(err);
        // console.log(data);
        res.render("edit.ejs", {
            "id": data[0].id,
            "description": data[0].tags.description,
            "tags": data[0].tags.tags
        });
    });
});
// получаем отредактированные данные и отправляем их в БД
app.post("/api/todos/edit", /*urlencodedParser,*/ function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const toDo = {
        id: req.body.id,
        tags: {
            tags: req.body.tags.split(','),
            description: req.body.description
        }
    };
    // console.log( "==="); console.log( toDo); console.log( "===");
    pool.query("UPDATE todos SET tags=? WHERE id=?",
        [JSON.stringify(toDo.tags), toDo.id],
        function (err, data) {
            if (err) return console.log(err);
            res.redirect("/");
        });
});
app.listen(3000, function () {
    console.log("Сервер ожидает подключения на порту 3000 ...");
});
