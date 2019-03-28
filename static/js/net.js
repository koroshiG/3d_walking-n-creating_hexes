console.log("wczytano plik Net.js")

class Net {
    constructor() {
        console.log("net rdy");
        this.firstLoad();
    }

    firstLoad() {
        $.ajax({
            url: "/",
            contentType: 'application/json',
            data: {
                load: true
            },
            type: "POST",
            dataType: "json",
            headers: {
                header: "load"
            },
            success: function (data) {
                generator.loaded = JSON.parse(data.map);
                console.log(generator.loaded);

            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        })
    }

    sendData(toSend) { 
        $.ajax({
            url: "/",
            contentType: 'application/json',
            data: {
                map: JSON.stringify(toSend)
            },
            type: "POST",
            dataType: "json",
            headers: {
                header: "save"
            },
            success: function (data) {
                generator.loaded = JSON.parse(data.map);
                console.log(JSON.parse(data.map));

            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        })
    }

}