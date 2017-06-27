# Samsio
### Super simple state management stuff

Samsio is a tiny library that I started to use all over the place. Flux, redux, alt, mobx all kind of went way too far to the point of overcomplicating things that seems like they should be simple and easy to learn. This library doesn't have any frills, and very well may not serve your purpose but it seems to do the job for most small to medium sized React SPAs without much issue.

Here's how to do some stuff.

### Stores
```javascript
import Store from 'samsio/Store';

const UserStore = new Store();
UserStore.updateState({
    users: [
        {
            username: 'test',
            email: 'test@example.com',
        }
    ],
    newUserDialogue: false,
});

export default UserStore;
```

That's it. You can use the `updateState` function anywhere in your codebase, but the first one here just sets up your default state for this store.

### React Container
So, you need to get your state somewhere useful. Use the container, it'll update all the child components with props of the chosen store's state.
```javascript
import React from 'react';
import Container from 'samsio/Container';
import UserStore from './UserStore';

class UserDisplay extends React.Component {
    render() {
        return <Container store={UserStore}><UserList /></Container>
    }
}

class UserList extends React.Component {
    render() {
        return <ul>
            {this.props.users.map(v => (<li>v.username</li>))}
        </ul>;
    }
}
```

### Inline state updates
A lot of state updates are really simple, changing a value to true, setting a number to +1. There's really no need for these to be actions unless you listen to buzzwords a lot.
```javascript
import React from 'react';
import UserStore from './UserStore';

class NewUserButton extends React.Component {
    render() {
        return <div onClick={this.newUser.bind(this)}>New User</div>;
    }

    newUser(e) {
        UserStore.updateState({newUserDialogue: true});
    }
}
```

### Actions
However, some actions are inherently more complex, they need reusable, complex logic. But we already have a syntax for reusable pieces of logic, they're called functions.
```javascript
import UserStore from './UserStore';

function AddNewUser(user) {
    UserStore.updateState({
        users: UserStore.getState().users.concat([user])
    });
}

export {AddNewUser};
```

React is a great library, and it's conventions and architectures have become ubiquitous for good reason. The state management area however is complex, overcrowded and nonsensical. I've tried many solutions and none of them seem to merge the usecase for large scale, elegant implementation and short boilerplate with easy-to-start interface and a smooth learning curve.

I've created this for myself to use in the interim until something becomes more standard, it simply cannot do many of the things that the alternatives systems can, but they all seem to do those things at the expense of the developer when it's not going to be useful 95% of the time.
