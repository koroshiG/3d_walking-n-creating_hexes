console.log("wczytano plik Hex3D.js");

class Hex3D {
    constructor(x, z, geometry, wallMaterial, floorGeo, doorIn, doorOut, doors) {
        this.x = x;
        this.z = z;
        this.doorGeo = doors;
        this.doorIn = doorIn;
        this.doorOut = doorOut
        this.geometry = geometry;
        this.wallMaterial = wallMaterial;
        this.floorGeo = floorGeo;
        this.container;
        this.init();
    }

    init() {
        this.container = new THREE.Object3D() // kontener na obiekty 3D
        this.container.position.z = this.z;
        this.container.position.x = this.x;

        var wall = new THREE.Mesh(this.geometry, this.wallMaterial);
        wall.castShadow = true;
        wall.receiveShadow = true;
        var floor = new THREE.Mesh(this.floorGeo, this.wallMaterial);
        floor.position.z = this.z;
        floor.position.x = this.x;
        floor.rotation.y = Math.PI / 6;
        floor.receiveShadow = true;
        floor.name = "floor";


        for (var i = 0; i < 6; i++) {
            if (i == this.doorOut) {
                var side = this.doorOut = new Doors3D(this.doorGeo, this.wallMaterial).container
            } else if (this.doorIn.includes(i)) {
                continue;
                //var side = new Doors3D(this.doorGeo, this.material).container
            } else {
                var side = wall.clone()
            }
            
            switch (i) {
                case 3:
                    side.position.z = this.z + (Settings.radius / 2) * Math.sqrt(3);
                    side.position.x = this.x;
                    break;
                case 2:
                    side.position.z = this.z + ((Settings.radius / 2) * Math.sqrt(3)) / 2;
                    side.position.x = this.x + (((Settings.radius / 2) * Math.sqrt(3)) / 2) * Math.sqrt(3);
                    break;
                case 1:
                    side.position.z = this.z - ((Settings.radius / 2) * Math.sqrt(3)) / 2;
                    side.position.x = this.x + (((Settings.radius / 2) * Math.sqrt(3)) / 2) * Math.sqrt(3);
                    break;
                case 0:
                    side.position.z = this.z - (Settings.radius / 2) * Math.sqrt(3);
                    side.position.x = this.x;
                    break;
                case 4:
                    side.position.z = this.z + ((Settings.radius / 2) * Math.sqrt(3)) / 2;
                    side.position.x = this.x - (((Settings.radius / 2) * Math.sqrt(3)) / 2) * Math.sqrt(3);
                    break;
                case 5:
                    side.position.z = this.z - ((Settings.radius / 2) * Math.sqrt(3)) / 2;
                    side.position.x = this.x - (((Settings.radius / 2) * Math.sqrt(3)) / 2) * Math.sqrt(3);
                    break;
            }
            side.lookAt(this.container.position)
            side.position.y = Settings.wall_height / 2;
            this.container.add(side)
        }
        if (this.wallMaterial == Settings.materialWall) {
            var side = wall.clone()
            side.position.z = this.z;
            side.position.x = this.x;
            this.container.add(side)
        } else if (this.wallMaterial == Settings.materialEnemy) {

        } else if (this.wallMaterial == Settings.materialLight) {
            var light = new mapLight(Settings.materialTreasure, this.z, this.x);
            this.container.add(light.container);
            
        } else if (this.wallMaterial == Settings.materialTreasure) {
            var treasureGeo = new THREE.BoxGeometry(Settings.radius / 4, Settings.radius/4, Settings.radius/4);var side = wall.clone()
            var chest = new THREE.Mesh(treasureGeo, this.wallMaterial);
            chest.position.z = this.z;
            chest.position.x = this.x;
            chest.position.y = Settings.radius / 8;
            this.container.add(chest)
        }
        this.container.add(floor)

    }

}