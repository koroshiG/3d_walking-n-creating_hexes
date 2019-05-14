$(document).ready(() => {
    console.log("bready to render");

    scene = new THREE.Scene();
    var renderer = new THREE.WebGLRenderer({
        antialias: true,
        physicallyCorrectLights: true,
        gammaOutput: true,
        gammaFactor: 2.2

    });
    var camera = new THREE.PerspectiveCamera(
        45, // kąt patrzenia kamery (FOV - field of view)
        window.innerWidth / window.innerHeight, // proporcje widoku, powinny odpowiadać proporjom naszego ekranu przeglądarki
        0.1, // minimalna renderowana odległość
        10000 // maxymalna renderowana odległość od kamery
    )
    camera.position.set(500, 500, 500)
    camera.lookAt(0, 0, 0)
    // var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
    // orbitControl.addEventListener('change', function () {
    //     renderer.render(scene, camera)
    // });
    renderer.setClearColor(0xaa5555);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    //raycaster
    var raycaster = new THREE.Raycaster(); // obiekt symulujący "rzucanie" promieni
    var colRay = new THREE.Raycaster()
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

    var mousePos = new THREE.Vector2()
    var seekersTab = []

    var geometry = new THREE.SphereGeometry(15, 32, 32);
    var material = new THREE.MeshBasicMaterial({
        color: 0xffff00
    });
    var sphere = new THREE.Mesh(geometry, material)


    var picker = new THREE.Mesh(geometry, material);
    picker.rotation.x = Math.PI / 2
    picker.position.y = 75
    picker.name = "picker"
    var lastHover

    var updateMousePosition = () => {
        mousePos.x = (event.clientX / $(window).width()) * 2 - 1;
        mousePos.y = -(event.clientY / $(window).height()) * 2 + 1;
        raycaster.setFromCamera(mousePos, camera);
        var intersects = raycaster.intersectObjects(rayAlly, true);
        if (intersects.length > 0) {
            intersects[0].object.parent.add(picker)
            lastHover = intersects[0]
        } else if (intersects.length == 0 && lastHover != undefined) {
            lastHover.object.parent.remove(scene.getObjectByName("picker"))
        }
    }

    var collisions = () => {
        mousePos.x = (event.clientX / $(window).width()) * 2 - 1;
        mousePos.y = -(event.clientY / $(window).height()) * 2 + 1;
        raycaster.setFromCamera(mousePos, camera);
        var intersects = raycaster.intersectObjects(rayAlly, true);
        if (intersects.length > 0) {
            intersects[0].object.parent.add(picker)
            lastHover = intersects[0]
        } else if (intersects.length == 0) {
            lastHover.object.parent.remove(scene.getObjectByName("picker"))
        }
    }

    var movement = () => {
        mouseVector.x = (event.clientX / $(window).width()) * 2 - 1;
        mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1;
        raycaster.setFromCamera(mouseVector, camera);
        var intersects = raycaster.intersectObjects(floors);
        if (intersects.length > 0) {
            clickedVect = intersects[0].point
            torus.position.copy(clickedVect)
            directionVect = clickedVect.clone().sub(player.container.position).normalize()
            model.setAnimation("run")
            model.stopAnimation("stand")
            var angle = Math.atan2(
                player.container.position.clone().x - clickedVect.x,
                player.container.position.clone().z - clickedVect.z
            )
            player.player.rotation.y = angle - Math.PI / 2

            //funkcja normalize() przelicza współrzędne x,y,z wektora na zakres 0-1
            //jest to wymagane przez kolejne funkcje	
        }
    }

    var allies = () => {
        mouseVector.x = (event.clientX / $(window).width()) * 2 - 1;
        mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1;
        raycaster.setFromCamera(mouseVector, camera);
        var intersects = raycaster.intersectObjects(rayAlly, true);
        if (intersects.length > 0) {
            if (!intersects[0].object.parent.userData.clicked) {
                intersects[0].object.parent.userData.clicked = true
                for (let index in allyTab) {
                    if (allyTab[index].container.uuid == intersects[0].object.parent.parent.children[0].uuid) {
                        seekersTab.push(allyTab[index])
                        playerAllyTab.push(allyTab[index].container.parent)
                        break
                    }
                }
            } else {
                for (let index in allyTab) {
                    if (seekersTab[index].container.uuid == intersects[0].object.parent.parent.children[0].uuid) {
                        seekersTab.splice(index, 1)
                        playerAllyTab.splice(index, 1)
                        break
                    }
                }
                intersects[0].object.parent.userData.clicked = false
            }
        }
    }

    $(document).mousedown((event) => {
        movement()
        allies()
        $(document).mousemove(movement)
    })

    $(document).mousemove((event) => {
        updateMousePosition()
    })

    $(document).mouseup((event) => {
        $(document).off("mousemove", movement)
    })
    scene.add(torus);

    var model = new Model()
    var playerAlly
    var allyTab = []
    var lightTab = []
    var rayAlly = []
    var updateTab = []
    var hexTab = []
    var playerAllyTab = []
    var floors = []
    model.loadModel("../models/sailormoon/json/tris.js", function (modeldata) {}, Settings.playerMat, "sai")
    for (var i = 0; i < ~~(Math.random() * 4) + 1; i++) {
        let ally = new Model()
        ally.loadModel("../models/sailormoon/json/tris.js", (modeldata) => {}, Settings.allyMat, "ally" + i)
        playerAlly = new Ally(ally.container)
        playerAlly.container.position.z = i * 100 + 50
        ally.container.userData.clicked = false
        ally.container.userData.hoverSignal = false
        allyTab.push(ally)
        rayAlly.push(ally.container)
        updateTab.push(ally.container)
        scene.add(playerAlly.container)
    }


    $("#root").append(renderer.domElement);

    var axes = new THREE.AxesHelper(1000)
    scene.add(axes)
    var wallGeo = new THREE.BoxGeometry(Settings.radius, Settings.wall_height, Settings.wall_thic);
    var doorGeo = new THREE.BoxGeometry(Settings.radius / 4, Settings.wall_height, Settings.wall_thic);
    var floorGeo = new THREE.CylinderGeometry(Settings.radius, Settings.radius, Settings.floor_thic, 6);

    player = new Player(model.container)
    scene.add(player.container)

    var spotlight = new THREE.PointLight(0xff0000);
    spotlight.position.y += 1;
    spotlight.intensity = 2;
    spotlight.distance = 258;
    spotlight.angle = 0.53;
    spotlight.decay = 1;
    spotlight.name = "playerLight";
    player.player.add(spotlight);
    playerLight = player.player.getObjectByName("playerLight");

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
            player.container.position.z = 1.75 * z
            player.container.position.x = 2 * x
        }
        if (hex.container.getObjectByName("light") != undefined) {
            lightTab.push(hex.container.getObjectByName("light").getObjectByProperty("type", "PointLight"));
        }
        scene.add(hex.container)
        floors.push(hex.container.getObjectByName("floor"))
        hexTab.push(hex.container)
        updateTab.push(hex.container)
    }


    // var light = new THREE.HemisphereLight(0xffffbb, 0x050501, 0.2);
    // light.name = "hemi"
    // var helper = new THREE.HemisphereLightHelper( light, 1000 );
    // scene.add(light);
    // scene.add( helper );
    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
    directionalLight.castShadow = true;
    var helper = new THREE.CameraHelper(directionalLight.shadow.camera);
    scene.add(helper);
    scene.add(directionalLight);

    Settings.light = lightTab;

    scene.add(sphere)

    function render() {


        var vector = new THREE.Vector3()
        var ray = new THREE.Ray(player.container.position, player.axes.getWorldDirection(vector))

        colRay.ray = ray
        var distance_to_wall
        var intersects = colRay.intersectObjects(hexTab, true);
        if (intersects[0]) {
            if (intersects[0].object.name != "floor") {
                distance_to_wall = intersects[0].distance // odległość od vertex-a na wprost, zgodnie z kierunkiem ruchu
                wall = intersects[0].point // współrzędne vertexa na wprost
                sphere.position.set(wall.x, wall.y, wall.z)
            } else {
                distance_to_wall = 6
            }
        }

        if (player.container.position.clone().distanceTo(clickedVect) > 5 && (distance_to_wall >= 5 || distance_to_wall <= 0)) {
            player.container.translateOnAxis(directionVect, 5)
            camera.position.x = player.container.position.x
            camera.position.z = player.container.position.z + 500
            camera.position.y = player.container.position.y + 500
            camera.lookAt(player.container.position)
            //model.setAnimation("run")
            //model.stopAnimation("stand")
        } else if (model.mixer != undefined) {
            model.stopAnimation("run")
            model.setAnimation("stand")
        }

        for (let index in seekersTab) {
            let angleAlly = Math.atan2(
                playerAllyTab[index].position.clone().x - player.container.position.x,
                playerAllyTab[index].position.clone().z - player.container.position.z
            )
            let allyVector = player.container.position.clone().sub(playerAllyTab[index].position).normalize()
            if (seekersTab[index].container.userData.clicked && playerAllyTab[index].position.clone().distanceTo(player.container.position) > (125 * index) + 75) {
                playerAllyTab[index].translateOnAxis(allyVector, 5.2)
                playerAllyTab[index].children[0].rotation.y = angleAlly - Math.PI / 2
                seekersTab[index].setAnimation("run")
                seekersTab[index].stopAnimation("stand")
            } else if (seekersTab[index].container.userData.clicked && playerAllyTab[index].position.clone().distanceTo(player.container.position) > (50 * index) + 50) {
                playerAllyTab[index].translateOnAxis(allyVector, 5)
                playerAllyTab[index].children[0].rotation.y = angleAlly - Math.PI / 2
                seekersTab[index].setAnimation("run")
                seekersTab[index].stopAnimation("stand")
            } else {
                seekersTab[index].stopAnimation("run")
                seekersTab[index].setAnimation("stand")
            }
        }
        //w tym miejscu ustalamy wszelkie zmiany w projekcie (obrót, skalę, położenie obiektów)
        //np zmieniająca się wartość rotacji obiektu
        var delta = clock.getDelta()
        model.updateModel(delta)
        for (let index in seekersTab) {
            if (seekersTab[index].container.userData.clicked) {
                seekersTab[index].updateModel(delta)
            }
        }

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