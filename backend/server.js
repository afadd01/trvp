const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite3');
const bcrypt = require('bcrypt');
const expressOasGenerator = require('express-oas-generator');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const JWT_SECRET = 'asdqwe'

    // Получаем хешированный пароль из базы данных
    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, row) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (!row) {
                res.status(401).json({ message: 'Invalid credentials' });
            } else {
                const hashedPassword = row.password;

                // Сравниваем хеш предоставленного пароля с хешем из базы данных
                const passwordMatch = await bcrypt.compare(password, hashedPassword);

                if (passwordMatch) {
                    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' }); // Подпись токена с использованием секретного ключа

                    res.json({ message: 'Login successful', token });
                } else {
                    res.status(401).json({ message: 'Invalid credentials' });
                }
            }
        }
    });
});

app.post('/register', async (req, res) => {
    const { username, password, firstName, lastName } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10); // Хеширование пароля

    db.run(`INSERT INTO users (username, password, first_name, last_name) 
            VALUES (?, ?, ?, ?)`, [username, hashedPassword, firstName, lastName], function (err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ message: 'User registered successfully', id: this.lastID });
        }
    });
});

app.get('/products', async (req, res) => {
    db.all(`SELECT * FROM goods`, function (err, rows) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ products: rows });
        }
    });
});

app.get('/products/:id', async (req, res) => {
    const productId = req.params.id; // Получаем id из параметров запроса

    db.get(`SELECT * FROM goods WHERE id=?`, productId, function (err, row) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ product: row }); // Отправляем найденный продукт
        }
    });
});

app.delete('/products/:id', async (req, res) => {
    const productId = req.params.id; // Получаем id из параметров запроса

    db.run(`DELETE FROM goods WHERE id=?`, productId, function (err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ message: 'Product deleted successfully' });
        }
    });
});

app.post('/products/new', async (req, res) => {
    const { name, price, description, balance_count } = req.body;

    db.run(`INSERT INTO goods (name, price, description, balance_count) 
            VALUES (?, ?, ?, ?)`, [name, price, description, balance_count], function (err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ message: 'Product added successfully', id: this.lastID });
        }
    });
});


// Заказы
app.get('/orders', async (req, res) => {
    db.run(`PRAGMA foreign_keys = ON`); // Включаем поддержку внешних ключей

    // Удаление заказов с истекшей датой
    db.run(`DELETE FROM orders WHERE order_date < date('now')`, function (err) {
        if (err) {
            res.status(500).send(err);
        } else {
            db.all(`SELECT * FROM orders`, function (err, rows) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json({ orders: rows });
                }
            });
        }
    });
});

app.get('/orders/:id', async (req, res) => {
    const orderId = req.params.id; // Получаем id из параметров запроса

    db.get(`SELECT * FROM orders WHERE id=?`, orderId, function (err, row) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ order: row }); // Отправляем найденный продукт
        }
    });
});

app.put('/orders/:id', async (req, res) => {
    const { orderId, vendorName, orderDate } = req.body; // Получаем id из параметров запроса

    db.run(`UPDATE orders SET vendor_name = ?, order_date = ? WHERE id=?`, [vendorName, orderDate, orderId], function (err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ message: 'Order updated successfully', id: this.lastID });
        }
    });
});

app.delete('/orders/:id', async (req, res) => {
    const orderId = req.params.id; // Получаем id из параметров запроса

    db.run(`DELETE FROM orders WHERE id=?`, orderId, function (err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ message: 'Order deleted successfully' });
        }
    });
});

app.post('/orders/new', async (req, res) => {
    const { vendorName, orderDate } = req.body;

    const currentDate = new Date();

    // Проверка даты
    if (new Date(orderDate) < currentDate) {
        return res.status(200).json({ message: 'Order date is not valid' });
    }

    db.run(`INSERT INTO orders (vendor_name, order_date) 
            VALUES (?, ?)`, [vendorName, orderDate], function (err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ message: 'Order added successfully', id: this.lastID });
        }
    });
});

app.post('/orders/reload', async (req, res) => {
    const { orderDateCurrent } = req.body;
    const currentDate = new Date();

    if (new Date(orderDateCurrent) > currentDate) {
        db.run(`DELETE FROM orders WHERE order_date < ?`, [orderDateCurrent], function (err) {
            if (err) {
                res.status(500).send(err);
            } else {
                db.run(`UPDATE goods SET balance_count = balance_count + ABS(RANDOM() % 10)`, [], function (err) {
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        res.json({ message: 'Orders reloaded successfully' });
                    }
                });
            }
        });
    } else {
        res.json({ message: 'Date is not valid' });
    }
});


// Позиции
app.get('/positions', async (req, res) => {
    db.all(`SELECT p.*, g.name, o.vendor_name FROM positions p
    JOIN goods g ON
    g.id = p.good_id
    JOIN orders o ON
    o.id = p.order_id`, function (err, rows) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ positions: rows });
        }
    });
});

app.get('/positions/:id', async (req, res) => {
    const positionId = req.params.id; // Получаем id из параметров запроса

    db.get(`SELECT p.*, g.name, o.vendor_name FROM positions p
    JOIN goods g ON
    g.id = p.good_id
    JOIN orders o ON
    o.id = p.order_id
    WHERE p.id=?`, positionId, function (err, row) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ position: row }); // Отправляем найденный продукт
        }
    });
});

app.delete('/positions/:id', async (req, res) => {
    const positionId = req.params.id; // Получаем id из параметров запроса

    db.run(`DELETE FROM positions WHERE id=?`, positionId, function (err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ message: 'Position deleted successfully' });
        }
    });
});

app.post('/positions/new', async (req, res) => {
    const { orderId, goodId, goodCount } = req.body;

    // Вычитание из balance_count товара goodCount
    db.run(`UPDATE goods SET balance_count = balance_count - ? WHERE id = ?`, [goodCount, goodId], function (err) {
        if (err) {
            res.status(500).send(err);
        } else {
            // Добавление позиции после успешного вычета количества товара
            db.run(`INSERT INTO positions (order_id, good_id, good_count) VALUES (?, ?, ?)`, [orderId, goodId, goodCount], function (err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json({ message: 'Position added successfully', id: this.lastID });
                }
            });
        }
    });
});

app.post('/positions/check_available_good_count', async (req, res) => {
    const { goodId, goodCount } = req.body;

    db.get(`SELECT balance_count FROM goods WHERE id = ?`, [goodId], function (err, row) {
        if (err) {
            res.status(500).send(err);
        } else {
            const availableCount = row.balance_count >= goodCount;
            res.json({ available: availableCount });
        }
    });
});

expressOasGenerator.init(app, {});
app.listen(3001, () => {
    console.log('Server running on port 3001');
});
