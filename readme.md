# XII State Continued

## Homework

Work on your final projects. They should consist of a full stack (front and back end) master / detail view that uses React for the front end and has a backend which can be done in Express with mLab. You can use Firebase if you wish however be sure to use the same version of re-base that we used in session 10 - unless you really know what you are doing.

Implement the React portion of the exercise using Create React App.

## Reading

## A Simple Redux App

![Image of Interface](/other/interface.png)

`npx create-react-app redux-test`

Delete all css, App and related. Create a components folder in src.

`index.js`:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

ReactDOM.render(<App />, document.getElementById('root'));
```

<pre>
App
  Nav
    UserAvatar (needs user prop)
  Body
    Sidebar
      Userstats
        UserAvatar (needs user prop)
    Content
</pre>

This app has the user’s information displayed in two places: in the nav bar at the top-right, and in the sidebar next to the main content.

With pure React (just regular props), we need to store the user’s info high enough in the tree that it can be passed down to the components that need it. In this case, the keeper of user info has to be App.

Then, in order to get the user info down to the components that need it, App needs to pass it along to Nav and Body. They, in turn, need to pass it down again, to UserAvatar and Sidebar. Finally, Sidebar has to pass it down to UserStats:

`App > Nav > UserAvatar`

and

`App > Body > Sidebar > UserStats > UserAvatar`

We will use [React Snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets) to create a few components.

<!-- * A react class component - rcc (version 2)

```js
import React, { Component } from 'react'

export class App extends Component {
  render() {
    return (
      <div>

      </div>
    )
  }
}

export default App
```

* A react functional component - rfce

```js
import React from 'react'

function Nav() {
  return (
    <div>

    </div>
  )
}

export default Nav

``` -->

## The React App - props

* Create `App.js` with dependencies on `Nav` and `Body` using `rcc (version 2)`.
* Create `Nav.js` with a dependency on `UserAvatar` using `rfce`.

```js
import React, { Component } from 'react';

import Nav from './Nav'
import Body from './Body'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Nav />
        <Body />
      </div>
    );
  }
}

export default App;
```

```js
import React from 'react';

import UserAvatar from './UserAvatar'

const Nav = () => (
  <div className="nav">
    <UserAvatar />
  </div>
);

export default Nav
```

Run the app with `npm start`.

## Prop Drilling

App initializes the state to contain the `user` object.

```js
import React, { Component } from 'react';

import Nav from './Nav'
import Body from './Body'

class App extends Component {

  state = {
    user: {
      avatar:
        "https://s.gravatar.com/avatar/3edd11d6747465b235c79bafdb85abe8?s=80",
      name: "Daniel",
      followers: 1234,
      following: 123
    }
  };

  render() {

    const { user } = this.state;

    return (
      <div className="app">
        <Nav user={user} />
        <Body user={user} />
      </div>
    );
  }
}

export default App;
```

Pass the user property to Nav > UserAvatar:

`Nav.js`:

```js
import React from 'react';

import UserAvatar from './UserAvatar'

const Nav = ({user}) => (
  <div className="nav">
    <UserAvatar user={user} />
  </div>
);

export default Nav
```

`UserAvatar.js`:

```js
import React from 'react';

const UserAvatar = () => (
  <div className="user-avatar">
    UserAvatar
  </div>
);

export default UserAvatar
```

## Prop Drilling the Nav

`Nav.js`:

```js
import React from 'react';

import UserAvatar from './UserAvatar'

const Nav = ({ user }) => (
  <div className="nav">
    <UserAvatar user={user} size="small" />
  </div>
);

export default Nav
```

## Prop Drilling the Sidebar

Body

```js
import React from 'react';

import Sidebar from './Sidebar'
import Content from './Content'

const Body = ({user}) => (
  <div className="body">
    <Sidebar user={user} />
    <Content />
  </div>
);

export default Body
```

Sidebar

```js
import React from 'react';

import UserStats from './UserStats'

const Sidebar = ({user}) => (
  <div className="sidebar">
    <UserStats user={user} />
  </div>
);

export default Sidebar
```

UserStats:

```js
import React from 'react';

import UserAvatar from './UserAvatar'

const UserStats = ({user}) => (
  <div className="UserStats">
    <UserAvatar user={user} />
  </div>
);

export default UserStats
```

`UserAvatar.js`:

```js
import React from 'react';

const UserAvatar = ({ user, size }) => (
  <img
    className={`user-avatar ${size || ""}`}
    alt="user avatar"
    src={user.avatar}
  />
);

export default UserAvatar
```

Edit UserStats:

```js
import React from 'react';

import UserAvatar from './UserAvatar'

const UserStats = ({ user }) => (
  <div className="user-stats">
    <div>
      <UserAvatar user={user} />
      {user.name}
    </div>
    <div className="stats">
      <div>{user.followers} Followers</div>
      <div>Following {user.following}</div>
    </div>
  </div>
);

export default UserStats
```

Prop drilling is a perfectly valid pattern and core to the way React works. But deep drilling can be annoying to write and it gets more annoying when you have to pass down a lot of props (instead of just one).

There’s a bigger downside to prop drilling though: it creates coupling between components that would otherwise be decoupled. In the example above, Nav needs to accept a user prop and pass it down to UserAvatar, even though Nav does not have any need for the user otherwise.

Tightly-coupled components (like ones that forward props down to their children) are more difficult to reuse, because you’ve got to wire them up with their new parents whenever you use one in a new location.

## Redux

`npm i redux react-redux -S`

We will start with `index.js`:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

import { createStore } from "redux";
import { connect, Provider } from "react-redux";

const initialState = {};

function reducer(state = initialState, action) {
  switch (action.type) {
    // Respond to the SET_USER action and update
    // the state accordingly
    case "SET_USER":
      return {
        ...state,
        user: action.user
      };
    default:
      return state;
  }
}

// Create the store with the reducer
const store = createStore(reducer);

// Dispatch an action to set the user (since initial state is empty)
store.dispatch({
  type: "SET_USER",
  user: {
    avatar: "https://s.gravatar.com/avatar/3edd11d6747465b235c79bafdb85abe8?s=80",
    name: "Daniel",
    followers: 1234,
    following: 123
  }
});

// This mapStateToProps function extracts a single key from state (user) and passes it as the `user` prop
const mapStateToProps = state => ({
  user: state.user
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector("#root")
);
```

App doesn't hold state anymore, so it can be a stateless function.

`App.js`:

```js
import React from 'react';

import Nav from './Nav'
import Body from './Body'

const App = () => (
  <div className="app">
    {/* <Nav /> */}
    <Body />
  </div>
);

export default App;
```

```js
import React from 'react';

import Sidebar from './Sidebar'
import Content from './Content'

// Body doesn't need to know about `user` anymore
const Body = () => (
  <div className="body">
    <Sidebar />
    <Content />
  </div>
);

export default Body
```

Sidebar doesn't need to know about `user` anymore.

`Sidebar.js`:

```js
import React from 'react';

import UserStats from './UserStats'

const Sidebar = () => (
  <div className="sidebar">
    <UserStats />
  </div>
);

export default Sidebar
```

UserStats _does_ need to know about the user. So we load `connect` from `react-redux` and `mapSatateToProps`.

```js
import React from 'react';
import { connect } from "react-redux";

import UserAvatar from './UserAvatar'

// This mapStateToProps function extracts a single
// key from state (user) and passes it as the `user` prop
const mapStateToProps = state => ({
  user: state.user
});

// connect() UserStats so it receives the `user` directly,
// without having to receive it from a component above
// (both use the same mapStateToProps function)
const UserStats = connect(mapStateToProps)(({ user }) => (
  <div className="user-stats">
    <div>
      <UserAvatar />
      {user.name}
    </div>
    <div className="stats">
      <div>{user.followers} Followers</div>
      <div>Following {user.following}</div>
    </div>
  </div>
));

export default UserStats
```

`UserAvatar` also needs to know about the user in state. Just as in UserStats we import `connect` and use `mapSatateToProps`.

```js
import React from 'react';

import { connect } from "react-redux";

// This mapStateToProps function extracts a single
// key from state (user) and passes it as the `user` prop
const mapStateToProps = state => ({
  user: state.user
});


// connect() UserAvatar so it receives the `user` directly,
// without having to receive it from a component above

// could also split this up into 2 variables:
//   const UserAvatarAtom = ({ user, size }) => ( ... )
//   const UserAvatar = connect(mapStateToProps)(UserAvatarAtom);
const UserAvatar = connect(mapStateToProps)(({ user, size }) => (
  <img
    className={`user-avatar ${size || ""}`}
    alt="user avatar"
    src={user.avatar}
  />
));

export default UserAvatar
```

Let's do the `App > Nav` portion.

Uncomment `<Nav />` in `App.js`:

```js
const App = () => (
  <div className="app">
    <Nav />
    <Body />
  </div>
);
```

Nav doesn't need to know about `user` anymore.

`Nav.js`:

```js
import React from 'react';

import UserAvatar from './UserAvatar'

const Nav = () => (
  <div className="nav">
    <UserAvatar size="small" />
  </div>
);

export default Nav
```

The user info has been moved to the Redux store, which means we can use react-redux’s connect function to directly inject the user prop into components that need it.

This is a big win in terms of decoupling. Nav, Body, and Sidebar are no longer accepting and passing down the user prop. 

## Asynchronous Data

Add a script for the api.

```html
<script src="http://daniel.deverell.com/index.js"></script>
```

Offers an IIFE.

```js
> API
```

A fail function (once every five times). Default values via fetch pirates and fetch weapons.. 

```js
Promise.all([
  API.fetchPirates(),
  API.fetchWeapons()
]).then( ([pirates, weapons]) => {
  console.log('pirates', pirates)
  console.log('weapons', weapons)
})

store.subscribe( () => this.forceUpdate())
```

```js
const RECEIVE_DATA = 'RECEIVE_DATA'
...
function receiveDataAction( pirates, weapons) {
  return {
    type: RECEIVE_DATA,
    pirates,
    weapons
  }
}
...
function pirates (state = [], action) {
  switch(action.type) {
    case ADD_PIRATE : // use the variable
    return state.concat([action.pirate])
    case REMOVE_PIRATE :
    return state.filter((pirate) => pirate.id !== action.id)
    case TOGGLE_PIRATE :
    return state.map((pirate) => pirate.id !== action.id ? pirate :
    Object.assign({}, pirate, {complete: !pirate.complete})
    )
    case RECEIVE_DATA:
      return action.pirates
    default :
    return state
  }
}
...
function weapons (state = [], action) {
  switch(action.type) {
    case ADD_WEAPON :
    return state.concat([action.weapon])
    case REMOVE_WEAPON :
      return state.filter((weapon) => weapon.id !== action.id)
    case RECEIVE_DATA:
      return action.weapons
    default :
    return state
  }
}
```

```js
componentDidMount () {
  const { store } = this.props

  Promise.all([
    API.fetchPirates(),
    API.fetchWeapons()
  ]).then( ([pirates, weapons]) => {
    store.dispatch(receiveDataAction(pirates, weapons))
    })
  
  store.subscribe( () => this.forceUpdate())
}
```

### Loading...

We will use the Redux store for the state.

```js
function loading(state = true, action) {
  switch (action.type) {
    case RECEIVE_DATA:
      return false
    default:
      return state
  }
}
```


```js
const store = Redux.createStore(Redux.combineReducers({
  pirates,
  weapons,
  loading
}), Redux.applyMiddleware(checker, logger))
```

```js
class App extends React.Component {

  componentDidMount () {
    const { store } = this.props
  
    Promise.all([
      API.fetchPirates(),
      API.fetchWeapons()
    ]).then( ([pirates, weapons]) => {
      store.dispatch(receiveDataAction(pirates, weapons))
      })
    
    store.subscribe( () => this.forceUpdate())
  }

  render(){
    const { store } = this.props
    const { pirates, weapons, loading } = store.getState()

    if (loading === true) {
      return <h3>Loading...</h3>
    }

    return(
      <React.Fragment>
        <Pirates pirates={pirates} store ={store} />
        <Weapons weapons={weapons} store ={store} />
      </React.Fragment>
    )
  }
}
```

### Deleting Items

Update and and database.

