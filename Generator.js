function ActionGenerator(classType, before, after) {
    let prototype = classType.prototype;
    class NewClass extends classType {
        constructor(...args) {
            super(...args);
        }
    };
    NewClass.prototype = Object.assign(NewClass.prototype, Object.getOwnPropertyNames(prototype).reduce((acc, v) => {
        if (v == 'constructor') return acc;
        acc[v] = function(...args) {
            before.apply(this);
            prototype[v].apply(this, args);
            after.apply(this);
        }
        return acc;
    }, {}));

    return NewClass;
}

export default ActionGenerator
