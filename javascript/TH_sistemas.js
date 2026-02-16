
class Sistemas {
    constructor() {
		this.nombressistemas = [ "", "Aventuras en La Marca del Este", "Cronicas de la Marca" ];
        this.sistemas = new Map();
        this.sistemas.set(this.nombressistemas[1], new AeLMdE());
        this.sistemas.set(this.nombressistemas[2], new CdLM());
    }
    
    getSistema(_sistema) {
        return this.sistemas.get(_sistema);
    }
    
    getSistemas() {
        return Array.from(this.sistemas.keys());
    }
    
    seleccionasistema(thelist) {
		var objsistema = null;
		var idx = thelist.selectedIndex;
		if ( idx > 0 ) {
			objsistema=this.getSistema(this.nombressistemas[idx]);
		}
		return objsistema;
	}
}

let sistemas = new Sistemas();
