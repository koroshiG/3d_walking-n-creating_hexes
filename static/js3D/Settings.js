var Settings = {
    lightTab: [],
    radius: 200,
    wall_thic: 14,
    wall_height: 130,
    floor_thic: 2,
    whatDo: null,
    materialTreasure: new THREE.MeshPhongMaterial({
        color: 0xffff00,
        specular: 0xffff00,
        shininess: 15,
        side: THREE.DoubleSide,
    }),
    materialWall: new THREE.MeshPhongMaterial({
        color: 0xdddddd,
        specular: 0xffffff,
        shininess: 15,
        side: THREE.DoubleSide,
    }),
    materialEnemy: new THREE.MeshPhongMaterial({
        color: 0xff0000,
        specular: 0xffffff,
        shininess: 15,
        side: THREE.DoubleSide,
    }),
    materialLight: new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        specular: 0xffffff,
        shininess: 5,
        side: THREE.DoubleSide,
    }),
    modelMaterial: new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("../mats/Sailormoon.png"),
        morphTargets: true // ta własność odpowiada za animację materiału modelu
    })
}