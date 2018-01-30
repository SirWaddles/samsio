import React from 'react';
import Store from './Store';

class StoreContainer extends React.Component {
    constructor(props) {
        super(props);
        if (Array.isArray(props.store)) {
            this.state = props.store.reduce((acc, v) => Object.assign(acc, v.getState()), {});
        } else if (props.store instanceof Store) {
            this.state = props.store.getState();
        } else {
            this.state = Object.keys(props.store).reduce((acc, v) => {
                acc[v] = props.store[v].getState();
            }, {});
        }
    }

    render() {
        var children = this.props.children;
        if (!Array.isArray(children)) return React.cloneElement(children, this.state);
        return children.map((child, i) => {
            return React.cloneElement(child, Object.assign({key: i}, this.state));
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
            this.listenid = Object.keys(this.props.store).map(v => ({
                listen: this.props.store[v].addListener(state => this.setState({[v]: state})),
                store: this.props.store[v],
                key: v,
            }));
        }
    }

    componentWillUnmount() {
        if (Array.isArray(this.props.store)) {
            this.listenid.forEach(v => v.store.removeListener(v.listen));
        } else if (this.props.store instanceof Store) {
            this.props.store.removeListener(this.listenid);
        } else {
            this.listenid.forEach(v => v.store.removeListener(v.listen));
        }
    }
}

export default StoreContainer;
