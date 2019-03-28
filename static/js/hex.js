console.log("wczytano plik Hex.js")

class Hex {
    constructor(offset, id, z, x, dir, type = '', used = false) {
        this.id = id;
        this.z = z;
        this.x = x;
        this.dir = dir;
        this.offset = offset;
        this.container;
        this.type = type;
        this.used = used;
        this.type;
        this.init();
    }

    init() {
        this.container = document.createElement("div");
        this.container.className = "hexContainer";
        this.container.style.position = "absolute";
        this.container.style.left = (this.x * 120) + "px";
        this.container.style.top = (this.z * 140) + "px";
        this.container.img = document.createElement("img");
        this.container.img.src = "pics/" + this.type + ".png";
        this.container.img.id = "img" + this.id;
        this.container.img.className = "hexPic";
        if (this.offset) {
            this.container.style.top = (parseInt(this.container.style.top.replace("px", "")) + 67.5) + "px";
        }

        var that = this;

        function leftClick() {
            if (that.dir < 5) {
                that.dir++;
            } else {
                that.dir = 0;
            }

            that.arrow.style.transform = "rotate(" + (that.dir * 60).toString() + "deg)";
            that.counter.innerText = that.dir;

            if (generator.typeChange != '') {
                console.log(that.type);

                if (generator.typeChange == "wall") {
                    $("#img" + that.id)[0].src = "pics/wall.png";
                    that.type = "wall";
                } else if (generator.typeChange == "enemy") {
                    $("#img" + that.id)[0].src = "pics/enemy.png";
                    that.type = "enemy";
                } else if (generator.typeChange == "treasure") {
                    $("#img" + that.id)[0].src = "pics/treasure.png";
                    that.type = "treasure";
                } else if (generator.typeChange == "light") {
                    $("#img" + that.id)[0].src = "pics/light.png";
                    that.type = "light";
                }
            }
        }

        function rightClick(e) {
            e.preventDefault();
            that.arrow.innerHTML = '';
            that.counter.innerHTML = '';
            that.type = 'wall';
            that.used = false;
            that.dir = 0;
            $("#img" + that.id)[0].src = "pics/wall.png";
            that.container.removeEventListener("click", leftClick);
            that.container.removeEventListener("contextmenu", rightClick);
            that.container.addEventListener("click", addClicks);
        }

        function addClicks() {
            if (!that.used) {
                that.container.removeEventListener("click", addClicks);
                that.type = generator.typeChange;
            }
            that.container.addEventListener("click", leftClick);
            that.container.addEventListener("contextmenu", rightClick);
            that.used = true;

            that.container.img.src = "pics/" + that.type + ".png";
            that.arrow = document.createElement("div");
            that.arrow.className = "arrowContainer";
            that.arrow.style.position = "absolute";
            that.arrow.style.top = "50px";
            that.arrow.style.left = "42.5px";
            var imgarr = document.createElement("img");
            imgarr.src = "pics/arrow.png";
            imgarr.id = that.id;
            imgarr.className = "arrow";
            that.arrow.append(imgarr);
            that.arrow.style.transform = "rotate(" + (that.dir * 60).toString() + "deg)";
            that.counter = document.createElement("div");
            that.counter.style.position = "absolute";
            that.counter.style.top = "50px";
            that.counter.style.left = "37.5px";
            that.counter.innerText = that.dir;
            that.container.append(that.counter);
            that.container.append(that.arrow);
        }
        if (this.used) {
            addClicks();
        } else {
            this.container.addEventListener("click", addClicks);
        }
        this.container.append(this.container.img);
        $("#map").append(this.container);
    }

    position() {
        return {
            id: this.id,
            z: this.z,
            x: this.x,
            type: this.type,
            dirOut: this.dir,
            dirIn: this.dir <= 3 ? (3 + this.dir == 6 ? 0 : 3 + this.dir) : (3 + this.dir == 6 ? 0 : this.dir - 3)
        }
    }
}