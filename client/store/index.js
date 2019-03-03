import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import util from './util';
import init from './init';

const reducer = combineReducers({ util, init });
let middleware;
process.env.NODE_ENV === 'development'
  ? (middleware = composeWithDevTools(
      applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
    ))
  : (middleware = applyMiddleware(thunkMiddleware));

const store = createStore(reducer, middleware);

export default store;

export * from './util';
export * from './init';
