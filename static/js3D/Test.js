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


    var picker = new THREE.Mesh(geometry, material);
    picker.rotation.x = Math.PI / 2
    picker.position.y = 75
    picker.name = "picker"
    var lastHover
    var updateMousePosition = () => {
        mousePos.x = (event.clientX / $(window).width()) * 2 - 1;
        mousePos.y = -(event.clientY / $(window).height()) * 2 + 1;
        raycaster.setFromCamera(mousePos, camera);
        var intersects = raycaster.intersectObjects(updateTab, true);

        if (intersects.length > 0 && intersects[0].object.geometry.type != "PlaneGeometry") {
            lastHover = intersects[0]
            if (lastHover != undefined) {
                lastHover.object.parent.add(picker)
            }
        } else if (lastHover != undefined && (intersects == undefined || intersects[0].object.geometry.type == "PlaneGeometry")) {
            lastHover.object.parent.remove(scene.getObjectByName("picker"))
        }
    }

    var movement = () => {
        mouseVector.x = (event.clientX / $(window).width()) * 2 - 1;
        mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1;
        raycaster.setFromCamera(mouseVector, camera);
        var intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
            clickedVect = intersects[0].point
            torus.position.copy(clickedVect)
            directionVect = clickedVect.clone().sub(player.container.position).normalize()
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
                console.log(seekersTab);
            } else {
                for (let index in allyTab) {
                    if (seekersTab[index].container.uuid == intersects[0].object.parent.parent.children[0].uuid) {
                        seekersTab.splice(index, 1)
                        playerAllyTab.splice(index, 1)
                        break
                    }
                }
                console.log(seekersTab);
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

    var axes = new THREE.AxesHelper(1000)
    scene.add(axes)

    $("#root").append(renderer.domElement);

    var geometry = new THREE.PlaneGeometry(500, 500, 50, 50)
    var material = new THREE.MeshBasicMaterial({
        color: 0xdddddd,
        side: THREE.DoubleSide,
        // wireframe: true
    })
    var plane = new THREE.Mesh(geometry, material)
    plane.rotation.x = Math.PI / 2
    scene.add(plane)

    var model = new Model()
    var playerAlly
    var allyTab = []
    var rayAlly = []
    var updateTab = []
    updateTab.push(plane)
    var playerAllyTab = []
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

    var directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
    directionalLight.castShadow = true;
    var helper = new THREE.CameraHelper(directionalLight.shadow.camera);
    scene.add(helper);
    scene.add(directionalLight);

    player = new Player(model.container)
    scene.add(player.container)

    //newally = new Player(ally.container)
    //scene.add(newally.container)

    function render() {
        if (player.container.position.clone().distanceTo(clickedVect) > 5) {
            player.container.translateOnAxis(directionVect, 5)
            camera.position.x = player.container.position.x
            camera.position.z = player.container.position.z + 500
            camera.position.y = player.container.position.y + 500
            camera.lookAt(player.container.position)
            model.setAnimation("run")
            model.stopAnimation("stand")
            for (let index in seekersTab) {
                let angleAlly = Math.atan2(
                    playerAllyTab[index].position.clone().x - player.container.position.x,
                    playerAllyTab[index].position.clone().z - player.container.position.z
                )
                let allyVector = player.container.position.clone().sub(playerAllyTab[index].position).normalize()
                if (seekersTab[index].container.userData.clicked && playerAllyTab[index].position.clone().distanceTo(player.container.position) > (125 * index) + 75) {
                    playerAllyTab[index].translateOnAxis(allyVector, 5.2)
                    playerAllyTab[index].children[0].rotation.y = angleAlly - Math.PI / 2
                } else if (seekersTab[index].container.userData.clicked && playerAllyTab[index].position.clone().distanceTo(player.container.position) > (50 * index) + 50) {
                    playerAllyTab[index].translateOnAxis(allyVector, 5)
                    playerAllyTab[index].children[0].rotation.y = angleAlly - Math.PI / 2
                }
                seekersTab[index].setAnimation("run")
                seekersTab[index].stopAnimation("stand")
            }
        } else if (model.mixer != undefined) {
            model.stopAnimation("run")
            model.setAnimation("stand")
            for (let index in seekersTab) {
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