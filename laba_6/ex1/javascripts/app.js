var main = function (toDoObjects) {
    "use strict";
    
    var toDos = toDoObjects.map(function (toDo) {
        return toDo.description;
    });

    var organizeByTag = function (toDoObjects) {
        var tags = [];
        
        toDoObjects.forEach(function (toDo) {
            toDo.tags.forEach(function (tag) {
                if (tags.indexOf(tag) === -1) {
                    tags.push(tag);
                }
            });
        });
        
        var tagObjects = tags.map(function (tag) {
            var toDosWithTag = [];
            
            toDoObjects.forEach(function (toDo) {
                if (toDo.tags.indexOf(tag) !== -1) {
                    toDosWithTag.push(toDo.description);
                }
            });
            
            return { "name": tag, "toDos": toDosWithTag };
        });
        
        return tagObjects;
    };

    $(".tabs a span").toArray().forEach(function (element) {
        $(element).on("click", function () {
            var $element = $(element);
            $(".tabs a span").removeClass("active");
            $element.addClass("active");
            $("main .content").empty();

            if ($element.parent().is(":nth-child(1)")) {
                var $content = $("<ul>");
                for (var i = toDos.length - 1; i >= 0; i--) {
                    $content.append($("<li>").text(toDos[i]));
                }
                $("main .content").append($content);
            } else if ($element.parent().is(":nth-child(2)")) {
                var $content = $("<ul>");
                toDos.forEach(function (todo) {
                    $content.append($("<li>").text(todo));
                });
                $("main .content").append($content);
            } else if ($element.parent().is(":nth-child(3)")) {
                var organizedByTag = organizeByTag(toDoObjects);
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
                var $input = $("<input>").addClass("description"),
                    $inputLabel = $("<p>").text("Новая задача: "),
                    $tagInput = $("<input>").addClass("tags"),
                    $tagLabel = $("<p>").text("Тэги: "),
                    $button = $("<span>").text("+");
                
                $button.on("click", function () {
                    var description = $input.val(),
                        tags = $tagInput.val().split(",");
                    
                    toDoObjects.push({"description": description, "tags": tags});
                    toDos = toDoObjects.map(function (toDo) {
                        return toDo.description;
                    });
                    
                    $input.val("");
                    $tagInput.val("");
                });
                
                $("main .content").append($inputLabel)
                                 .append($input)
                                 .append($tagLabel)
                                 .append($tagInput)
                                 .append($button);
            }
            return false;
        });
    });
    
    $(".tabs a:first-child span").trigger("click");
};

$(document).ready(function () {
    $.getJSON("todos.json", function (toDoObjects) {
        main(toDoObjects);
    });
});