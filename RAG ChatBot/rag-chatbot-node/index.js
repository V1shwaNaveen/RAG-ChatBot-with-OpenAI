const express = require("express");
const openAI = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
