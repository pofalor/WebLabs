const express = require("express");
const http = require("http");
const app = express();

// Массив для хранения услуг в памяти
let services = [
    {
        "category": "Стрижка",
        "master": "Иванова Анна Петровна",
        "name": "Женская стрижка",
        "price": 1500,
        "date": "2023-05-15",
        "time": "10:00"
    },
    {
        "category": "Окрашивание",
        "master": "Петрова Елена Сергеевна",
        "name": "Окрашивание в один тон",
        "price": 2500,
        "date": "2023-05-15",
        "time": "11:30"
    }
];

app.use(express.static(__dirname + "/client"));
app.use(express.json());

// GET запрос для получения всех услуг
app.get("/api/services", (req, res) => {
    res.json(services);
});

// POST запрос для добавления новой услуги
app.post("/api/services", (req, res) => {
    console.log("Получены данные новой услуги:", req.body);
    
    const newService = req.body;
    services.push(newService);
    
    res.json({
        "message": "Услуга успешно добавлена!",
        "service": newService
    });
});

// GET запрос для получения услуг по категории
app.get("/api/services/category/:category", (req, res) => {
    const category = req.params.category;
    const filteredServices = services.filter(service => 
        service.category.toLowerCase() === category.toLowerCase()
    );
    
    res.json(filteredServices);
});

// GET запрос для получения услуг по мастеру
app.get("/api/services/master/:master", (req, res) => {
    const master = req.params.master;
    const filteredServices = services.filter(service => 
        service.master.toLowerCase().includes(master.toLowerCase())
    );
    
    res.json(filteredServices);
});

// Запуск сервера
http.createServer(app).listen(3000, () => {
    console.log("Сервер запущен на http://localhost:3000");
});