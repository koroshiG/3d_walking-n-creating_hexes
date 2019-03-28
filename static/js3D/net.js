console.log("wczytano plik Net.js")

class Net {
    constructor() {
        console.log("net rdy");
        this.load();
    }

    load() {
        $.ajax({
            url: "/",
            async: false,
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
                Settings.whatDo = (JSON.parse(data.map)).map;
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        })
    }

}