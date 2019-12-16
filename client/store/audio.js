import { storage } from '../utilities/firebase';

import * as mm from 'music-metadata-browser';

// import { spotify } from '../../secrets';
// const { spotifyID, spotifySecret } = spotify;
// console.log(spotifySecret, spotifyID);

const getCoverArt = unit8 => {
  const string = String.fromCharCode.apply(null, unit8);
  const base64 = btoa(string);

  return `data:image/png;base64, ${base64}`;
};

const CHANGING_AUDIO = 'CHANGING_AUDIO';
const GOT_AUDIO = 'GOT_AUDIO';
const DESTROYING_AUDIO = 'DESTROYING';
const TOGGLE = 'TOGGLE';
const CHANGING_AUDIO_LOCATION = 'CHANGING_AUDIO_LOCATION';

const initialState = {
  audio: null,
  audioRepeat: false,
  audioID: '',
  audioStatus: false,
  audioArt: '',
  audioShuffle: false,
  audioTitle: '',
  audioArtist: ''
};

const gotAudio = ({
  audio,
  audioTitle,
  audioArtist,
  audioID,
  audioStatus,
  audioArt
}) => ({
  type: GOT_AUDIO,
  audio,
  audioTitle,
  audioID,
  audioArtist,
  audioStatus,
  audioArt
});

const changingAudio = (action, key) => ({
  type: action,
  key
});

const destroyingAudio = () => ({
  type: DESTROYING_AUDIO
});

export const changeAudioValue = (key, value) => dispatch => {
  dispatch(changingAudio(key, value));
};

export const destroyAudio = () => dispatch => {
  dispatch(destroyingAudio());
};

const changeingAudioLocation = location => ({
  type: CHANGING_AUDIO_LOCATION,
  location
});

export const getAudio = (storageRef, song, id) => async dispatch => {
  try {
    const url = await storage.refFromURL(storageRef).getDownloadURL();

    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';

    xhr.onload = async () => {
      var blob = xhr.response;
      const tagArr = await mm.parseBlob(blob).then(tags => {
        return tags;
      });
      const audio = new Audio(url);
      audio.id = id;
      audio.play();
      const audioArt = await getCoverArt(tagArr.common.picture[0].data);
      dispatch(
        gotAudio({
          audioTitle: song.title,
          audioArtist: song.artist,
          audioID: id,
          audio,
          audioArt,
          audioStatus: true,
          id
        })
      );

      //   const unit9 = new Uint8Array(tagArr.images[0].data);
      //   const string = String.fromCharCode.apply(null, unit9);
      //   let base64 = btoa(string);

      //   const img = document.getElementById('img');
      //   img.src = `data:image/png;base64, ${base64}`;
    };
    // xhr.withCredentials = true;
    xhr.open('GET', url);

    xhr.send();
  } catch (err) {
    return 'Audio Failed';
  }
};

export const changeAudioLocation = location => dispatch => {
  console.log(location);
  dispatch(changeingAudioLocation(location));
};

// export const logout = () => dispatch => {
//   Auth.signOut()
//     .then(() => dispatch(loggedOut()))
//     .catch(err => console.error(err));
// };

export default function(state = initialState, action) {
  switch (action.type) {
    case GOT_AUDIO:
      return {
        ...state,
        audio: action.audio,
        audioStatus: action.audioStatus,
        audioArtist: action.audioArtist,
        audioArt: action.audioArt,
        audioID: action.audioID,
        audioTitle: action.audioTitle
      };
    case TOGGLE:
      switch (action.key) {
        case 'audioStatus':
          state[action.key] ? state.audio.pause() : state.audio.play();
        default:
          break;
      }
      return {
        ...state,
        [action.key]: !state[action.key]
      };
    case CHANGING_AUDIO_LOCATION:
      state.audio.currentTime = action.location;
      return { ...state };

    case DESTROYING_AUDIO:
      state.audio.pause();
      state.audio.removeAttribute('src'); // empty source
      state.audio.load();
      return {
        ...state,
        audio: null,
        audioID: '',
        audioStatus: false,
        audioArt: '',
        audioTitle: '',
        audioArtist: ''
      };
    default:
      return state;
  }
}
