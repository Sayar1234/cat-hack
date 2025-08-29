// server.js

const express = require("express");
const app = express();
// No socket.io needed
const cors = require("cors");
app.use(cors());
app.use(express.json()); // parse JSON body
require("dotenv").config();
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

app.use(cors());
app.use(express.json()); // parse JSON body

const FILE_PATH = path.join(__dirname, "data", "CAT_Telematics_Dataset.xlsx");

// Helper to read Excel
function readExcel() {
  const workbook = XLSX.readFile(FILE_PATH);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet);
}

// Endpoint to get data
app.get("/api/data", (req, res) => {
  res.json(readExcel());
});

// Endpoint to check-in/check-out a machine
app.post("/api/checkin", (req, res) => {
  const { equipmentId, action, user } = req.body; // e.g. action = "checkin" or "checkout"
  const workbook = XLSX.readFile(FILE_PATH);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(sheet);
  const now = new Date().toISOString();
  // Update the row for this equipment
  const row = jsonData.find((r) => r["Equipment ID"] === equipmentId);
  if (row) {
    if (action === "checkin") row["Check-In date"] = now;
    if (action === "checkout") row["Check-Out date"] = now;
    row["Last User"] = user;
  }
  // Write back to sheet
  const newSheet = XLSX.utils.json_to_sheet(jsonData);
  workbook.Sheets[workbook.SheetNames[0]] = newSheet;
  XLSX.writeFile(workbook, FILE_PATH);
  res.json({ success: true, updatedRow: row });
});

app.listen(5000, () => console.log("Server running on port 5000"));
