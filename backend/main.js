const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database('database.sqlite3'); // Подставьте имя вашей базы данных

// Создание таблицы, если её еще нет
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, first_name TEXT, last_name TEXT)");
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        vendor_name TEXT,
        order_date date
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS goods (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT,
        price FLOAT,
        description TEXT,
        balance_count INT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS positions (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        order_id INT,
        good_id INT,
        good_count INT,
        FOREIGN KEY (good_id) REFERENCES goods(id) ON DELETE CASCADE,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    )`);
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});
