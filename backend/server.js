const express = require("express");

const app = express();

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
    res.json({
        message: "Docker practice backend is running!"
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "healthy"
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend running on port ${PORT}`);
});
