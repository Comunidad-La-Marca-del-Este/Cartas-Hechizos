class AeLMdESystem extends GameSystem {
    constructor() {
        super("Aventuras en La Marca del Este");
        this.spellTypeLabel = "Listas de hechizos";
        this.types = {
            "Mago": { "Numero": 4, "PDF": "pdf/TH_AeLMdE_Hechizos.pdf" },
            "Clérigo": { "Numero": 4, "PDF": "pdf/TH_AeLMdE_Hechizos.pdf" },
            "Elfo": { "Numero": 4, "PDF": "pdf/TH_AeLMdE_Hechizos.pdf" },
            "Elfo oscuro": { "Numero": 4, "PDF": "pdf/TH_AeLMdE_Hechizos.pdf" },
            "Paladín": { "Numero": 4, "PDF": "pdf/TH_AeLMdE_Hechizos.pdf" },
            "Druida": { "Numero": 4, "PDF": "pdf/TH_AeLMdE_Hechizos.pdf" }
        };
        this.selectedType = null;
        this.levels = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    }

    async init() {
        // Loads JSON data using DataLoader.
        try {
            const data = await DataLoader.loadJSON("json/TH-Aventuras-en-LMdE.json");
            this.Hechizos = data.Hechizos;
            this.SpellsByType = {
                "Mago": data.Mago || [],
                "Clérigo": data["Clérigo"] || [],
                "Elfo": data.Elfo || [],
                "Druida": data.Druida || [],
                "Elfo oscuro": data["Elfo oscuro"] || [],
                "Paladín": data["Paladín"] || []
            };
        } catch (error) {
            console.error("Failed to load AeLMdE spells:", error);
        }
    }

    setSpellType(type) {
        this.selectedType = type;
        if (type && this.types[type]) {
            this.spellsPerCard = this.types[type].Numero;
            this.pdfTemplate = this.types[type].PDF;
        } else {
            // Reset if invalid type
            this.spellsPerCard = 4;
            this.pdfTemplate = "";
        }
    }

    getSpellTypes() {
        return Object.keys(this.types);
    }

    getSpells(type, level) {
        if (!type || !this.SpellsByType[type]) return [];

        const allSpells = this.SpellsByType[type];

        if (!level || level === "") {
            // Return all spells for type (mapped to have expected structure)
            return allSpells.map(name => ({
                nombre: name,
                nivel: this._getSpellLevel(name),
                descripcion: this.Hechizos[name]?.Descripción || ""
            }));
        }

        const levelInt = parseInt(level);
        return allSpells
            .filter(name => this._getSpellLevel(name) === levelInt)
            .map(name => ({
                nombre: name,
                nivel: levelInt,
                descripcion: this.Hechizos[name]?.Descripción || ""
            }));
    }

    /**
     * Helper to get spell level from the main 'Hechizos' lookup
     */
    _getSpellLevel(name) {
        return this.Hechizos[name]?.Nivel || null;
    }

    mapSpellsToPDF(spellNames) {
        const fields = {};
        for (let i = 0; i < spellNames.length; i++) {
            const name = spellNames[i];
            const spellData = this.Hechizos[name];
            if (!spellData) continue;

            const idx = i + 1;
            fields[`Nombre${idx}`] = [name];
            fields[`Descripcion${idx}`] = [spellData["Descripción"]];
            fields[`Alcance${idx}`] = [spellData["Alcance"]];
            fields[`Duracion${idx}`] = [spellData["Duración"]];
            fields[`Nivel${idx}`] = [spellData["Nivel"]];
        }
        return fields;
    }

    getPDFTemplate() {
        return this.pdfTemplate;
    }
}
