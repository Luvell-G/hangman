// api/api.js
import express from "express";
import cors from "cors";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

const app = express();
const PORT = 3001;

const TABLE_NAME = "players"; // <-- make sure this matches your actual table name

// ---------------------------
// Middleware
// ---------------------------
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// ---------------------------
// DynamoDB Setup
// ---------------------------

// If you are using local DynamoDB:
const endpoint = process.env.DYNAMO_ENDPOINT || "http://localhost:8000";

// Create DynamoDB client
const dbClient = new DynamoDBClient({
  region: "us-east-1",
  endpoint: endpoint, // Local DynamoDB (Docker or local install)
  credentials: {
    accessKeyId: "fakeAccessKey", // Local mode accepts any string
    secretAccessKey: "fakeSecretKey",
  },
});

// Use DocumentClient for easier JSON handling
const docClient = DynamoDBDocumentClient.from(dbClient);

// ==============================
//           GET PLAYER
// ==============================
app.get("/api/player", async (req, res) => {
  const { playerName } = req.query;

  if (!playerName) {
    return res.status(400).json({ error: "playerName required" });
  }

  try {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { playerName },
    });

    const result = await docClient.send(command);

    if (!result.Item) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.json(result.Item);
  } catch (err) {
    console.error("GET error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ==============================
//           CREATE PLAYER
// ==============================
app.post("/api/player", async (req, res) => {
  const { playerName, wins, losses } = req.body;

  if (!playerName)
    return res.status(400).json({ error: "playerName required" });

  try {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        playerName,
        wins: wins || 0,
        losses: losses || 0,
      },
    });

    await docClient.send(command);

    res.status(201).json({
      message: "Player created",
      playerName,
      wins,
      losses,
    });
  } catch (err) {
    console.error("POST error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ==============================
//           UPDATE PLAYER
// ==============================
app.put("/api/player", async (req, res) => {
  const { playerName, wins, losses } = req.body;

  if (!playerName)
    return res.status(400).json({ error: "playerName required" });

  try {
    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { playerName },
      UpdateExpression: "SET wins = :w, losses = :l",
      ExpressionAttributeValues: {
        ":w": wins,
        ":l": losses,
      },
      ReturnValues: "ALL_NEW",
    });

    const result = await docClient.send(command);

    res.json(result.Attributes);
  } catch (err) {
    console.error("PUT error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ==============================
// Start Server
// ==============================
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
 