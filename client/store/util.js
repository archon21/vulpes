import { axiosWrapper } from '../utilities/axios';
// import history from '../history'
import React from 'react';
import axios from 'axios';

const postUrl = `https://archon-mail.herokuapp.com/api/send`;
const localUrl = 'http://localhost:8081/api/send';
const ALERT_INTERACTION = 'ALERT_INTERACTION';
const SENT_MESSAGE = 'SENT_MESSAGE';
const GOT_SONGS = 'GOT_SONGS';

const defaultState = {
  alertStatus: false,
  alertTemplate: null,
  songsToRender: []
};

const alertInteracted = (status, template, customStyles) => ({
  type: ALERT_INTERACTION,
  status,
  template,
  customStyles
});

const gotSongs = songsToRender => ({
  type: GOT_SONGS,
  songsToRender
});

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

export const getSongs = songsArr => async dispatch => {
  try {
    const songsToRender = []
    for (let i = 0; i < songsArr.length; i++) {
      let song = songsArr[i];
      let {data} = await axios.post('/api/songs', { song });
      songsToRender.push(data)
    }

    // const songsToRender = await Promise.all(promiseArr);
    console.log(songsToRender);
    dispatch(gotSongs(songsToRender));
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
    case SENT_MESSAGE:
      return { ...state, message: action.message };
    case GOT_SONGS:
      return { ...state, songsToRender: action.songsToRender };
    default:
      return state;
  }
}
