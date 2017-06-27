import React from 'react';

class StoreContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.store.getState();
    }

    render() {
        var children = this.props.children;
        if (!Array.isArray(children)) return React.cloneElement(children, this.state);
        return React.createElement('div', null, children.map((child, i) => {
            return React.cloneElement(child, this.state);
        }));
    }

    componentDidMount() {
        this.listenid = this.props.store.addListener((state) => this.setState(state));
    }

    componentWillUnmount() {
        this.props.store.removeListener(this.listenid);
    }
}

export default StoreContainer;
