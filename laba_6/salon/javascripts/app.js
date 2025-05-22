var main = function (serviceObjects) {
    "use strict";
    
    // Функция для форматирования даты и времени
    var formatDateTime = function(date, time) {
        return date + " в " + time;
    };

    // Функция для организации услуг по категориям
    var organizeByCategory = function(services) {
        var categories = [];
        
        services.forEach(function(service) {
            var found = false;
            
            categories.forEach(function(category) {
                if (category.name === service.category) {
                    category.services.push(service);
                    found = true;
                }
            });
            
            if (!found) {
                categories.push({
                    name: service.category,
                    services: [service]
                });
            }
        });
        
        return categories;
    };

    // Функция для организации услуг по мастерам
    var organizeByMaster = function(services) {
        var masters = [];
        
        services.forEach(function(service) {
            var found = false;
            
            masters.forEach(function(master) {
                if (master.name === service.master) {
                    master.services.push(service);
                    found = true;
                }
            });
            
            if (!found) {
                masters.push({
                    name: service.master,
                    services: [service]
                });
            }
        });
        
        return masters;
    };

    $(".tabs a span").toArray().forEach(function (element) {
        $(element).on("click", function () {
            var $element = $(element),
                $content;
            
            $(".tabs a span").removeClass("active");
            $element.addClass("active");
            $("main .content").empty();

            if ($element.parent().is(":nth-child(1)")) { // Новые
                $content = $("<div>");
                for (var i = serviceObjects.length - 1; i >= 0; i--) {
                    var service = serviceObjects[i];
                    var $serviceItem = $("<div>").addClass("service-item");
                    $serviceItem.append($("<h3>").text(service.name));
                    $serviceItem.append($("<p>").text("Категория: " + service.category));
                    $serviceItem.append($("<p>").text("Мастер: " + service.master));
                    $serviceItem.append($("<p>").text("Цена: " + service.price + " руб."));
                    $serviceItem.append($("<p>").text("Дата и время: " + formatDateTime(service.date, service.time)));
                    $content.append($serviceItem);
                }
            } 
            else if ($element.parent().is(":nth-child(2)")) { // Старые
                $content = $("<div>");
                serviceObjects.forEach(function(service) {
                    var $serviceItem = $("<div>").addClass("service-item");
                    $serviceItem.append($("<h3>").text(service.name));
                    $serviceItem.append($("<p>").text("Категория: " + service.category));
                    $serviceItem.append($("<p>").text("Мастер: " + service.master));
                    $serviceItem.append($("<p>").text("Цена: " + service.price + " руб."));
                    $serviceItem.append($("<p>").text("Дата и время: " + formatDateTime(service.date, service.time)));
                    $content.append($serviceItem);
                });
            } 
            else if ($element.parent().is(":nth-child(3)")) { // По категориям
                $content = $("<div>");
                var categories = organizeByCategory(serviceObjects);
                
                categories.forEach(function(category) {
                    var $categoryGroup = $("<div>").addClass("category-group");
                    $categoryGroup.append($("<h3>").text(category.name));
                    
                    category.services.forEach(function(service) {
                        var $serviceItem = $("<div>").addClass("service-item");
                        $serviceItem.append($("<h4>").text(service.name));
                        $serviceItem.append($("<p>").text("Мастер: " + service.master));
                        $serviceItem.append($("<p>").text("Цена: " + service.price + " руб."));
                        $serviceItem.append($("<p>").text("Дата и время: " + formatDateTime(service.date, service.time)));
                        $categoryGroup.append($serviceItem);
                    });
                    
                    $content.append($categoryGroup);
                });
            } 
            else if ($element.parent().is(":nth-child(4)")) { // По мастерам
                $content = $("<div>");
                var masters = organizeByMaster(serviceObjects);
                
                masters.forEach(function(master) {
                    var $masterGroup = $("<div>").addClass("master-group");
                    $masterGroup.append($("<h3>").text(master.name));
                    
                    master.services.forEach(function(service) {
                        var $serviceItem = $("<div>").addClass("service-item");
                        $serviceItem.append($("<h4>").text(service.name));
                        $serviceItem.append($("<p>").text("Категория: " + service.category));
                        $serviceItem.append($("<p>").text("Цена: " + service.price + " руб."));
                        $serviceItem.append($("<p>").text("Дата и время: " + formatDateTime(service.date, service.time)));
                        $masterGroup.append($serviceItem);
                    });
                    
                    $content.append($masterGroup);
                });
            } 
            else if ($element.parent().is(":nth-child(5)")) { // Добавить
                $content = $("<div>");
                $content.append($("<h2>").text("Добавить новую услугу"));
                
                // Поля формы
                var $categoryGroup = $("<div>").addClass("input-group");
                $categoryGroup.append($("<label>").attr("for", "category").text("Категория:"));
                $categoryGroup.append($("<input>").attr("type", "text").attr("id", "category").attr("name", "category"));
                $content.append($categoryGroup);
                
                var $masterGroup = $("<div>").addClass("input-group");
                $masterGroup.append($("<label>").attr("for", "master").text("Мастер:"));
                $masterGroup.append($("<input>").attr("type", "text").attr("id", "master").attr("name", "master"));
                $content.append($masterGroup);
                
                var $nameGroup = $("<div>").addClass("input-group");
                $nameGroup.append($("<label>").attr("for", "name").text("Название услуги:"));
                $nameGroup.append($("<input>").attr("type", "text").attr("id", "name").attr("name", "name"));
                $content.append($nameGroup);
                
                var $priceGroup = $("<div>").addClass("input-group");
                $priceGroup.append($("<label>").attr("for", "price").text("Цена:"));
                $priceGroup.append($("<input>").attr("type", "number").attr("id", "price").attr("name", "price"));
                $content.append($priceGroup);
                
                var $dateGroup = $("<div>").addClass("input-group");
                $dateGroup.append($("<label>").attr("for", "date").text("Дата:"));
                $dateGroup.append($("<input>").attr("type", "date").attr("id", "date").attr("name", "date"));
                $content.append($dateGroup);
                
                var $timeGroup = $("<div>").addClass("input-group");
                $timeGroup.append($("<label>").attr("for", "time").text("Время:"));
                $timeGroup.append($("<input>").attr("type", "time").attr("id", "time").attr("name", "time"));
                $content.append($timeGroup);
                
                var $button = $("<button>").addClass("add-button").text("Добавить услугу");
                
                $button.on("click", function() {
                    var category = $("#category").val();
                    var master = $("#master").val();
                    var name = $("#name").val();
                    var price = $("#price").val();
                    var date = $("#date").val();
                    var time = $("#time").val();
                    
                    if (category && master && name && price && date && time) {
                        var newService = {
                            category: category,
                            master: master,
                            name: name,
                            price: price,
                            date: date,
                            time: time
                        };
                        
                        serviceObjects.push(newService);
                        
                        // Очищаем поля ввода
                        $("#category").val("");
                        $("#master").val("");
                        $("#name").val("");
                        $("#price").val("");
                        $("#date").val("");
                        $("#time").val("");
                        
                        // Показываем сообщение об успехе
                        alert("Услуга успешно добавлена!");
                    } else {
                        alert("Пожалуйста, заполните все поля!");
                    }
                });
                
                $content.append($button);
            }
            
            $("main .content").append($content);
            return false;
        });
    });
    
    $(".tabs a:first-child span").trigger("click");
};

$(document).ready(function () {
    $.getJSON("services.json", function (serviceObjects) {
        main(serviceObjects);
    });
});