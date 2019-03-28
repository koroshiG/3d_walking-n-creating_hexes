var http = require("http");
var fs = require("fs");
var qs = require("querystring");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var path = require("path");

const PORT = 3000;

app.use(express.static('static'));

var map = [];

app.post("/", function (req, res) {
    var allData = "";

    // w poniższej funkcji nic nie modyfikujemy
    req.on("data", function (data) {
        allData += data;
    })

    //odsyłane
    req.on("end", function (data) {
        var fromAjax = qs.parse(allData);
        
        if(fromAjax.load && map != []){
            res.end(JSON.stringify(map, null, 4));
        } else {
        map = fromAjax;
        res.writeHead(200, {
            "content-type": "text/plain:charset=utf-8"
        })
        res.end(JSON.stringify(map, null, 4))
        }
    })
})

app.post("/game", function (req, res) {
    console.log("vydia");
    res.sendFile(path.join(__dirname + "/static/pages/game.html"));
})

app.post("/test", function (req, res) {
    console.log("tstvydia");
    res.sendFile(path.join(__dirname + "/static/pages/test.html"));
})

app.listen(PORT, "127.0.0.1", function () {
    console.log(PORT);

});