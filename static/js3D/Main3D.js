var net
var ui
var model

$(document).ready(function () {
    net = new Net()
    ui = new Ui()
    model = new Model()
    model.loadModel("../models/sailormoon/json/tris.js", function (modeldata) {
        console.log("model został załadowany", modeldata)
        //scene.add(modeldata) // data to obiekt kontenera zwrócony z Model.js
     })
     
})