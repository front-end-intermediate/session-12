# XII State Continued

## Homework

Work on your final projects. They should consist of a simple full stack (front and back end) master / detail view that uses React for the front end and has a backend which can be done in Express with mLab or with a local JSON file. You can use Firebase if you wish however be sure to use the same version of re-base that we used in session 10 - unless you really know what you are doing.

## Reading

A [Redux crash course](https://www.youtube.com/watch?v=93p3LxR9xfM) on YouTube.

## A Simple Redux App

![Image of Interface](/other/interface.png)

```html
App
  Nav
    UserAvatar (needs user prop)
  Body
    Sidebar
      Userstats
        UserAvatar (needs user prop)
    Content
```

This app has the user’s information displayed in two places: in the nav bar at the top-right, and in the sidebar next to the main content.

With pure React (just regular props), we need to store the user’s info high enough in the tree that it can be passed down to the components that need it. In this case, the keeper of user info has to be App.

Then, in order to get the user info down to the components that need it, App needs to pass it along to Nav and Body. They, in turn, need to pass it down again, to UserAvatar and Sidebar. Finally, Sidebar has to pass it down to UserStats:

`App > Nav > UserAvatar`

and

`App > Body > Sidebar > UserStats > UserAvatar`

cd into `redux-test` and run `npm i`.

You can use [React Snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets) to create a few components.

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

```js
import React, { Component } from 'react';

import Nav from './Nav'
import Body from './Body'

class App extends Component {
  render() {
    return (
      <div className="app">
        <Nav />
        <Body />
      </div>
    );
  }
}

export default App;
```

* Create `Nav.js` with a dependency on `UserAvatar` using `rfce`.

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

## Prop Drilling the Nav

Pass the user property from Nav > UserAvatar:


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

Prop drilling is a perfectly valid pattern and core to the way React works. But deep drilling is annoying to write and it gets worse when you have to pass down a lot of props (instead of just one).

There’s a bigger downside to prop drilling though: it creates coupling between components that would otherwise be decoupled. In the example above, Nav needs to accept a user prop and pass it down to UserAvatar, even though Nav does not have any need for the user otherwise.

Tightly-coupled components (like ones that forward props down to their children) are more difficult to reuse, because you’ve got to wire them up with their new parents whenever you use one in a new location.

## Redux to the Rescue

`npm i redux react-redux -S`

We will start with `index.js`:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

import { createStore } from "redux";
import { Provider } from "react-redux";

const initialState = {};

function reducer(state = initialState, action) {
  switch (action.type) {
    // Respond to the SET_USER action and update the state accordingly
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
    <Body />
  </div>
);

export default App;
```

Body doesn't need to know about `user` anymore:

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

Sidebar doesn't need to know about `user` anymore:

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

// mapStateToProps function extracts a single key from state (user) and passes it as the `user` prop
const mapStateToProps = state => ({
  user: state.user
});

// connect() UserStats so it receives the `user` without having to receive it from a component above
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

`UserAvatar` also needs to know about the user in state. Just as in `UserStats` we import `connect` and use `mapSatateToProps`.

```js
import React from 'react';

// import connect
import { connect } from "react-redux";

// This mapStateToProps function extracts a single key from state (user) and passes it as the `user` prop
const mapStateToProps = state => ({
  user: state.user
});

// connect() UserAvatar so it can receive the `user` without having to receive it from a component above
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

Add `<Nav />` in `App.js`:

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

## Adding React

We are continuing with the project from [last class](https://github.com/front-end-intermediate/session-11#adding-react) before moving forward with the below.

```html
<script src='https://unpkg.com/react@16.3.0-alpha.1/umd/react.development.js'></script>
<script src='https://unpkg.com/react-dom@16.3.0-alpha.1/umd/react-dom.development.js'></script>
<script src='https://unpkg.com/babel-standalone@6.15.0/babel.min.js'></script>
```

Keeping the existing vanilla JS app, add the following to the html. Note the new script's type `text/babel` (so we can use JSX):

```html
<hr />
<div id="app"></div>
...
<script type="text/babel" src="js/react-babel.js"></script>
```

Create the new js file and implement the main App component.

```js
class App extends React.Component {
  render(){
    return(
      <React.Fragment>
        React app
      </React.Fragment>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
```

Add stubs for List, Weapons and Pirates components:

```js
function List (props) {
  return (
    <ul>
    <li>list</li>
    </ul>
  )
}

class Pirates extends React.Component {
  render() {
    return (
      <React.Fragment>
        Pirates
        <List />
      </React.Fragment>
    )
  }
}

class Weapons extends React.Component {
  render() {
    return (
      <React.Fragment>
        Weapons
        <List />
      </React.Fragment>
    )
  }
}
```

And render them via the main App:

```js
class App extends React.Component {
  render(){
    return(
      <React.Fragment>
        <Pirates />
        <Weapons />
      </React.Fragment>
    )
  }
}
```

## Adding Items

Recall the `addPirate` function in the `dom.js` script:

```js
function addPirate(){
  const input = document.getElementById('pirate')
  const name = input.value
  input.value = ''
  
  store.dispatch(addPirateAction({
    id: generateId(),
    name,
    complete: false,
  }))
}
```

We grabbed the value from the input and then called our store and dispatched `addPirateAction()` with the id, name and a default value for complete.

We will now implement this is the Pirates component using React.

Add a header, input field (using a ref) and a button:

```js
class Pirates extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>Pirate List</h1>
        <input
          type='text'
          placeholder='Add Pirate'
          ref={ (input) => this.input = input }
          />
          <button onClick={this.addItem}>Add Pirate</button>
        <List />
      </React.Fragment>
    )
  }
}
```

Then add the `addItem` function:

```js
class Pirates extends React.Component {

  addItem = (e) => {
    e.preventDefault()
    const name = this.input.value
    this.input.value = ''
    this.props.store.dispatch()
  }

  render() {
    return (
      <React.Fragment>
        <h1>Pirate List</h1>
        <input
          type='text'
          placeholder='Add Pirate'
          ref={ (input) => this.input = input }
          />
          <button onClick={this.addItem}>Add Pirate</button>
        <List />
      </React.Fragment>
    )
  }
}
```

Note that we used `this.props.store` above.

Make the store available to App:

```js
ReactDOM.render(
  <App store={store} />,
  document.getElementById('app')
)
```

Pass the store to the Pirate component via props:

```js
// make the store available to Pirates
class App extends React.Component {
  render(){
    return(
      <React.Fragment>
        <Pirates store ={this.props.store} />
        <Weapons />
      </React.Fragment>
    )
  }
}
```

Now that the Pirates component has access to store we can complete the addItem function:

```js
addItem = (e) => {
  e.preventDefault()
  const name = this.input.value
  this.input.value = ''
  this.props.store.dispatch(addPirateAction({
    id: generateId(),
    name,
    complete: false
  }))
}
```

You should now be able to add a pirate to state. 

Note that it shows up in the vanilla js (VJS) app. VJS is using the same store as our react app and we haven't implemented list in our React app yet. In effect, we have two apps which are sharing the same state.

## Dispatching Weapons

Pass store as props to the weapons component.

```js
class App extends React.Component {
  render(){
    return(
      <React.Fragment>
        <Pirates store ={this.props.store} />
        <Weapons store ={this.props.store} />
      </React.Fragment>
    )
  }
}
```

Edit Weapons to add a header, an input field and button as well:

```js
class Weapons extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>Weapon List</h1>
        <input 
          type='text'
          placeholder='Add Weapon'
          ref={ (input) => this.input = input }
          />
          <button onClick={this.addItem}>Add Weapon</button>
        <List />
      </React.Fragment>
    )
  }
}
```

Add the addItem function to Weapons:

```js
class Weapons extends React.Component {

  addItem = (e) => {
    e.preventDefault()
    const name = this.input.value
    this.input.value = ''
    this.props.store.dispatch(addWeaponAction({
      id: generateId(),
      name
    }))
  }

  render() {
    return (
      <React.Fragment>
        <h1>Weapon List</h1>
        <input 
          type='text'
          placeholder='Add Weapon'
          ref={ (input) => this.input = input }
          />
          <button onClick={this.addItem}>Add Weapon</button>
        <List />
      </React.Fragment>
    )
  }
}
```

You should now be able to add a weapon to state.

## Render the Lists

Grab the Pirates and the Weapons state and pass them to thier respective components:

```js
class App extends React.Component {
  render(){
    const { store } = this.props
    const { pirates, weapons } = store.getState()
    return(
      <React.Fragment>
        <Pirates pirates={pirates} store ={store} />
        <Weapons weapons={weapons} store ={store} />
      </React.Fragment>
    )
  }
}
```

Now the Pirates and Weapons component receive their respective states.

Pirates component:

```js
<List items={this.props.pirates}/>
```

Weapons component"

```js
<List items={this.props.weapons}/>
```

Inside the List component we want to take in the props and map through them to show them in the view. 

```js
function List (props) {
  return (
    <ul>
      {props.items.map((item) => (
        <li key={item.id}>
          <span>
            {item.name}
          </span>
        </li>
      ))}
    </ul>
  )
}
```

The list component isn't receiving any items.

This is because our App component isn't listening for changes to state. In our VJS app we used `store.subscribe()` to listen for updates to state:

```js
store.subscribe(() => {
  const { weapons, pirates } = store.getState()

  document.getElementById('pirates').innerHTML = ''
  document.getElementById('weapons').innerHTML = ''

  pirates.forEach(addPirateToDom)
  weapons.forEach(addWeaponToDom)
})
```

We want to cause a re-render which would normally be done by using `setState()`. But we do not have any state inside the App component. 

We will use a component lifecycle method and `forceUpdate()`:

```js
class App extends React.Component {

  componentDidMount () {
    const { store } = this.props
    store.subscribe( () => this.forceUpdate())
  }

  render(){
    const { store } = this.props
    const { pirates, weapons } = store.getState()
    return(
      <React.Fragment>
        <Pirates pirates={pirates} store ={store} />
        <Weapons weapons={weapons} store ={store} />
      </React.Fragment>
    )
  }
}
```

`forceUpdate()` triggers React's render() method. It is a bit of a hack at the moment but we will get rid of it soon. The alternative would be to add state to the App component but since we are going to implement state outside the react app we will live with it for now.

## Remove Items

Add remove item to the react slice.

The List component should take another prop - remove: `<button onClick={ () => props.remove(item)}>✖︎</button>`.

```js
function List (props) {
  return (
    <ul>
      {props.items.map((item) => (
        <li key={item.id}>
          <span>
            {item.name}
          </span>
          <button onClick={ () => props.remove(item)}>✖︎</button>
        </li>
      ))}
    </ul>
  )
}
```

We passed in the item that should be removed. Now we need to create `removeItem()` inside the Pirates and Weapons components as well as pass it to the List component:

```js
removeItem = (weapon) => {
  this.props.store.dispatch(removePirateAction(weapon.id))
}
```

```js
<List
items={this.props.pirates}
remove={this.removeItem}
/>
```

As follows:

```js
class Pirates extends React.Component {
  addItem = (e) => {
    e.preventDefault()
    const name = this.input.value
    this.input.value = ''
    this.props.store.dispatch(addPirateAction({
      id: generateId(),
      name,
      complete: false
    }))
  }

  removeItem = (pirate) => {
    this.props.store.dispatch(removePirateAction(pirate.id))
  }

  render() {
    return (
      <React.Fragment>
        <h1>Pirate List</h1>
        <input 
          type='text'
          placeholder='Add Pirate'
          ref={ (input) => this.input = input }
          />
          <button onClick={this.addItem}>Add Pirate</button>
          <List
          items={this.props.pirates}
          remove={this.removeItem}
          />
      </React.Fragment>
    )
  }
}
```

And in the Weapons component.

```js
class Weapons extends React.Component {

  addItem = (e) => {
    e.preventDefault()
    const name = this.input.value
    this.input.value = ''
    this.props.store.dispatch(addWeaponAction({
      id: generateId(),
      name
    }))
  }

  removeItem = (weapon) => {
    this.props.store.dispatch(removeWeaponAction(weapon.id))
  }

  render() {
    return (
      <React.Fragment>
        <h1>Weapon List</h1>
        <input 
          type='text'
          placeholder='Add Weapon'
          ref={ (input) => this.input = input }
          />
          <button onClick={this.addItem}>Add Weapon</button>
          <List
          items={this.props.weapons}
          remove={this.removeItem}
          />
      </React.Fragment>
    )
  }
}
```

## Toggle

Add the toggle functionality that marks a Pirate as spotted.

The action in `scripts.js` is `togglePirate`. Add a method to the Pirate component:

```js
toggleItem = (id) => {
  this.props.store.dispatch(togglePirateAction(id))
}
```

And pass it as a prop to the List component:

```js
class Pirates extends React.Component {
  addItem = (e) => {
    e.preventDefault()
    const name = this.input.value
    this.input.value = ''
    this.props.store.dispatch(addPirateAction({
      id: generateId(),
      name,
      complete: false
    }))
  }

  removeItem = (pirate) => {
    this.props.store.dispatch(removePirateAction(pirate.id))
  }

  toggleItem = (id) => {
    this.props.store.dispatch(togglePirateAction(id))
  }

  render() {
    return (
      <React.Fragment>
        <h1>Pirate List</h1>
        <input
          type='text'
          placeholder='Add Pirate'
          ref={ (input) => this.input = input }
          />
          <button onClick={this.addItem}>Add Pirate</button>
          <List
          items={this.props.pirates}
          remove={this.removeItem}
          toggle={this.toggleItem}
          />
      </React.Fragment>
    )
  }
}
```

And call it in the List component:

```js
function List (props) {
  return (
    <ul>
      {props.items.map((item) => (
        <li key={item.id}>
          <span onClick={ () => props.toggle(item.id)}>
            {item.name}
          </span>
          <button onClick={ () => props.remove(item)}>X</button>
        </li>
      ))}
    </ul>
  )
}
```

Because weapons don't use toggle we need to test for the function before we call it:

```js
function List (props) {
  return (
    <ul>
      {props.items.map((item) => (
        <li key={item.id}>
          <span onClick={ () => props.toggle && props.toggle(item.id)}>
            {item.name}
          </span>
          <button onClick={ () => props.remove(item)}>X</button>
        </li>
      ))}
    </ul>
  )
}
```

Now we can add styling:

```js
function List (props) {
  return (
    <ul>
      {props.items.map((item) => (
        <li key={item.id}>
          <span onClick={ () => props.toggle && props.toggle(item.id)}
          style={ {textDecoration: item.complete ? 'line-through' : 'none'} }>
            {item.name}
          </span>
          <button onClick={ () => props.remove(item)}>X</button>
        </li>
      ))}
    </ul>
  )
}
```

## Asynchronous Data

Delete the VJS UI

```html
<!-- <div>
  <h1>Pirate List</h1>
  <input id='pirate' type='text' placeholder="Add Pirate">
  <button id='pirateBtn'>Add Pirate</button>
  <ul id='pirates'></ul>
</div>

<div>
  <h1>Weapon List</h1>
  <input id='weapon' type='text' placeholder="Add Weapon">
  <button id='weaponBtn'>Add Weapon</button>
  <ul id='weapons'></ul>
</div> -->
```

Disconnect from `dom.js`.

```html
<!-- <script type='text/javascript' src="js/dom.js"></script> -->
```

And add some of the script in `dom.js` to our `react-babel.js` script:

```js
const store = Redux.createStore(Redux.combineReducers({
  pirates,
  weapons
}), Redux.applyMiddleware(checker, logger))

store.subscribe(() => {
  const { weapons, pirates } = store.getState()

  // document.getElementById('pirates').innerHTML = ''
  // document.getElementById('weapons').innerHTML = ''

  // pirates.forEach(addPirateToDom)
  // weapons.forEach(addWeaponToDom)
})

function generateId() {
  return Date.now()
}
```

Examine and add a script for a mock api.

```html
<script src="http://daniel.deverell.com/index.js"></script>
```

Its offers an IIFE. Try examining it in the console.

```js
> API
```

And a 'fail' function (once every five times). Default values via fetch pirates and fetch weapons.

`App`:

```js
  componentDidMount () {

    const { store } = this.props

    Promise.all([
      API.fetchPirates(),
      API.fetchWeapons()
    ]).then( ([pirates, weapons]) => {
      console.log('pirates', pirates)
      console.log('weapons', weapons)
    })
    
    store.subscribe( () => this.forceUpdate())
  }
```

Instead of logging we want to add the tiems to our Redux store. But we do not have an appropriate action creator for multiple items.

In `scripts.js`:

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
    case ADD_PIRATE : 
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

Now we can run our action using `store.dispatch`:

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

Place a new piece of state inside the Redux store using a new reducer function.

In `scripts.js`:

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

Add the reducer to our reducers list:

```js
const store = Redux.createStore(Redux.combineReducers({
  pirates,
  weapons,
  loading
}), Redux.applyMiddleware(checker, logger))
```

And finally, add an if statement that checks for loading to the render function of App:

```js
class App extends React.Component {
...
  render(){
    const { store } = this.props
    const { pirates, weapons, loading } = store.getState()

    if (loading === true) {
      return <h3>Loading...</h3>
    }

...
}
```



