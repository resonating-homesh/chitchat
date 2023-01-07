// import { chats } from "./data/data";
const dotenv = require("dotenv")
const express = require("express");
const connectDB = require("./config/db");
const { chats } = require("./data/data");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");

dotenv.config();
connectDB();
const app = express();
const {notFound, errorHandler} = require('../backend/middleware/errorMiddleware');

app.use(express.json()); //this tell react app to use json data

app.get('/', (req, res)=>{
    res.send("API is running");
});

// app.get('/api/chat', (req, res) =>
// {
//     res.send(chats);
// });

app.get('/api/chat/:id',(req, res) =>
{
    console.log(req.params.id);
    const singleChat = chats.find( (c) => c._id === req.params.id);
    res.send(singleChat);
});

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log("hello there!"))