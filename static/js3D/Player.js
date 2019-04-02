class Player {
    constructor(player) {
        this.container = new THREE.Object3D()
        this.geometry = new THREE.BoxGeometry(35, 35, 35);
        this.material = new THREE.MeshBasicMaterial({
            color: 0xddccee
        });

        this.player = player
        this.init()
    }

    init() {
        this.container.add(this.player) // kontener w którym jest player
        this.player.rotation.y = Math.PI/2
        this.axes = new THREE.AxesHelper(200) // osie konieczne do kontroli kierunku ruchu
        this.axes.rotation.y = -Math.PI/2
        this.player.add(this.axes)
    }
}