var toDoObjectsById;
function createTable() {
    const tbody = document.querySelector("tbody");
    toDoObjectsById.forEach(toDoById => {
        // добавляем полученные элементы в таблицу
        debugger
        tbody.append(row(toDoById));
    });
    $("div.contentcrud").show(); //add
}
// создание строки для таблицы
function row(todo) {
    const tr = document.createElement("tr");
    tr.setAttribute("data-rowid", todo.id);

    const idTd = document.createElement("td");
    idTd.append(todo.id);
    tr.append(idTd);

    const descriptionTd = document.createElement("td");
    descriptionTd.append(todo.tags.description);
    tr.append(descriptionTd);

    const tagsTd = document.createElement("tags");
    tagsTd.append(todo.tags.tags);
    tr.append(tagsTd);

    const linksTd = document.createElement("td");

    const editLink = document.createElement("a");
    editLink.setAttribute("data-id", todo.id);
    // editLink.setAttribute("class", "btn");
    editLink.append("Изменить");
    // editLink.addEventListener("click", e => {
    // e.preventDefault();
    // GetUser(todo.id);
    // });
    editLink.setAttribute("href", "/api/todos/edit/" + todo.id);
    linksTd.append(editLink);

    const removeLink = document.createElement("a");
    removeLink.setAttribute("data-id", todo.id);
    removeLink.setAttribute("class", "btn");
    removeLink.append("Удалить");

    removeLink.addEventListener("click", e => {
        e.preventDefault();
        DeleteUser(todo.id)
            .then(res => {
                // console.log(result);
                main(res);
            })
            .catch(err => {
                console.log(err);
            });
    });
    linksTd.append(removeLink);
    tr.appendChild(linksTd);

    return tr;
}
var main = function (toDoObjects) {
    "use strict";
    var toDos = toDoObjects.map(function (toDo) {
        return toDo.description;
    });
    var organizeByTags = function (toDoObjects) {
        //console.log("organizeByTags вызвана - 0");
        var toArr = [];
        var toTags = [];
        toDoObjects.forEach(function (e1) {
            //console.log(e);
            e1.tags.forEach(function (tag) {
                if (toArr.indexOf(tag) === -1) {
                    //console.log(tag);
                    toArr.push(tag);
                    toTags.push({
                        "name": tag,
                        "toDos": [e1.description]
                    });
                } else {
                    toTags.forEach(function (e2) {
                        if (e2.name === tag) {
                            e2.toDos.push(e1.description);
                        }
                    });
                }
            });
        });
        //console.log(toTags);
        return toTags;
    };
    $(".tabs a span").toArray().forEach(function (element) {
        $(element).on("click", function () {
            var $element = $(element),
                $content;
            $(".tabs a span").removeClass("active");
            $element.addClass("active");
            $("main .content").empty();

            $("div.contentcrud").hide(); //add
            $("div.contentcrud table tbody").empty();
            if ($element.parent().is(":nth-child(1)")) {
                var i;
                $content = $("<ul>");
                for (i = toDos.length; i > -1; i--) {
                    $content.append($("<li>").text(toDos[i]));
                }
            } else if ($element.parent().is(":nth-child(2)")) {
                $content = $("<ul>");
                toDos.forEach(function (todo) {
                    $content.append($("<li>").text(todo));
                });
            } else if ($element.parent().is(":nth-child(3)")) {
                //console.log("Щелчок на вкладке Теги");
                //console.log(organizeByTags(toDoObjects));
                var organizedByTag = organizeByTags(toDoObjects);
                organizedByTag.forEach(function (tag) {
                    var $tagName = $("<h3>").text(tag.name),
                        $content = $("<ul>");
                    tag.toDos.forEach(function (description) {
                        var $li = $("<li>").text(description);
                        $content.append($li);
                    });
                    $("main .content").append($tagName);
                    $("main .content").append($content);
                });
            } else if ($element.parent().is(":nth-child(4)")) {
                $content = $("<div>");
                $content.append($("<p>").text("Добавьте новую задачу"));
                var $input = $("<input>");
                var $button = $("<button>");
                $content.append($input);
                $content.append("<p>Теги</p>");
                var $input_tags = $("<input>");
                $content.append($input_tags);
                $content.append($button.text("+"));
                var description = $input.val();
                var tags = $input_tags.val().split(",");
                createTable();
                var addTaskFromInputBox = function () {
                    if ($input.val() !== "") {
                        var newToDo = {
                            "description": $input.val(),
                            "tags": $input_tags.val().split(",")
                        };
                        $.post("todos", newToDo, function (response) {
                            // console.log("Мы отправили данные и получили ответ сервера!");
                            // console.log(response);
                            toDos.push($input.val());
                            toDoObjects.push({
                                "description": $input.val(),
                                "tags": $input_tags.val().split(",")
                            });
                            $input.val("");
                            $input_tags.val("");
                            getUsers();
                            $("div.contentcrud table tbody").empty();
                            createTable();
                            $(".tabs a:first-child span").trigger("click");
                            // $(".tabs a span.active").trigger("click"); //??? надо
                        });
                    }
                };
                $button.on("click", function (event) {
                    addTaskFromInputBox();
                });
                $input.on("keypress", function (event) {
                    if (event.keyCode === 13) {
                        addTaskFromInputBox();
                    }
                });
                // console.log(toDoObjects);
            }
            $("main .content").append($content);
            return false;
        });
    });
    $(".tabs a:first-child span").trigger("click");
};
// Получение задач
async function getUsers() {
    const response = await fetch("todos.json", {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    // если запрос прошел нормально
    if (response.ok === true) {
        // получаем данные
        toDoObjectsById = await response.json();
        console.log(toDoObjectsById);
    }
}
// Удаление задачи
async function DeleteUser(id) {
    const response = await fetch("/api/todos/delete/" + id, {
        method: "POST",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        toDoObjectsById = toDoObjectsById.filter(todo => todo.id != id);
        let toDoObjects = toDoObjectsById.map(function (todo) {
            return todo.tags;
        });
        document.querySelector(`tr[data-rowid="${id}"]`).remove();
        // console.log(toDoObjects);
        return toDoObjects;
    }
}
$(document).ready(function () {
    $.getJSON("todos.json", function (toDoObjsById) {
        // вызываем функцию main с задачами в качестве аргумента
        // console.log(toDoObjsById);
        toDoObjectsById = toDoObjsById;
        let toDoObjects = toDoObjsById.map(function (todo) {
            return todo.tags;
        });
        // console.log(toDoObjects);
        main(toDoObjects);
    });
});
