var gblListenID = 1;
var gblProcessID = 1;

/**
 * Some functions for a deep merge setter. Going to be optional.
 * This is also largely referential, stuff stays intact.
 */
function isObject(obj) {
    return (obj && typeof obj === 'object' && !Array.isArray(obj));
}

function deepMerge(state, assign) {
    if (!isObject(assign) || !isObject(state)) {
        return assign;
    }

    for (let key in assign) {
        state[key] = deepMerge(state[key], assign[key]);
    }

    return state;
}

class Store {
    constructor() {
        this.processors = [];
        this.listeners = {};
        this.state = {};
    }

    addProcessor(processor) {
        gblProcessID++;
        this.processors.push({
            process: processor,
            id: gblProcessID,
        });
        return gblProcessID;
    }

    removeProcessor(processId) {
        this.processors = this.processors.filter(v => v.id !== processId);
    }

    addListener(listener) {
        gblListenID++;
        this.listeners[gblListenID] = listener;
        return gblListenID;
    }

    removeListener(listenId) {
        delete this.listeners[listenId];
    }

    getState() {
        return Object.assign({}, this.state);
    }

    processState() {
        this.state = this.processors.reduce((acc, v) => v.process(acc), this.state);
    }

    updateState(obj) {
        Object.assign(this.state, obj);
        this.processState();
        this.flush();
    }

    deepUpdate(obj) {
        this.state = deepMerge(this.state, obj);
        this.processState();
        this.flush();
    }

    flush() {
        for (var key in this.listeners) {
            this.listeners[key](this.state);
        }
    }
}

export default Store;
