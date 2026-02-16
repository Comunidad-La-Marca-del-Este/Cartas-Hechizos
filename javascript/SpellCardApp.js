class SpellCardApp {
    constructor() {
        this.currentSystem = null;
        this.systemRegistry = new SystemRegistry();
        this.uiManager = new UIManager();
        this.pdfService = new PDFService();

        // Initial state
        this.filterState = {
            type: null,
            level: null
        };


        this.currentSpells = [];

        this.init();
    }

    async init() {
        this._bindEvents();
    }

    _bindEvents() {
        // System selector
        const select = document.getElementsByName('sistema')[0];
        if (select) {
            select.addEventListener('change', (e) => this.onSystemChange(e.target.value));
        }

        // PDF Button
        const btn = document.querySelector('#botonpdf button');
        if (btn) {
            btn.onclick = () => this.generatePDF();
        }
    }

    async onSystemChange(systemName) {
        this.uiManager.hideAll();
        this.currentSystem = this.systemRegistry.getSystem(systemName);

        if (!this.currentSystem) return;

        // Reset filters
        this.filterState = { type: null, level: null };

        // Initialize system data if needed (lazy loading)
        // Check if init is done? Better just call it, assuming it handles multiple calls or check internal flag
        if (!this.currentSystem.initialized) {
            await this.currentSystem.init();
            this.currentSystem.initialized = true;
        }

        // Render filter UI
        this.uiManager.renderFilterControls(this.currentSystem, (filterType, value) => {
            this.onFilterChange(filterType, value);
        });
    }

    onFilterChange(type, value) {
        this.filterState[type] = value;

        // If type changed, update system config if necessary
        if (type === 'type') {
            this.currentSystem.selectedType = value;
            this.currentSystem.setSpellType(value);
            // Some systems might change PDF template based on type
        }

        this.updateSpellList();
    }

    updateSpellList() {
        if (!this.filterState.type && !this.filterState.level) {
            this.uiManager.clearSpellList();
            return;
        }

        this.currentSpells = this.currentSystem.getSpells(
            this.filterState.type,
            this.filterState.level
        );

        this.uiManager.renderSpellList(this.currentSpells);
    }

    async generatePDF() {
        if (!this.currentSystem) return;

        // Get selected spells from checkboxes
        const selectedSpellNames = [];

        // We need to iterate over the current displayed list to check IDs
        // UI Manager generates IDs based on index in currentSpells
        this.currentSpells.forEach((spell, index) => {
            const checkbox = document.getElementById(`chechizos${index}`);
            if (checkbox && checkbox.checked) {
                selectedSpellNames.push(spell.nombre); // or spell.name
            }
        });

        // If none selected, maybe print all? Original logic did this.
        let spellsToPrint = selectedSpellNames;
        if (selectedSpellNames.length === 0) {
            // If filter is active and shows spells, print them all
            if (this.currentSpells.length > 0) {
                spellsToPrint = this.currentSpells.map(s => s.nombre);
            } else {
                alert("No hay hechizos seleccionados ni listados para imprimir.");
                return;
            }
        }

        await this.pdfService.generatePDF(this.currentSystem, spellsToPrint);
    }
}
// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.spellApp = new SpellCardApp();
});
