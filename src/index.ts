import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import BotController from './bot/controller';
const app = express();
app.listen(3000);

require('dotenv').config();

app.get("/", (req, res)=> {
    res.send("Hola mundo");
})


BotController.init();