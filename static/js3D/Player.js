class Player {
    constructor() {
        this.container = new THREE.Object3D()
        this.geometry = new THREE.BoxGeometry(35, 35, 35);
        this.material = new THREE.MeshBasicMaterial({
            color: 0xddccee
        });
        this.player = new THREE.Mesh(this.geometry, this.material) // player sześcian
        this.player.position.y = 17.5
        this.container.add(this.player) // kontener w którym jest player
        this.axes = new THREE.AxesHelper(200) // osie konieczne do kontroli kierunku ruchu
        this.player.add(this.axes)
    }
}