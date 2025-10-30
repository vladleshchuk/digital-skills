const mysql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");
const hbs = require("hbs");
const expressHbs = require("express-handlebars");
const path = require("path");
const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(express.static('img'))
const zagolovok = "Digital Skills"


const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    database: "digitalskills",
    password: ""
});

// ⬇️ Додайте наступні рядки для глобального доступу:
global.zagolovok = zagolovok;
global.pool = pool;

app.engine("hbs", expressHbs.engine({ // 👈 ВИКОРИСТОВУЙТЕ .engine
    layoutsDir: "views",
    defaultLayout: "index",
    extname: "hbs",
    partialsDir: "views",

    helpers: {
        contains: function (arr, item, options) {
            // Універсальний Helper для вбудованого та блокового використання
            const arrToUse = Array.isArray(arr) ? arr : [arr];
            const itemString = item && item.toString();

            const result = arrToUse.some(el => el.toString() === itemString);
            
            // Якщо використовується як блоковий Helper (наприклад, {{#if (contains ...)}})
            if (options.fn && options.inverse) { 
                return result ? options.fn(this) : options.inverse(this);
            }
            // Якщо використовується як простий Helper (наприклад, {{contains ...}})
            return result;
        },
        
        // ✅ УНІВЕРСАЛЬНИЙ HELPER ДЛЯ ПОРІВНЯННЯ РІВНОСТІ (eq)
        eq: function (a, b, options) {
            // Визначаємо, чи Helper викликаний як блоковий (має options.fn)
            if (options.fn) {
                if (a == b) {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            }
            // Якщо викликаний як вбудований (inline)
            return a == b; 
        },
        
        // УНІВЕРСАЛЬНИЙ HELPER ДЛЯ ПОРІВНЯННЯ (lt)
        lt: function (a, b, options) {
            if (options.fn) {
                if (a < b) {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            }
            return a < b;
        },
        
        // УНІВЕРСАЛЬНИЙ HELPER ДЛЯ ПОРІВНЯННЯ (gte)
        gte: function (a, b, options) {
            if (options.fn) {
                if (a >= b) {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            }
            return a >= b;
        }
    }
}));
app.set("view engine", "hbs");

const coursesRouter = require('./courses'); // Підключаємо наш новий модуль
coursesRouter(app); // Викликаємо його, передаючи app

app.get("/", function(req, res) {
    res.render("start.hbs", { // start.hbs імпортується в index.hbs в параметр {{{body}}} [cite: 931]
        zagolovok: zagolovok
    });
});

const PORT = process.env.PORT || 3000; // якщо порт є то його, інакше ставимо 3000
app.listen(PORT, function(){
    console.log("Server");
});
