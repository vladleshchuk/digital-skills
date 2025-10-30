const express = require("express"); 
const path = require('path');
const urlencodedParser = express.urlencoded({ extended: false }); 

let pool;
let zagolovok;

// 1. Фіксовані дані для фільтрів
const DIFFICULTY_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8];
// ✅ НОВА КОНСТАНТА ДЛЯ ТРИВАЛОСТІ
const DURATION_RANGES = [
    { value: '1-7', label: '1-7 днів', min: 1, max: 7 },
    { value: '8-14', label: '8-14 днів', min: 8, max: 14 },
    { value: '15+', label: '15+ днів', min: 15, max: 9999 } // Використовуємо велике число як максимум для '15+'
];


// 1. Функція експорту модуля
module.exports = function(app) {
    pool = global.pool;
    zagolovok = global.zagolovok;
    
    // Функція, що виконує запит до БД і рендерить шаблон. 
    // Приймає вибрані Dimensions, Difficulties та НОВИЙ filterDuration.
    const fetchCoursesAndRender = (res, filterDimensions = [], filterDifficulties = [], filterDuration = null) => {
        // 1. Запит для отримання ВСІХ унікальних Dimensions для фільтрів
        const dimensionsSql = `
            SELECT id_dimensions, dimensions_name 
            FROM dimensions_ds 
            ORDER BY dimensions_name
        `;
        
        pool.query(dimensionsSql, function (err, dimensionsData) {
            if (err) {
                console.error("Помилка при отриманні Dimensions:", err);
                return res.status(500).send("Помилка сервера (Dimensions)");
            }
            
            let coursesSql;
            let queryParams = [];
            let whereClauses = [];
            
            // 2. ФОРМУВАННЯ УМОВ WHERE
            
            // 2.1. Фільтр Dimensions
            if (filterDimensions.length > 0) {
                const placeholders = filterDimensions.map(() => '?').join(', ');
                whereClauses.push(`t1.id_demensions IN (${placeholders})`);
                queryParams.push(...filterDimensions);
            }
            
            // 2.2. Фільтр Складності (Difficulty)
            if (filterDifficulties.length > 0) {
                const placeholders = filterDifficulties.map(() => '?').join(', ');
                whereClauses.push(`t1.courses_difficulty IN (${placeholders})`);
                queryParams.push(...filterDifficulties);
            }

            // ✅ 2.3. Фільтр Тривалості (Duration)
            if (filterDuration && filterDuration !== 'all') {
                const range = DURATION_RANGES.find(r => r.value === filterDuration);

                if (range) {
                    whereClauses.push(`t1.courses_duration BETWEEN ? AND ?`);
                    queryParams.push(range.min);
                    queryParams.push(range.max);
                }
            }


            // 3. ФОРМУВАННЯ ФІНАЛЬНОГО SQL-ЗАПИТУ
            
            // Базовий SELECT/FROM/JOIN
            coursesSql = `
                SELECT
                    t1.id_courses, 
                    t1.courses_title, 
                    t1.courses_description,
                    t1.courses_difficulty,
                    t1.courses_duration,
                    t1.courses_img,
                    t2.dimensions_name AS dimension_name
                FROM 
                    courses t1
                LEFT JOIN 
                    dimensions_ds t2 ON t1.id_demensions = t2.id_dimensions
            `;
            
            // Додаємо WHERE, якщо є хоча б одна умова
            if (whereClauses.length > 0) {
                coursesSql += ` WHERE ` + whereClauses.join(' AND ');
            }
            
            // Додаємо ORDER BY
            coursesSql += ` ORDER BY t1.id_courses`;


            pool.query(coursesSql, queryParams, function (err, coursesData) {
                if (err) {
                    console.error("Помилка при отриманні курсів:", err, "SQL:", coursesSql, "Params:", queryParams);
                    return res.status(500).send("Помилка сервера (Курси)");
                }

                // 4. Рендеримо шаблон
                res.render("courses.hbs", {
                    courses: coursesData, 
                    dimensions: dimensionsData, 
                    
                    // ✅ ПЕРЕДАЄМО: Фіксовані дані та вибрані параметри
                    difficultyLevels: DIFFICULTY_LEVELS,
                    durationRanges: DURATION_RANGES, // НОВА КОНСТАНТА
                    
                    selectedDimensions: filterDimensions.map(id => id.toString()), 
                    selectedDifficulties: filterDifficulties.map(level => level.toString()), 
                    selectedDuration: filterDuration, // НОВИЙ ВИБРАНИЙ ПАРАМЕТР
                    
                    zagolovok: zagolovok
                });
            });
        });
    }

    // A. Маршрут для початкового відображення всіх курсів (GET /courses)
    app.get("/courses", function(req, res) {
        fetchCoursesAndRender(res, [], [], null); // null для Duration
    });
    
    // B. Маршрут для обробки форми фільтрації (POST /courses)
    app.post("/courses", urlencodedParser, function(req, res) {
        
        // 1. Отримуємо Dimensions
        let filterDimensions = req.body.filter_dim || [];
        if (!Array.isArray(filterDimensions)) {
            filterDimensions = [filterDimensions];
        }
        filterDimensions = filterDimensions.map(id => parseInt(id, 10));

        // 2. Отримуємо Складність
        let filterDifficulties = req.body.filter_difficulty || [];
        if (!Array.isArray(filterDifficulties)) {
            filterDifficulties = [filterDifficulties];
        }
        filterDifficulties = filterDifficulties.map(level => parseInt(level, 10)); 

        // ✅ 3. Отримуємо Тривалість
        const filterDuration = req.body.filter_duration || null;


        fetchCoursesAndRender(res, filterDimensions, filterDifficulties, filterDuration);
    });
    
    // Інші маршрути (add, edit, delete) будуть додані тут пізніше
};
