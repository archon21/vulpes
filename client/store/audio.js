import { storage } from '../utilities/firebase';

// import { spotify } from '../../secrets';
// const { spotifyID, spotifySecret } = spotify;
// console.log(spotifySecret, spotifyID);

const GOT_AUDIO = 'GOT_AUDIO';
const DESTROYING_AUDIO = 'DESTROYING';

const initialState = {
  audioURL: '',
  audioID: '',
  audioTitle: '',
  audioArtist: ''
};

const gotAudio = ({ audioURL, audioTitle, audioArtist, audioID }) => ({
  type: GOT_AUDIO,
  audioURL,
  audioTitle,
  audioID,
  audioArtist
});

const destroyingAudio = () => ({
  type: DESTROYING_AUDIO
});

export const destroyAudio = () => dispatch => {
  dispatch(destroyingAudio());
};

export const getAudio = (storageRef, song, id) => async dispatch => {
  const audioURL = await storage.refFromURL(storageRef).getDownloadURL();

  dispatch(
    gotAudio({
      audioTitle: song.title,
      audioArtist: song.artist,
      audioID: id,
      audioURL,
      id
    })
  );
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GOT_AUDIO:
      return {
        ...state,
        audioURL: action.audioURL,
        audioArtist: action.audioArtist,
        audioID: action.audioID,
        audioTitle: action.audioTitle
      };

    case DESTROYING_AUDIO:
      return {
        ...state,
        audioID: '',
        audioURL: '',
        audioTitle: '',
        audioArtist: ''
      };
    default:
      return state;
  }
}
