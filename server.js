const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// "База данных" в памяти
let movies = [
  { id: 1, title: "Matrix", year: 1999, rating: 8.7 },
  { id: 2, title: "Inception", year: 2010, rating: 8.8 },
  { id: 3, title: "Interstellar", year: 2014, rating: 8.6 }
];
let nextId = 4;

const path = require("path");

// Раздача статических файлов из корня проекта
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  res.send("Movies API is running ✅");
});

app.get("/movies_api.yaml", (req, res) => {
  res.setHeader("Content-Type", "application/yaml; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store"); // 🚫 Отключаем кэширование
  res.sendFile(path.join(__dirname, "movies_api.yaml"));
});

// CREATE — добавление фильма
app.post("/movies", (req, res) => {
    const { title, year, rating } = req.body;

    const movie = {
        id: nextId++,
        title,
        year,
        rating
    };

    movies.push(movie);
    res.status(201).json(movie);
});

// READ — получение всех фильмов
app.get("/movies", (req, res) => {
    res.json(movies);
});

// READ — получение одного фильма
app.get("/movies/:id", (req, res) => {
    const movie = movies.find(m => m.id == req.params.id);

    if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
    }

    res.json(movie);
});

// UPDATE — обновление фильма
app.put("/movies/:id", (req, res) => {
    const movie = movies.find(m => m.id == req.params.id);

    if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
    }

    const { title, year, rating } = req.body;

    movie.title = title ?? movie.title;
    movie.year = year ?? movie.year;
    movie.rating = rating ?? movie.rating;

    res.json(movie);
});

// DELETE — удаление
app.delete("/movies/:id", (req, res) => {
    movies = movies.filter(m => m.id != req.params.id);
    res.json({ message: "Movie deleted" });
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("✅ Server running on port " + PORT));