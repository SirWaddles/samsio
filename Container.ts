import React from 'react';
import Store from './Store';

interface ContainerStoreList<SState> {
    [name: string]: Store<SState>;
}
interface ContainerStateList<SState> {
    [name: string]: SState;
}

type TransformFn = (state: any) => any;

type ContainerProps<SState> = {
    store: Store<SState> | Store<SState>[] | ContainerStoreList<SState>;
    transform?: TransformFn;
};

type ListenerIdList<SState> = {
    listen: number;
    store: Store<SState>;
};

type ListenerIdMap<SState> = {
    listen: number;
    store: Store<SState>;
    key: string;
};

type ListenerId<SState> = number | ListenerIdList<SState>[] | ListenerIdMap<SState>[];

class StoreContainer<SState> extends React.Component<ContainerProps<SState>, {}> {
    listenid: ListenerId<SState>;

    constructor(props: ContainerProps<SState>) {
        super(props);
        if (Array.isArray(props.store)) {
            this.state = props.store.reduce((acc, v) => Object.assign(acc, v.getState()), {});
        } else if (props.store instanceof Store) {
            this.state = props.store.getState();
        } else {
            const storeList = props.store as ContainerStoreList<SState>;
            const finalState = {} as ContainerStateList<SState>;
            this.state = Object.keys(storeList).reduce((acc, v) => {
                acc[v] = storeList[v].getState();
                return acc;
            }, finalState);
        }
    }

    render() {
        var children = this.props.children;
        var state = this.state;
        if (this.props.hasOwnProperty('transform')) {
            state = this.props.transform(state);
        }
        if (!Array.isArray(children) && React.isValidElement(children)) return React.cloneElement(children, state);
        return React.Children.map(children, (child, i) => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child, Object.assign({key: i}, state));
            }
            return null;
        });
    }

    componentDidMount() {
        if (Array.isArray(this.props.store)) {
            this.listenid = this.props.store.map(v => ({
                listen: v.addListener(state => this.setState(state)),
                store: v,
            }));
        } else if (this.props.store instanceof Store) {
            this.listenid = this.props.store.addListener((state) => this.setState(state));
        } else {
            const storeList = this.props.store as ContainerStoreList<SState>;
            this.listenid = Object.keys(storeList).map(v => ({
                listen: storeList[v].addListener(state => this.setState({[v]: state})),
                store: storeList[v],
                key: v,
            }));
        }
    }

    componentWillUnmount() {
        if (Array.isArray(this.listenid)) {
            this.listenid.forEach(v => v.store.removeListener(v.listen));
        } else if (this.props.store instanceof Store) {
            this.props.store.removeListener(this.listenid);
        }
    }
}

export default StoreContainer;
