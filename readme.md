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

```js
// rcc (version 2)
import React, { Component } from 'react';

class Body extends Component {
  render() {
    return (
      <div>
        
      </div>
    );
  }
}

export default Body;

// rfce
import React from 'react'

function Body() {
  return (
    <div>
      
    </div>
  )
}

export default Body
```

## The React App - props

Create `App.js` with dependencies on `Nav` and `Body` using `rcc (version 2)`.

Create `Nav.js` with a dependency on `UserAvatar` using `rfce`.

Run the app with `npm start`.

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

`Nav.sj`:

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
    User Avatar
  </div>
);

export default UserAvatar
```

We have passed `user` to the 

In terms of prop drilling - it works just fine. Prop drilling is a perfectly valid pattern and core to the way React works. But deep drilling can be annoying to write and it gets more annoying when you have to pass down a lot of props (instead of just one).

There’s a bigger downside to prop drilling though: it creates coupling between components that would otherwise be decoupled. In the example above, Nav needs to accept a user prop and pass it down to UserAvatar, even though Nav does not have any need for the user otherwise.

Tightly-coupled components (like ones that forward props down to their children) are more difficult to reuse, because you’ve got to wire them up with their new parents whenever you use one in a new location.

## DEMO2

The user info has been moved to the Redux store, which means we can use react-redux’s connect function to directly inject the user prop into components that need it.

This is a big win in terms of decoupling. Take a look at Nav, Body, and Sidebar and you’ll see that they’re no longer accepting and passing dow the user prop. No more needless coupling.





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

