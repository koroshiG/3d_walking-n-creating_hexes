console.log("wczytano plik Hex3D.js");

class Doors3D {
    constructor(geometry, material) {
        this.geometry = geometry;
        this.material = material;
        this.container;
        this.init();
    }

    init() {
        this.container = new THREE.Object3D() // kontener na obiekty 3D

        var p1 = new THREE.Mesh(this.geometry, this.material);
        var p2 = new THREE.Mesh(this.geometry, this.material);

        p1.position.x = (1 * Settings.radius/3);
        p2.position.x = (-1 * Settings.radius/3);

        this.container.add(p1);
        this.container.add(p2);
    }
}