import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import audio from './audio';
import util from './util';
import init from './init';
import firebase from './firebase';

const reducer = combineReducers({ util, audio, init, firebase });
let middleware;
process.env.NODE_ENV === 'development'
  ? (middleware = composeWithDevTools(
      applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
    ))
  : (middleware = applyMiddleware(thunkMiddleware));

const store = createStore(reducer, middleware);

export default store;

export * from './audio';
export * from './util';
export * from './init';
export * from './firebase';
