class Model {

    constructor() {
        this.container = new THREE.Object3D()
        this.mixer = null
    }

    loadModel = function (url, callback) {

        var loader = new THREE.JSONLoader();

        loader.load(url, function (geometry) {

            // ładowanie modelu jak poprzednio

            //utworzenie mixera jak poprzednio

            //dodanie modelu do kontenera

            container.add(meshModel)

            // zwrócenie kontenera

            callback(container);

        });
    }


    // update mixera

    updateModel() {
        if (this.mixer) {
            this.mixer.update(delta)
        }
    }

    //animowanie postaci

    setAnimation() {
        this.mixer.clipAction("run").play();
    }

}