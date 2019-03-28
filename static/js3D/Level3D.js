$(document).ready(() => {
    console.log("bready to render");

    lightTab = [];
    var scene = new THREE.Scene();
    var renderer = new THREE.WebGLRenderer({antialias:true});
    var camera = new THREE.PerspectiveCamera(
        45, // kąt patrzenia kamery (FOV - field of view)
        window.innerWidth / window.innerHeight, // proporcje widoku, powinny odpowiadać proporjom naszego ekranu przeglądarki
        0.1, // minimalna renderowana odległość
        10000 // maxymalna renderowana odległość od kamery
    )
    camera.position.set(0, Settings.radius * 15, 0)
    var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControl.addEventListener('change', function () {
        renderer.render(scene, camera)
    });
    renderer.setClearColor(0xaa5555);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    $("#root").append(renderer.domElement);

    var axes = new THREE.AxesHelper(1000)
    scene.add(axes)
    var wallGeo = new THREE.BoxGeometry(Settings.radius, Settings.wall_height, Settings.wall_thic);
    var doorGeo = new THREE.BoxGeometry(Settings.radius / 3, Settings.wall_height, Settings.wall_thic);
    var floorGeo = new THREE.CylinderGeometry(Settings.radius, Settings.radius, Settings.floor_thic, 6);
    console.log(Settings.whatDo);

    for (item in Settings.whatDo) {
        if (Settings.whatDo[item].x % 2 != 0) {
            var z = ((Settings.whatDo[item].z + 1) * ((Settings.radius / 2) * Math.sqrt(3)) + ((Settings.radius / 4) * Math.sqrt(3)));
        } else {
            var z = (Settings.whatDo[item].z + 1) * ((Settings.radius / 2) * Math.sqrt(3));
        }
        var x = (Settings.whatDo[item].x + 1) * (Settings.radius - (Settings.radius / 4));

        var material = ''
        if (Settings.whatDo[item].type == "wall") {
            material = Settings.materialWall;
        } else if (Settings.whatDo[item].type == "enemy") {
            material = Settings.materialEnemy;
        } else if (Settings.whatDo[item].type == "treasure") {
            material = Settings.materialTreasure;
        } else if (Settings.whatDo[item].type == "light") {
            material = Settings.materialLight;
        }
        var inDoor = [];

        //kierunki drzwi

        for (i in Settings.whatDo) {
            if (Settings.whatDo[i] != Settings.whatDo[item]) {
                //dir 0 oraz dir 3
                if (Settings.whatDo[i].dirOut == 0) {
                    if (Settings.whatDo[item].z == Settings.whatDo[i].z - 1 && Settings.whatDo[item].x == Settings.whatDo[i].x) {
                        inDoor.push(Settings.whatDo[i].dirIn)
                    }
                } else if (Settings.whatDo[i].dirOut == 3) {
                    if (Settings.whatDo[item].z == Settings.whatDo[i].z + 1 && Settings.whatDo[item].x == Settings.whatDo[i].x) {
                        inDoor.push(Settings.whatDo[i].dirIn)
                    }
                } else if (Settings.whatDo[i].dirOut == 1) {
                    //parzysty x, dir 1 przeskakuje, dir 2 zostaje...
                    if (Settings.whatDo[i].x % 2 == 0) {
                        if (Settings.whatDo[item].z == Settings.whatDo[i].z - 1 && Settings.whatDo[item].x == Settings.whatDo[i].x + 1) {
                            inDoor.push(Settings.whatDo[i].dirIn)
                        }
                    } else {

                        if (Settings.whatDo[item].z == Settings.whatDo[i].z && Settings.whatDo[item].x == Settings.whatDo[i].x + 1) {
                            inDoor.push(Settings.whatDo[i].dirIn)
                        }
                    }
                } else if (Settings.whatDo[i].dirOut == 2) {
                    if (Settings.whatDo[i].x % 2 == 0) {
                        if (Settings.whatDo[item].z == Settings.whatDo[i].z && Settings.whatDo[item].x == Settings.whatDo[i].x + 1) {
                            inDoor.push(Settings.whatDo[i].dirIn)
                        }
                    } else {
                        if (Settings.whatDo[item].z == Settings.whatDo[i].z + 1 && Settings.whatDo[item].x == Settings.whatDo[i].x + 1) {
                            inDoor.push(Settings.whatDo[i].dirIn)
                        }
                    }
                } else if (Settings.whatDo[i].dirOut == 4) {
                    if (Settings.whatDo[i].x % 2 == 0) {
                        if (Settings.whatDo[item].z == Settings.whatDo[i].z && Settings.whatDo[item].x == Settings.whatDo[i].x - 1) {
                            inDoor.push(Settings.whatDo[i].dirIn)
                        }
                    } else {
                        if (Settings.whatDo[item].z == Settings.whatDo[i].z + 1 && Settings.whatDo[item].x == Settings.whatDo[i].x - 1) {
                            inDoor.push(Settings.whatDo[i].dirIn)
                        }
                    }
                } else if (Settings.whatDo[i].dirOut == 5) {
                    if (Settings.whatDo[i].x % 2 == 0) {
                        if (Settings.whatDo[item].z == Settings.whatDo[i].z - 1 && Settings.whatDo[item].x == Settings.whatDo[i].x - 1) {
                            inDoor.push(Settings.whatDo[i].dirIn)
                        }
                    } else {
                        if (Settings.whatDo[item].z == Settings.whatDo[i].z && Settings.whatDo[item].x == Settings.whatDo[i].x - 1) {
                            inDoor.push(Settings.whatDo[i].dirIn)
                        }
                    }
                }
            }
        }
        var hex = new Hex3D(x, z, wallGeo, material, floorGeo, inDoor, Settings.whatDo[item].dirOut, doorGeo);
        if (hex.container.getObjectByName("light") != undefined) {
            lightTab.push(hex.container.getObjectByName("light").getObjectByProperty("type", "PointLight"));
        }
        scene.add(hex.container);
    }
    // var light = new THREE.HemisphereLight(0xffffbb, 0x050501, 0.2);
    // light.name = "hemi"
    // var helper = new THREE.HemisphereLightHelper( light, 1000 );
    // scene.add(light);
    // scene.add( helper );
    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight.castShadow = true;
    var helper = new THREE.CameraHelper(directionalLight.shadow.camera);
    scene.add(helper);
    scene.add(directionalLight);

    Settings.light = lightTab;

    function render() {


        //w tym miejscu ustalamy wszelkie zmiany w projekcie (obrót, skalę, położenie obiektów)
        //np zmieniająca się wartość rotacji obiektu

        //mesh.rotation.y += 0.01;

        //wykonywanie funkcji bez końca ok 60 fps jeśli pozwala na to wydajność maszyny

        requestAnimationFrame(render);

        // potwierdzenie w konsoli, że render się wykonuje

        //console.log("render leci")

        //ciągłe renderowanie / wyświetlanie widoku sceny nasza kamerą

        renderer.render(scene, camera);
    }

    render();
})