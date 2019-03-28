console.log("wczytano plik Generator.js")

class Generator {
    constructor() {
        this.hexes = [];
        this.typeChange = 'wall';
        this.loaded = [];
        this.init();
        this.click();
    }

    init() {
        for (var i = 1; i < 13; i++) {
            var option = document.createElement("option");
            option.value = i;
            option.text = i;
            $("#hexAmount").append(option);
        }
        $("#hexAmount").on("change", () => {
            this.hexes = [];
            var idCount = 0;
            $("#map").empty();
            for (var i = 0; i < $("#hexAmount").val(); i++) {
                var rowMove = false;
                $("#map").append(br);
                for (var j = 0; j < $("#hexAmount").val(); j++) {
                    var hex = new Hex(rowMove, idCount, i, j, 0, "wall");
                    //$("#map").append(hex.container);
                    this.hexes.push(hex);
                    rowMove = !rowMove;
                    idCount++;
                }
                var br = document.createElement("br");
            }
        })
        var button = document.createElement("button");
        button.id = "sendMap";
    }

    click() {
        $("#sendTo").click(() => {
            var mapSend = [];
            for (var i = 0; i < this.hexes.length; i++) {
                if (this.hexes[i].used) {
                    mapSend.push(this.hexes[i].position());
                }
            }
            var toSend = {};
            toSend.hexAmount = $("#hexAmount").val();
            toSend.map = mapSend;
            net.sendData(toSend);
        })

        $("#light").click(() => {
            this.typeChange = "light";
        })

        $("#enemy").click(() => {
            this.typeChange = "enemy";
        })

        $("#treasure").click(() => {
            this.typeChange = "treasure";
        })

        $("#wall").click(() => {
            this.typeChange = "wall";
        })

        $("#load").click(() => {
            $("#hexAmount").val(this.loaded.hexAmount);
            this.hexes = [];
            var idCount = 0;
            var loadedHex = false;
            $("#map").empty();
            for (var i = 0; i < parseInt(this.loaded.hexAmount); i++) {
                var rowMove = false;
                $("#map").append(br);
                for (var j = 0; j < parseInt(this.loaded.hexAmount); j++) {
                    for (var x in this.loaded.map) {
                        if (j == this.loaded.map[x].x && i == this.loaded.map[x].z) {
                            var hex = new Hex(rowMove, idCount, i, j, this.loaded.map[x].dirOut, this.loaded.map[x].type, true);
                            loadedHex = true;
                            this.return;
                        }
                    }
                    if (!loadedHex) {
                        var hex = new Hex(rowMove, idCount, i, j, 0, "wall");
                    } else {
                        loadedHex = false;
                    }
                    //$("#map").append(hex.container);
                    this.hexes.push(hex);
                    rowMove = !rowMove;
                    idCount++;
                }
                var br = document.createElement("br");
            }
        })

    }
}