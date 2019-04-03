class Model {

    constructor() {
        this.container = new THREE.Object3D();
        this.mixer = undefined;
    }

    loadModel (url, callback, mat, name) {

        var loader = new THREE.JSONLoader();

        

        loader.load(url, (geometry) => {
            var meshModel = new THREE.Mesh(geometry, mat);
            meshModel.name = name;
            //meshModel.rotation.y = ? ? ; // ustaw obrót modelu
            meshModel.position.y = 50 ; // ustaw pozycje modelu
            meshModel.scale.set(2, 2, 2); // ustaw skalę modelu
            this.mixer = new THREE.AnimationMixer(meshModel)
            console.log(geometry.animations);
            this.mesh = meshModel;
            this.container.add(meshModel);
            // zwrócenie kontenera

            callback(this.container);
            
        })
    }


    //update mixera

    updateModel(delta) {
        if (this.mixer) {
            this.mixer.update(delta);
        }
    }

    //animowanie postaci

    setAnimation(animation) {
        this.mixer.clipAction(animation).play()
    }

    stopAnimation(animation) {
        this.mixer.clipAction(animation).stop()
    }

}