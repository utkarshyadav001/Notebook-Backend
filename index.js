const express = require("express");
const cors = require("cors")
const ConnectToMongo = require("./db");
ConnectToMongo();


const app = express()
const port = 5000;

app.use(cors());
app.use(express.json())


app.get('/', (req, res) =>{
    res.send("Hello Utkarsh");
});

//  Available Routes //
app.use('/api/auth', require("./routes/auth"));
app.use('/api/notes', require("./routes/notes"));



app.listen(port, ()=>{
    console.log(`Example app listening at http://localhost:${port}`);
});