const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const {response} = require("express");
const app = express();

app.use(express.static(path.join(__dirname, '/')));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

var got_rect_arr = [];


app.post('/sendData', (req, res) => {
    got_rect_arr = req.body.rect_arr;
    mongo_push();
});

app.post('/getData', (req, res) => {
    // Что-то
    console.log("Пришел запрос getData");
    mongo_get();
});

const port_id = process.env.PORT || 8080;
app.listen(port_id, () => {
    console.log(`Server has been started on port: ${port_id}.`);
});


const MongoClient = require('mongodb').MongoClient;

const mongoClient = new MongoClient("mongodb://127.0.0.1:27017/");

function mongo_push() {
    mongoClient.connect(function(err, client){
        if(err){
            return console.log(err);
        }
        if (got_rect_arr.length === 0) {
            return console.log("got_rect_arr is empty");
        }
        const db = client.db("pvc_db");
        const collection = db.collection("rectangle");
        for (let i = 0; i < got_rect_arr.length; i++) {
            collection.insertOne({
                temp: got_rect_arr[i].temp, time: got_rect_arr[i].time,
                L: got_rect_arr[i].LAB_L, a: got_rect_arr[i].LAB_a, b: got_rect_arr[i].LAB_b, Y: got_rect_arr[i].YI
            });
            console.log(`New insert into db: temp: ${got_rect_arr[i].temp}, time: ${got_rect_arr[i].time}, L: ${got_rect_arr[i].LAB_L}, a: ${got_rect_arr[i].LAB_a}, b: ${got_rect_arr[i].LAB_b}, Y: ${got_rect_arr[i].YI}`);
        }
        //client.close();
    });
}

var db_data = [];

//FIXME: Наладить отправку данных клиенту с базы
function mongo_get() {
    mongoClient.connect(function(err, client){
        if(err){
            return console.log(err);
        }
        const db = client.db("pvc_db");
        const collection = db.collection("rectangle");
        let arr;
        collection.find({}).toArray(function(err, result) {
            if (err) throw err;
            db_data = result;
            console.log(db_data);
        });
    });
}
