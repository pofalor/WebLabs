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
        $.get("/api/services", function(data) {
            services = data;
            updateViews();
        }).fail(function() {
            console.error("Ошибка при загрузке услуг");
        });
    };

    // Обновление всех представлений
    const updateViews = () => {
        const activeTab = getActiveTabIndex();
        updateCurrentTab(activeTab);
    };

    // Получение индекса активной вкладки
    const getActiveTabIndex = () => {
        return $(".tabs a span.active").parent().index() + 1;
    };

    // Обновление текущей активной вкладки
    const updateCurrentTab = (tabIndex) => {
        $("main .content").empty();
        switch(tabIndex) {
            case 1: updateNewView(); break;
            case 2: updateOldView(); break;
            case 3: updateCategoriesView(); break;
            case 4: updateMastersView(); break;
            case 5: renderAddForm(); break;
        }
    };

    // Обновление вкладки "Новые"
    const updateNewView = () => {
        const $content = $("<div>");
        for (let i = services.length - 1; i >= 0; i--) {
            const service = services[i];
            const $serviceItem = createServiceItem(service);
            $content.append($serviceItem);
        }
        $("main .content").append($content);
    };

    // Обновление вкладки "Старые"
    const updateOldView = () => {
        const $content = $("<div>");
        services.forEach(service => {
            const $serviceItem = createServiceItem(service);
            $content.append($serviceItem);
        });
        $("main .content").append($content);
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
        
        $("main .content").append($content);
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
        
        $("main .content").append($content);
    };

    // Рендер формы добавления
    const renderAddForm = () => {
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
        $button.on("click", function() {
            addService();
        });
        
        $content.append($button);
        $("main .content").append($content);
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
            
            // Добавляем кнопки управления
            const $editBtn = $("<button>").text("Редактировать").addClass("edit-btn");
            $editBtn.click(() => {
                window.location.href = `/edit/${service.id}`;
            });
            
            const $deleteBtn = $("<button>").text("Удалить").addClass("delete-btn");
            $deleteBtn.click(() => {
                deleteService(service.id);
            });
            
            $serviceItem.append($("<div>").addClass("action-buttons").append($editBtn).append($deleteBtn));
        }
        
        return $serviceItem;
    };

    // Добавление новой услуги
    const addService = () => {
        const category = $("#category").val();
        const master = $("#master").val();
        const name = $("#name").val();
        const price = $("#price").val();
        const date = $("#date").val();
        const time = $("#time").val();
        
        if (category && master && name && price && date && time) {
            const newService = {
                category: category,
                master: master,
                name: name,
                price: price,
                date: date,
                time: time
            };
            
            $.post("/api/services", newService, function(response) {
                console.log("Услуга добавлена:", response);
                // Очищаем поля
                $("#category, #master, #name, #price, #date, #time").val("");
                // Обновляем данные
                loadServices();
                alert("Услуга успешно добавлена!");
            }).fail(function(err) {
                console.error("Ошибка при добавлении:", err);
                alert("Ошибка при добавлении услуги");
            });
        } else {
            alert("Пожалуйста, заполните все поля!");
        }
    };

    // Удаление услуги
    const deleteService = (id) => {
        if (confirm("Вы уверены, что хотите удалить эту услугу?")) {
            $.ajax({
                url: `/api/services/${id}`,
                method: "DELETE",
                success: () => {
                    // Обновляем текущую вкладку
                    updateCurrentTab(getActiveTabIndex());
                },
                error: (err) => {
                    console.error("Ошибка при удалении:", err);
                    alert("Ошибка при удалении услуги");
                }
            });
        }
    };

    // Инициализация вкладок
    $(".tabs a span").toArray().forEach(function (element) {
        $(element).on("click", function () {
            const $element = $(element);
            $(".tabs a span").removeClass("active");
            $element.addClass("active");
            updateCurrentTab($element.parent().index() + 1);
            return false;
        });
    });
    
    // Загружаем услуги при старте
    loadServices();
    $(".tabs a:first-child span").trigger("click");
};

// Загрузка начальных данных
$(document).ready(function() {
    // Загружаем данные с сервера
    $.get("/api/services", function(data) {
        main(data);
    }).fail(function() {
        console.error("Не удалось загрузить данные с сервера");
        main([]); // Запускаем с пустым массивом, если сервер не отвечает
    });
});