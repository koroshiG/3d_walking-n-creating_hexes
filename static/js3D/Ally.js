class Ally {
    constructor(ally) {
        this.container = new THREE.Object3D()
        this.geometry = new THREE.BoxGeometry(35, 35, 35);
        this.material = new THREE.MeshBasicMaterial({
            color: 0xddccee
        });

        this.ally = ally
        this.init()
    }

    init() {
        this.container.add(this.ally) // kontener w którym jest ally
        this.ally.rotation.y = Math.PI/2
        this.axes = new THREE.AxesHelper(200) // osie konieczne do kontroli kierunku ruchu
        this.axes.rotation.y = -Math.PI/2
        this.ally.add(this.axes)
    }
}