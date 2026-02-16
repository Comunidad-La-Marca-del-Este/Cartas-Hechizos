class CdLMSystem extends GameSystem {
    constructor() {
        super("Crónicas de La Marca");
        this.spellTypeLabel = "Listas de hechizos";
        this.types = {
            "Mago": { "Numero": 4, "PDF": "pdf/TH_CdLM_Hechizos.pdf" },
            "Clerigo": { "Numero": 4, "PDF": "pdf/TH_CdLM_Hechizos.pdf" },
            "Ilusionista": { "Numero": 4, "PDF": "pdf/TH_CdLM_Hechizos.pdf" },
            "Druida": { "Numero": 4, "PDF": "pdf/TH_CdLM_Hechizos.pdf" }
        };
        this.selectedType = null;
        this.levels = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    }

    async init() {
        try {
            const data = await DataLoader.loadJSON("json/TH-Cronicas-de-La-Marca.json");
            this.Hechizos = data.Hechizos;
            this.SpellsByType = {
                "Mago": [],
                "Clerigo": [],
                "Ilusionista": [],
                "Druida": []
            };

            // Populate types
            for (const name in this.Hechizos) {
                const spell = this.Hechizos[name];
                if (spell.Nivel) {
                    for (const type in spell.Nivel) {
                        if (this.SpellsByType[type]) {
                            this.SpellsByType[type].push(name);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Failed to load CdLM spells:", error);
        }
    }

    setSpellType(type) {
        this.selectedType = type;
        if (type && this.types[type]) {
            this.spellsPerCard = this.types[type].Numero;
            this.pdfTemplate = this.types[type].PDF;
        } else {
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
            return allSpells.map(name => ({
                nombre: name,
                nivel: this._getSpellLevel(name, type),
                descripcion: this.Hechizos[name]?.Descripción || ""
            }));
        }

        const levelInt = parseInt(level);
        return allSpells
            .filter(name => this._getSpellLevel(name, type) === levelInt)
            .map(name => ({
                nombre: name,
                nivel: levelInt,
                descripcion: this.Hechizos[name]?.Descripción || ""
            }));
    }

    _getSpellLevel(name, type) {
        return this.Hechizos[name]?.Nivel?.[type] || null;
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
            fields[`TS${idx}`] = [spellData["TS"]];
            fields[`TL${idx}`] = [spellData["TL"]];
            fields[`Componentes${idx}`] = [spellData["Componentes"]];
            fields[`RC${idx}`] = [spellData["RC"]];
            // No Nivel field in this PDF
        }
        return fields;
    }

    getPDFTemplate() {
        return this.pdfTemplate;
    }
}
