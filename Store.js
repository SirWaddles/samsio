var gblListenID = 1;
var gblProcessID = 1;

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

    updateState(obj) {
        Object.assign(this.state, obj);
        this.state = this.processors.reduce((acc, v) => v.process(acc), this.state);
        this.flush();
    }

    flush() {
        for (var key in this.listeners) {
            this.listeners[key](this.state);
        }
    }
}

export default Store;
