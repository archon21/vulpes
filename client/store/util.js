import { axiosWrapper } from '../utilities/axios';
// import history from '../history'
import React from 'react';
import axios from 'axios';

const postUrl = `https://archon-mail.herokuapp.com/api/send`;
const localUrl = 'http://localhost:8081/api/send';
const ALERT_INTERACTION = 'ALERT_INTERACTION';
const SENT_MESSAGE = 'SENT_MESSAGE';
const GOT_QUERY = 'GOT_QUERY';
const GOT_SONG = 'GOT_SONG';
const APP_INTERACTION = 'APP_INTERACTION';

const defaultState = {
  alertStatus: false,
  alertTemplate: null,
  songsToRender: [],
  query: {},
  popupStatus: false,
  popupTemplate: null,
  popupCoords: {},
  songToAdd: {}
};

const appInteracted = (action, status, template, coords) => ({
  type: APP_INTERACTION,
  template,
  status,
  action,
  coords
});

const alertInteracted = (status, template, customStyles) => ({
  type: ALERT_INTERACTION,
  status,
  template,
  customStyles
});

const gotSong = (id, song) => ({
  type: GOT_SONG,
  id,
  song
});

const gotQuery = ({ query, items }) => ({
  type: GOT_QUERY,
  query,
  items
});

export const appInteraction = (
  action,
  status,
  template,
  coords
) => dispatch => {
  dispatch(appInteracted(action, status, status ? template : <div />, coords));
};

export const alertInteraction = (
  status,
  template,
  customStyles
) => dispatch => {
  dispatch(alertInteracted(status, status ? template : <div />, customStyles));
};

const sentMessage = message => ({ type: SENT_MESSAGE, message });

export const sendMessage = message => dispatch => {
  try {
    axiosWrapper('post', `send`, message);
    dispatch(sentMessage(message));
  } catch (err) {
    console.error(err);
  }
};

export const getQuery = query => async dispatch => {
  const formatedQuery = query.split(' ').join('-');
  try {
    const local = `http://localhost:5001/vulpes-26185/us-central1/querySongs`;
    const deployedURL =
      'https://us-central1-vulpes-26185.cloudfunctions.net/querySongs';
    const { data } = await axios.post(
      process.env.NODE_ENV === 'development' ? local : deployedURL,
      { query: formatedQuery }
    );
    console.log(data);
    const { items } = data;

    dispatch(gotQuery({ query, items }));
  } catch (err) {
    console.error(err);
  }
};

export const getSong = (
  title,
  url,
  user,
  artist,
  thumbnail
) => async dispatch => {
  try {
    console.log(artist);
    const titleArr = title.split('-');
    const local = `http://localhost:5001/vulpes-26185/us-central1/downloadSong`;
    const deployedURL =
      'https://us-central1-vulpes-26185.cloudfunctions.net/downloadSong';

    const { data } = await axios.post(
      process.env.NODE_ENV === 'development' ? local : deployedURL,

      {
        url,
        title,
        userId: user.uid,
        artist: titleArr.length > 1 ? titleArr[0] : artist,
        thumbnail
      }
    );

    console.log(data);
    const { id, song } = data;

    // const songsToRender = await Promise.all(promiseArr);
    // console.log(songsToRender);
    dispatch(gotSong(id, song));
  } catch (err) {
    console.error(err);
  }
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case ALERT_INTERACTION:
      return {
        ...state,
        alertStatus: action.status,
        alertTemplate: action.template,
        customStyles: action.customStyles
      };
    case APP_INTERACTION:
      return {
        ...state,
        [`${action.action}Status`]: action.status,
        [`${action.action}Template`]: action.template,
        [`${action.action}Coords`]: action.coords ? action.coords : false
      };
    case SENT_MESSAGE:
      return { ...state, message: action.message };
    case GOT_SONG:
      return { ...state, songToAdd: { id: action.id, song: action.song } };
    case GOT_QUERY:
      return { ...state, query: { query: action.query, items: action.items } };
    default:
      return state;
  }
}
