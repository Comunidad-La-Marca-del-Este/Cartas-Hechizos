/**
 * Base class for all game systems.
 * Provides abstract methods for initialization, spell listing, and PDF field mapping.
 * Avoids any UI or DOM manipulation logic.
 */
class GameSystem {
    constructor(name) {
        this.name = name;
        this.description = "";
        this.spells = []; // Raw spell data
        this.types = {};  // Spell type mappings
        this.levels = [];
        this.pdfTemplate = "";
        this.spellsPerCard = 4;
        this.spellTypeLabel = "Tipo de Hechizo";
    }

    /**
     * Initializes the system with loaded data.
     * @abstract
     * @param {Object} data JSON data loaded from file.
     */
    init(data) {
        throw new Error("Method 'init' must be implemented.");
    }

    /**
     * Returns the list of spell types available (e.g., Mago, Clérigo).
     * @returns {string[]}
     */
    getSpellTypes() {
        return Object.keys(this.types);
    }

    /**
     * Returns the available spell levels.
     * @returns {string[]}
     */
    getSpellLevels() {
        return this.levels;
    }

    /**
     * Returns a list of spells filtered by type and level.
     * @param {string} type Spell type (e.g., 'Mago')
     * @param {string|number} level Spell level
     * @returns {Object[]} List of spell objects { name, level, description, etc. }
     */
    getSpells(type, level) {
        throw new Error("Method 'getSpells' must be implemented.");
    }

    /**
     * Maps a list of spell objects to the PDF form fields.
     * @abstract
     * @param {Object[]} spells List of spell objects to map.
     * @returns {Object} Map of field names to values.
     */
    mapSpellsToPDF(spells) {
        throw new Error("Method 'mapSpellsToPDF' must be implemented.");
    }

    getPDFTemplate() {
        // If type is selected, return specific PDF
        // Logic might depend on implementation, but usually:
        return this.pdfTemplate;
    }

    getSpellsPerCard() {
        return this.spellsPerCard;
    }

    /**
     * Helper to get spell level for display
     */
    _formatLevel(level) {
        return level !== null ? `(Nivel ${level})` : "";
    }
}
