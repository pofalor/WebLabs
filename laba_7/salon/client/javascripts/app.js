var main = function (initialServices) {
    "use strict";

    let services = initialServices || [];

    // Функция для форматирования даты и времени
    const formatDateTime = (date, time) => date + " в " + time;

    // Функция для организации услуг по категориям
    const organizeByCategory = (services) => {
        const categories = [];

        services.forEach(service => {
            let found = false;

            categories.forEach(category => {
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
    const organizeByMaster = (services) => {
        const masters = [];

        services.forEach(service => {
            let found = false;

            masters.forEach(master => {
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

    // Загрузка услуг с сервера
    const loadServices = () => {
        $.get("/api/services", function (data) {
            services = data;
            updateViews();
        });
    };

    // Обновление всех представлений
    const updateViews = () => {
        // Обновляем вкладку "Новые"
        updateNewView();

        // Обновляем вкладку "Старые"
        updateOldView();

        // Обновляем вкладку "По категориям"
        updateCategoriesView();

        // Обновляем вкладку "По мастерам"
        updateMastersView();
    };

    // Обновление вкладки "Новые"
    const updateNewView = () => {
        const $content = $("<div>");
        for (let i = services.length - 1; i >= 0; i--) {
            const service = services[i];
            const $serviceItem = createServiceItem(service);
            $content.append($serviceItem);
        }
        $("main .content").html($content);
    };

    // Обновление вкладки "Старые"
    const updateOldView = () => {
        const $content = $("<div>");
        services.forEach(service => {
            const $serviceItem = createServiceItem(service);
            $content.append($serviceItem);
        });
        $("main .content").html($content);
    };

    // Обновление вкладки "По категориям"
    const updateCategoriesView = () => {
        const $content = $("<div>");
        const categories = organizeByCategory(services);

        categories.forEach(category => {
            const $categoryGroup = $("<div>").addClass("category-group");
            $categoryGroup.append($("<h3>").text(category.name));

            category.services.forEach(service => {
                const $serviceItem = createServiceItem(service, true);
                $categoryGroup.append($serviceItem);
            });

            $content.append($categoryGroup);
        });

        $("main .content").html($content);
    };

    // Обновление вкладки "По мастерам"
    const updateMastersView = () => {
        const $content = $("<div>");
        const masters = organizeByMaster(services);

        masters.forEach(master => {
            const $masterGroup = $("<div>").addClass("master-group");
            $masterGroup.append($("<h3>").text(master.name));

            master.services.forEach(service => {
                const $serviceItem = createServiceItem(service, true);
                $masterGroup.append($serviceItem);
            });

            $content.append($masterGroup);
        });

        $("main .content").html($content);
    };

    // Создание элемента услуги
    const createServiceItem = (service, isCompact = false) => {
        const $serviceItem = $("<div>").addClass("service-item");

        if (isCompact) {
            $serviceItem.append($("<h4>").text(service.name));
            $serviceItem.append($("<p>").text("Цена: " + service.price + " руб."));
            $serviceItem.append($("<p>").text("Дата: " + formatDateTime(service.date, service.time)));
        } else {
            $serviceItem.append($("<h3>").text(service.name));
            $serviceItem.append($("<p>").text("Категория: " + service.category));
            $serviceItem.append($("<p>").text("Мастер: " + service.master));
            $serviceItem.append($("<p>").text("Цена: " + service.price + " руб."));
            $serviceItem.append($("<p>").text("Дата и время: " + formatDateTime(service.date, service.time)));
        }

        return $serviceItem;
    };

    // Обработчик добавления новой услуги
    const addService = () => {
        const category = $("#category").val();
        const master = $("#master").val();
        const name = $("#name").val();
        const price = $("#price").val();
        const date = $("#date").val();
        const time = $("#time").val();

        if (category && master && name && price && date && time) {
            debugger
            const newService = {
                category: category,
                master: master,
                name: name,
                price: price,
                date: date,
                time: time
            };

            $.ajax({
                url: "/api/services",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(newService),
                success: function (response) {
                    console.log("Ответ сервера:", response);
                    loadServices();
                    // Очищаем поля ввода
                    $("#category").val("");
                    $("#master").val("");
                    $("#name").val("");
                    $("#price").val("");
                    $("#date").val("");
                    $("#time").val("");

                    // Показываем уведомление
                    alert("Услуга успешно добавлена!");
                },
                error: function (xhr, status, error) {
                    console.error("Ошибка:", error);
                }
            });
        } else {
            alert("Пожалуйста, заполните все поля!");
        }
    };

    // Инициализация вкладок
    $(".tabs a span").toArray().forEach(function (element) {
        $(element).on("click", function () {
            const $element = $(element);

            $(".tabs a span").removeClass("active");
            $element.addClass("active");
            $("main .content").empty();

            if ($element.parent().is(":nth-child(1)")) { // Новые
                updateNewView();
            }
            else if ($element.parent().is(":nth-child(2)")) { // Старые
                updateOldView();
            }
            else if ($element.parent().is(":nth-child(3)")) { // По категориям
                updateCategoriesView();
            }
            else if ($element.parent().is(":nth-child(4)")) { // По мастерам
                updateMastersView();
            }
            else if ($element.parent().is(":nth-child(5)")) { // Добавить
                const $content = $("<div>");
                $content.append($("<h2>").text("Добавить новую услугу"));

                // Поля формы
                const $categoryGroup = $("<div>").addClass("input-group");
                $categoryGroup.append($("<label>").attr("for", "category").text("Категория:"));
                $categoryGroup.append($("<input>").attr("type", "text").attr("id", "category").attr("name", "category"));
                $content.append($categoryGroup);

                const $masterGroup = $("<div>").addClass("input-group");
                $masterGroup.append($("<label>").attr("for", "master").text("Мастер:"));
                $masterGroup.append($("<input>").attr("type", "text").attr("id", "master").attr("name", "master"));
                $content.append($masterGroup);

                const $nameGroup = $("<div>").addClass("input-group");
                $nameGroup.append($("<label>").attr("for", "name").text("Название услуги:"));
                $nameGroup.append($("<input>").attr("type", "text").attr("id", "name").attr("name", "name"));
                $content.append($nameGroup);

                const $priceGroup = $("<div>").addClass("input-group");
                $priceGroup.append($("<label>").attr("for", "price").text("Цена:"));
                $priceGroup.append($("<input>").attr("type", "number").attr("id", "price").attr("name", "price"));
                $content.append($priceGroup);

                const $dateGroup = $("<div>").addClass("input-group");
                $dateGroup.append($("<label>").attr("for", "date").text("Дата:"));
                $dateGroup.append($("<input>").attr("type", "date").attr("id", "date").attr("name", "date"));
                $content.append($dateGroup);

                const $timeGroup = $("<div>").addClass("input-group");
                $timeGroup.append($("<label>").attr("for", "time").text("Время:"));
                $timeGroup.append($("<input>").attr("type", "time").attr("id", "time").attr("name", "time"));
                $content.append($timeGroup);

                const $button = $("<button>").addClass("add-button").text("Добавить услугу");
                $button.on("click", addService);

                $content.append($button);
                $("main .content").append($content);
            }

            return false;
        });
    });

    $(".tabs a:first-child span").trigger("click");
};

// Загрузка начальных данных
$(document).ready(function () {
    // Проверяем, есть ли данные на сервере
    $.get("/api/services", function (data) {
        main(data);
    }).fail(function () {
        // Если сервер не отвечает, используем локальные данные
        console.log("Сервер не отвечает, используем локальные данные");
        main();
    });
});