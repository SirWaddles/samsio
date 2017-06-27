var gblListenID = 1;

class Store {
    constructor() {
        this.listeners = {};
        this.state = {};
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
        for (var key in this.listeners) {
            this.listeners[key](this.state);
        }
    }
}

export default Store;
