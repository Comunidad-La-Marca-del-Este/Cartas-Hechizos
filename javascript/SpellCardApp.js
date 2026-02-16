class SpellCardApp {
    constructor() {
        this.currentSystem = null;
        this.systemsManager = sistemas; // Instancia global de Sistemas
        this.tiposSistema = [];
        this.lHechizos = [];
        this.tipoHechizos = "";

        this.pdfService = new PDFService();
        this.ui = this._getUIElements();

        // Inicializar el estado de la UI
        this._initUI();
    }

    _getUIElements() {
        return {
            divTipo: document.getElementById("divtipo"),
            btnPdf: document.getElementById("botonpdf"),
            listaHechizos: document.getElementById("listahechizos"),
            hechizosContainers: [
                document.getElementById("hechizos1"),
                document.getElementById("hechizos2"),
                document.getElementById("hechizos3")
            ],
            // Selectores dinámicos serán gestionados por eventos delegados en divTipo
        };
    }

    _initUI() {
        this.ui.divTipo.style.visibility = "hidden";
        this.ui.btnPdf.style.visibility = "hidden";
        this.ui.listaHechizos.style.visibility = "hidden";

        // Delegación de eventos para los selectores dinámicos en divtipo
        this.ui.divTipo.addEventListener('change', (event) => {
            if (event.target.tagName === 'SELECT') {
                const selectElement = event.target;
                // Intentar deducir el índice basado en el nombre o posición si es posible
                // Aunque la implementación actual de los sistemas usa onChange='seleccionatipo(this, indice)'
                // Por lo tanto, mantendremos la función global proxy seleccionatipo(thelist, indice)
            }
        });

        // Event listener para el botón de generación de PDF
        const btn = this.ui.btnPdf.querySelector('button');
        if (btn) {
            btn.onclick = () => this.generatePDF(); // Override onclick attribute
        }
    }

    /**
     * Resetea la UI al estado inicial
     */
    resetUI() {
        this.ui.divTipo.innerHTML = "";
        this.ui.hechizosContainers.forEach(container => container.innerHTML = "");

        this.ui.divTipo.style.visibility = "hidden";
        this.ui.btnPdf.style.visibility = "hidden";
        this.ui.listaHechizos.style.visibility = "hidden";
    }

    /**
     * Gestiona la selección de un sistema de juego
     * @param {HTMLSelectElement} selectElement 
     */
    selectSystem(selectElement) {
        this.resetUI();

        this.tiposSistema = [];
        this.lHechizos = [];
        this.tipoHechizos = "";

        this.currentSystem = this.systemsManager.seleccionasistema(selectElement);

        if (this.currentSystem) {
            this.lHechizos = this.currentSystem.cargaHechizos();
            this._loadSystemTypes();
        }
    }

    _loadSystemTypes() {
        if (this.currentSystem) {
            this.tiposSistema = this.currentSystem.listaTipos();
            const tiposHtml = this.currentSystem.construyeSelectTipos(this.tiposSistema);
            this.ui.divTipo.innerHTML = tiposHtml;
            this.ui.divTipo.style.visibility = "visible";
        }
    }

    /**
     * Gestiona la selección de un tipo de hechizo o nivel
     * @param {HTMLSelectElement} selectElement 
     * @param {number} index Indice del selector (0 para tipo, 1 para nivel generalmente)
     */
    selectType(selectElement, index) {
        if (!this.currentSystem) return;

        const idx = selectElement.selectedIndex;

        // Lógica de filtrado
        if (idx > 0 && this.tiposSistema[index] && this.tiposSistema[index].length > 0) {
            this.tipoHechizos = this.tiposSistema[index][idx - 1]; // Ajuste por opción 'Selecciona'
            this.currentSystem.setTipo(this.tipoHechizos, index);
            this.lHechizos = this.currentSystem.cargaHechizos();
        }
        else if (this.tiposSistema[index] && this.tiposSistema[index].length > 0) {
            // Opción 'Selecciona' o vacía
            this.currentSystem.setTipo("", index);
            this.lHechizos = this.currentSystem.cargaHechizos();
        }
        else {
            // Fallback
            this.tipoHechizos = "";
            this.lHechizos = [];
            this.ui.hechizosContainers.forEach(c => c.innerHTML = "");
            this.ui.listaHechizos.style.visibility = "hidden";
            this.ui.btnPdf.style.visibility = "hidden";
        }

        // Actualizar visibilidad de spell list si hay hechizos
        if (this.lHechizos && this.lHechizos.length > 0) {
            // La visibilidad se gestiona dentro de cargaHechizos/pintaHechizos en el sistema base,
            // pero podríamos asegurarnos aquí si refactorizamos más profunadmente.
        } else {
            // Si la lista está vacía explicitamente ocultar
            if (!this.lHechizos || this.lHechizos.length === 0) {
                this.ui.listaHechizos.style.visibility = "hidden";
                this.ui.btnPdf.style.visibility = "hidden";
            }
        }
    }

    /**
     * Genera el PDF con los hechizos seleccionados
     */
    async generatePDF() {
        if (!this.currentSystem) return;

        const numHechizosPorPagina = this.currentSystem.numeroHechizos();
        const hechizosSeleccionados = this._getSelectedSpells();

        // Validación: Si no hay hechizos seleccionados manualmente pero tampoco se ha filtrado nada específico
        // la lógica original intentaba imprimir todos si num==0.
        // Aquí simplificamos: Si no hay selección manual, imprimir todos los listados actualmente (filtrados).
        let spellsToPrint = [];

        if (hechizosSeleccionados.length > 0) {
            spellsToPrint = hechizosSeleccionados;
        } else {
            // Si no seleccionó ninguno, imprimir todos los visibles
            spellsToPrint = this.lHechizos.map(h => h.nombre);
        }

        if (spellsToPrint.length === 0) {
            alert("No hay hechizos para imprimir.");
            return;
        }

        await this.pdfService.generatePDF(this.currentSystem, spellsToPrint);
    }

    _getSelectedSpells() {
        const selected = [];
        // Iterar sobre los checkboxes generados. 
        // Nota: Los IDs son generados por SistemaBase.pintaHechizos como 'chechizos0', 'chechizos1', etc.
        // Esto es una dependencia implícita que mantenemos por ahora.
        for (let i = 0; i < this.lHechizos.length; i++) {
            const checkbox = document.getElementById("chechizos" + i);
            if (checkbox && checkbox.checked) {
                selected.push(this.lHechizos[i].nombre);
            }
        }
        return selected;
    }
}

// Inicialización Global
let spellApp;

window.addEventListener('DOMContentLoaded', () => {
    spellApp = new SpellCardApp();
});

// Funciones Proxy para mantener compatibilidad con los atributos HTML inline generados por las clases legadas
// (TH_sistemabase.js, etc.) que usan 'onclick="seleccionasistema(this)"', etc.
window.seleccionasistema = (element) => {
    if (spellApp) spellApp.selectSystem(element);
};

window.seleccionatipo = (element, index) => {
    if (spellApp) spellApp.selectType(element, index);
};

window.generaPDF = () => {
    if (spellApp) spellApp.generatePDF();
};

// Sobrescribir cargapagina por si acaso, aunque ya se eliminó la llamada manual
window.cargapagina = () => { /* No-op, managed by class constructor */ };
