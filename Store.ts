var gblListenID = 1;
var gblProcessID = 1;

/**
 * Some functions for a deep merge setter. Going to be optional.
 * This is also largely referential, stuff stays intact.
 */
function isObject(obj: any): boolean {
    return (obj && typeof obj === 'object' && !Array.isArray(obj));
}

function deepMerge(state: any, assign: any) {
    if (!isObject(assign) || !isObject(state)) {
        return assign;
    }

    for (let key in assign) {
        state[key] = deepMerge(state[key], assign[key]);
    }

    return state;
}

type ProcessFn = (state: StoreState) => void;
type ListenerFn = (state: StoreState) => void;

type Processor = {
    process: ProcessFn;
    id: number;
};

type StoreState = any;

class Store {
    processors: Processor[];
    state: StoreState;
    listeners: Map<number, ListenerFn>;

    constructor() {
        this.processors = [];
        this.listeners = new Map();
        this.state = {};
    }

    addProcessor(processor: ProcessFn) {
        gblProcessID++;
        this.processors.push({
            process: processor,
            id: gblProcessID,
        });
        return gblProcessID;
    }

    removeProcessor(processId: number) {
        this.processors = this.processors.filter(v => v.id !== processId);
    }

    addListener(listener: ListenerFn) {
        gblListenID++;
        this.listeners.set(gblListenID, listener);
        return gblListenID;
    }

    removeListener(listenId: number) {
        this.listeners.delete(listenId);
    }

    getState() {
        return Object.assign({}, this.state);
    }

    processState() {
        this.state = this.processors.reduce((acc, v) => v.process(acc), this.state);
    }

    updateState(obj: any) {
        Object.assign(this.state, obj);
        this.processState();
        this.flush();
    }

    deepUpdate(obj: any) {
        this.state = deepMerge(this.state, obj);
        this.processState();
        this.flush();
    }

    flush() {
        for (let listen of this.listeners) {
            listen[1](this.state);
        }
    }
}

export { StoreState };

export default Store;
