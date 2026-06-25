const express = require("express");
const cors = require("cors");

const app = express();

const transactionRoutes = require("./routes/transactionRoutes");

const uploadRoutes = require("./routes/uploadRoutes");

const ocrRoutes = require("./routes/ocrRoutes");

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/transactions", transactionRoutes);

app.use("/api/uploads", uploadRoutes);

app.use("/api/ocr", ocrRoutes);

module.exports = app;
