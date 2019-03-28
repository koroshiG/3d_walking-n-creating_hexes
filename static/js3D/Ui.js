class Ui {
    constructor() {
        this.lightTab = []
        this.init()
    }

    init() {
        $(document).ready(() => {
            this.lightTab = Settings.light
            
            $("#intense").val(1)
            $("#intense").on("mousemove", () => {
                for (var i =0; i<this.lightTab.length; i++) {
                    this.lightTab[i].intensity = $("#intense").val()
                }
                scene.getObjectByName("hemi").intensity = $("#intense").val()
            })
            $("#height").val(Settings.wall_height);
            $("#height").on("mousemove", () => {
                for (var i =0; i<this.lightTab.length; i++) {
                    this.lightTab[i].position.y = $("#height").val()
                }
            })
        })
    }
}