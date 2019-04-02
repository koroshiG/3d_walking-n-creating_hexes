$(document).ready(() => {
    console.log("bready to render");

    lightTab = [];
    var scene = new THREE.Scene();
    var renderer = new THREE.WebGLRenderer({
        antialias: true
    });
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
    var raycaster = new THREE.Raycaster(); // obiekt symulujący "rzucanie" promieni
    var clock = new THREE.Clock();
    var clickedVect = new THREE.Vector3(0, 0, 0); // wektor określający PUNKT kliknięcia
    var directionVect = new THREE.Vector3(0, 0, 0); // wektor określający KIERUNEK ruchu playera
    var mouseVector = new THREE.Vector2()
    // ten wektor czyli pozycja w przestrzeni 2D na ekranie(x,y)
    // wykorzystany będzie do określenie pozycji myszy na ekranie
    // a potem przeliczenia na pozycje 3D

    var geometry = new THREE.TorusGeometry(10, 2, 30, 30);
    var material = new THREE.MeshBasicMaterial({
        color: 0xdd55bb
    });
    var torus = new THREE.Mesh(geometry, material);
    torus.rotation.x = Math.PI / 2

    var movement = () => {

        mouseVector.x = (event.clientX / $(window).width()) * 2 - 1;
        mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1;
        raycaster.setFromCamera(mouseVector, camera);
        var intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
            clickedVect = intersects[0].point
            console.log(clickedVect)
            console.log(torus);

            torus.position.copy(clickedVect)
            directionVect = clickedVect.clone().sub(player.container.position).normalize()
            console.log(directionVect)
            var angle = Math.atan2(
                player.container.position.clone().x - clickedVect.x,
                player.container.position.clone().z - clickedVect.z
            )
            player.player.rotation.y = angle - Math.PI / 2
            model.setAnimation("run")
            model.stopAnimation("stand")
            //funkcja normalize() przelicza współrzędne x,y,z wektora na zakres 0-1
            //jest to wymagane przez kolejne funkcje	
        }
    }

    $(document).mousedown((event) => {
        movement()
        $(document).mousemove(movement)
    })

    $(document).mouseup((event) => {
        $(document).off("mousemove", movement)
    })
    scene.add(torus);

    player = new Player(model.container)
    scene.add(player.container)

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
        if (item == 0) {
            console.log("pos");

            player.container.position.z = z
            player.container.position.x = x
        }
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

        if (player.container.position.clone().distanceTo(clickedVect) > 5) {
            player.container.translateOnAxis(directionVect, 5)
            camera.position.x = player.container.position.x
            camera.position.z = player.container.position.z + 500
            camera.position.y = player.container.position.y + 500
            camera.lookAt(player.container.position)
        } else if (model.mixer != undefined) {
            model.stopAnimation("run")
            model.setAnimation("stand")
        }
        //w tym miejscu ustalamy wszelkie zmiany w projekcie (obrót, skalę, położenie obiektów)
        //np zmieniająca się wartość rotacji obiektu
        var delta = clock.getDelta()
        model.updateModel(delta)

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