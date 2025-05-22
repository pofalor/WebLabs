require('dotenv').config();
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const pug = require('pug');
const methodOverride = require('method-override');

const app = express();

// Добавьте после инициализации express app
app.use(methodOverride('_method'));

// Настройка Sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME || 'salon_db',
    process.env.DB_USER || 'daniil',
    process.env.DB_PASSWORD || 'admin',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false
    }
);

// Определение модели Service
const Service = sequelize.define('Service', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    master: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    time: {
        type: DataTypes.TIME,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'services'
});

// Настройка Express
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Маршруты API
app.get('/api/services', async (req, res) => {
    try {
        const services = await Service.findAll();
        res.json(services);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/services', async (req, res) => {
    try {
        const { category, master, name, price, date, time } = req.body;
        const newService = await Service.create({
            category,
            master,
            name,
            price,
            date,
            time
        });
        res.status(201).json(newService);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/editServices', async (req, res) => {
    try {
        const { id, category, master, name, price, date, time } = req.body;

        const service = await Service.findByPk(id);
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        await service.update({ category, master, name, price, date, time });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/services/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.findByPk(id);

        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        await service.destroy();
        res.status(204).end(); // 204 No Content
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Маршрут для редактирования (использует Pug)
app.get('/edit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.findByPk(id);

        if (!service) {
            return res.status(404).send('Service not found');
        }

        res.render('edit', {
            service: service.get({ plain: true })
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Инициализация сервера
async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Connection to DB has been established successfully.');

        await sequelize.sync({ force: false });
        console.log('Database synchronized');

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Unable to connect to the database:', err);
        process.exit(1);
    }
}

startServer();