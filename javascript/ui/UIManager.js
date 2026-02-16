class UIManager {
    constructor() {
        this.dom = {
            systemSelect: document.getElementsByName('sistema')[0],
            divTipo: document.getElementById('divtipo'),
            listaHechizos: document.getElementById('listahechizos'),
            hechizosContainers: [
                document.getElementById('hechizos1'),
                document.getElementById('hechizos2'),
                document.getElementById('hechizos3')
            ],
            btnPdf: document.getElementById('botonpdf')
        };
    }

    /**
     * Renders the filter controls (Type and Level selects)
     * @param {GameSystem} system 
     * @param {Function} onFilterChange Callback when a filter changes
     */
    renderFilterControls(system, onFilterChange) {
        if (!system) {
            this.dom.divTipo.innerHTML = '';
            this.dom.divTipo.style.visibility = 'hidden';
            return;
        }

        const types = system.getSpellTypes();
        const levels = system.getSpellLevels();

        let html = '';

        // Type Select
        html += `<div class='mitad'>
                    <label class='w3-text-blue'><strong>${system.spellTypeLabel}</strong></label>
                    <select class='w3-select' id='filter-type'>
                        <option value="">--Selecciona--</option>`;
        if (types) {
            types.forEach(t => html += `<option value="${t}">${t}</option>`);
        }
        html += `   </select>
                 </div>`;

        // Level Select
        html += `<div class='mitad'>
                    <label class='w3-text-blue'><strong>Nivel</strong></label>
                    <select class='w3-select' id='filter-level'>
                        <option value="">--Selecciona--</option>`;
        if (levels) {
            levels.forEach(l => html += `<option value="${l}">${l}</option>`);
        }
        html += `   </select>
                 </div>`;

        this.dom.divTipo.innerHTML = html;
        this.dom.divTipo.style.visibility = 'visible';

        // Add event listeners
        document.getElementById('filter-type').addEventListener('change', (e) => {
            onFilterChange('type', e.target.value);
        });
        document.getElementById('filter-level').addEventListener('change', (e) => {
            onFilterChange('level', e.target.value);
        });
    }

    /**
     * Renders the list of spells
     * @param {Object[]} spells List of spell objects
     */
    renderSpellList(spells) {
        if (!spells || spells.length === 0) {
            this.clearSpellList();
            return;
        }

        // Clear containers
        this.dom.hechizosContainers.forEach(c => c.innerHTML = '');

        const colHTML = ["<ul>", "<ul>", "<ul>"];

        spells.forEach((spell, index) => {
            const colIndex = index % 3;
            // Generate checkbox ID consistent with logic
            const checkboxId = `chechizos${index}`;

            let label = spell.name || spell.nombre; // Handle both key styles if mixed
            if (spell.nivel !== undefined && spell.nivel !== null) {
                label += ` (Nivel ${spell.nivel})`;
            }

            colHTML[colIndex] += `<li>
                <label>
                    <input type='checkbox' id='${checkboxId}' value='${spell.nombre}' /> 
                    ${label}
                </label>
            </li>`;
        });

        colHTML.forEach((html, i) => {
            this.dom.hechizosContainers[i].innerHTML = html + "</ul>";
        });

        this.dom.listaHechizos.style.visibility = 'visible';
        this.dom.btnPdf.style.visibility = 'visible';
    }

    clearSpellList() {
        this.dom.hechizosContainers.forEach(c => c.innerHTML = '');
        this.dom.listaHechizos.style.visibility = 'hidden';
        this.dom.btnPdf.style.visibility = 'hidden';
    }

    hideAll() {
        this.dom.divTipo.style.visibility = 'hidden';
        this.clearSpellList();
    }
}
