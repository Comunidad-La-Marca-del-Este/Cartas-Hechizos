/**
 * Registry to manage available game systems.
 * Implements the Simple Factory pattern.
 */
class SystemRegistry {
    constructor() {
        this.systems = new Map();

        // Initialize systems
        this.addSystem(new AeLMdESystem());
        this.addSystem(new CdLMSystem());
    }

    addSystem(system) {
        this.systems.set(system.name, system);
    }

    getSystem(name) {
        return this.systems.get(name);
    }

    getSystemNames() {
        return Array.from(this.systems.keys());
    }
}

// Singleton export
const systemRegistry = new SystemRegistry();
