import React from 'react';

class StoreContainer extends React.Component {
    constructor(props) {
        super(props);
        if (Array.isArray(props.store)) {
            this.state = props.store.reduce((acc, v) => Object.assign(acc, v.getState()), {});
        } else {
            this.state = props.store.getState();
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
        } else {
            this.listenid = this.props.store.addListener((state) => this.setState(state));
        }
    }

    componentWillUnmount() {
        if (Array.isArray(this.props.store)) {
            this.props.listenid.forEach(v => v.store.removeListener(v.listen));
        } else {
            this.props.store.removeListener(this.listenid);
        }
    }
}

export default StoreContainer;
