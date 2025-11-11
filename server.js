const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// "База данных" в памяти
let movies = [];
let nextId = 1;

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