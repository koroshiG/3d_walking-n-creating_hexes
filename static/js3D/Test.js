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

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight.castShadow = true;
    var helper = new THREE.CameraHelper(directionalLight.shadow.camera);
    scene.add(helper);
    scene.add(directionalLight);

    player = new Player(model.container)
    scene.add(player.container)

    function render() {
        console.log(player.container.position.clone().distanceTo(clickedVect));

        if (player.container.position.clone().distanceTo(clickedVect) > 5) {
            player.container.translateOnAxis(directionVect, 5)
            camera.position.x = player.container.position.x
            camera.position.z = player.container.position.z + 500
            camera.position.y = player.container.position.y + 500
            camera.lookAt(player.container.position)
            model.setAnimation("run")
            model.stopAnimation("stand")
        } else if (model.mixer != undefined) {
            model.stopAnimation("run")
            model.setAnimation("stand")
        }
        //w tym miejscu ustalamy wszelkie zmiany w projekcie (obrót, skalę, położenie obiektów)
        //np zmieniająca się wartość rotacji obiektu
        var delta = clock.getDelta()
        model.updateModel(delta)
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