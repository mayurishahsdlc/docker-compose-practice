const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();

const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://mongo:27017";
const DB_NAME = process.env.DB_NAME || "dockerpractice";

const client = new MongoClient(MONGO_URL);

let db;

async function connectDatabase() {
    try {
        await client.connect();

        db = client.db(DB_NAME);

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
}

app.get("/", (req, res) => {
    res.json({
        message: "Docker practice backend is running!"
    });
});

app.get("/health", async (req, res) => {
    try {
        await db.command({ ping: 1 });

        res.status(200).json({
            status: "healthy",
            database: "connected"
        });
    } catch (error) {
        res.status(500).json({
            status: "unhealthy",
            database: "disconnected"
        });
    }
});

app.get("/db-test", async (req, res) => {
    try {
        await db.command({ ping: 1 });

        res.json({
            status: "success",
            message: "Backend successfully connected to MongoDB"
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "MongoDB connection failed"
        });
    }
});

connectDatabase().then(() => {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Backend running on port ${PORT}`);
    });
});
