import * as dat from "dat.gui";

export default class Controls{
    constructor(params){
        this.params = params;
        this.init();

        Controls.instance = this
    }

    init(){
        this.gui = new dat.GUI({width: 300});
        this.gui.add(this.params, "mouse_force",20, 200);
        this.gui.add(this.params, "cursor_size", 10, 200);
        this.gui.add(this.params, "dt", 1/200, 1/30);
        this.gui.close();
    }

}