class mapLight {
    constructor(material, z, x) {
        this.x = x;
        this.z = z;
        this.material = material;
        this.container = new THREE.Object3D();
        this.init()
    }

    init() {
        this.container.name = "light";
        var geometry = new THREE.TetrahedronGeometry(Settings.radius / 20);
        var mesh = new THREE.Mesh(geometry, this.material);
        //mesh.castShadow = true;
        //mesh.receiveShadow = true;
        this.pointLight = new THREE.PointLight(0xffffff, 1, 500);
        this.pointLight.position.set(this.x, Settings.wall_height, this.z);
        this.pointLight.add(mesh);
        this.container.add(this.pointLight);
    }
}