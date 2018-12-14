import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

import { createStore } from "redux"
import { Provider } from "react-redux"

const initialState = {}

function reducer(state = initialState, action) {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.user
      }
    default:
      return state
  }
}

const store = createStore(reducer)

store.dispatch({
  type: "SET_USER",
    user: {
      avatar:
        "https://s.gravatar.com/avatar/3edd11d6747465b235c79bafdb85abe8?s=80",
      name: "Daniel",
      followers: 1234,
      following: 123
    }
})

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
