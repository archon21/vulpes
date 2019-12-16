import { Auth, storage, db } from '../utilities/firebase';
import axios from 'axios';
import * as mm from 'music-metadata-browser';
import uuid from 'uuid/v1';
import { spotify } from '../../secrets';
const { spotifyID, spotifySecret } = spotify;

console.log(spotifySecret, spotifyID);

const getSongInfo = async (file, artist, title, location) => {
  const fileNameArr = file.name.split('-');
  if (!title) {
    // let { data } = await axios({
    //   url: 'https://accounts.spotify.com/api/token',
    //   withCredentials: true,
    //   method: 'post',
    //   // params: {

    //   // },
    //   data: {
    //     grant_type: 'client_credentials'
    //   },
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //     Authorization: `Basic ${Buffer.from(spotifyID + ':' + spotifySecret).toString('base64')}`,

    //   }
    // });
    // console.log(data);
    // { data } = await axios({
    //   url: `https://api.spotify.com/v1/search?q=${fileNameArr[0]}&type=track&market=US`,
    //   method: 'get'
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   },
    //   auth: {
    //     username: spotifyID,
    //     password: spotifySecret
    //   }
    // });
    // console.log(data);
    if (fileNameArr.length > 1) {
      return {
        title: fileNameArr[0],
        artist: fileNameArr[1],
        location
      };
    } else {
      return {
        title: file.name,
        artist: '',
        location
      };
    }
  } else {
    return {
      title: !title ? file.name.split('-')[0] : title,
      artist: artist ? artist : file.name.split('-')[1],
      location
    };
  }
};

const initialState = {
  user: {}
};

const GOT_USER = 'GOT_USER';
const UPLOADED_SONG = 'UPLOADED_SONG';
const ADDED_PLAYLIST = 'ADDED_PLAYLIST';

const gotUser = user => ({
  type: GOT_USER,
  user
});

const uploadedSong = (id, song) => ({
  type: UPLOADED_SONG,
  song,
  id
});

const editedSongData = (id, song) => ({
  type: UPLOADED_SONG,
  song,
  id
});

const addedPlaylist = playlists => ({
  type: ADDED_PLAYLIST,
  playlists
});

export const auth = (userData, inSession) => async dispatch => {
  try {
    let user;
    if (!inSession) {
      user = await Auth.signInWithEmailAndPassword(
        userData.email,
        userData.password
      );
    } else {
      user = { user: userData };
    }
    const library = {};
    const userDocRef = db.collection('users').doc(user.user.uid);
    const userLibraryDocRef = db
      .collection('users')
      .doc(user.user.uid)
      .collection('library');
    const userDoc = await userDocRef.get();
    await userLibraryDocRef.get().then(snapshot => {
      snapshot.forEach(doc => {
        library[doc.id] = doc.data();
      });
    });

    dispatch(
      gotUser({
        uid: user.user.uid,
        ...userDoc.data(),
        library
      })
    );
  } catch (err) {
    return 'Invalid Username or Password';
  }
};
// export const logout = () => dispatch => {
//   Auth.signOut()
//     .then(() => dispatch(loggedOut()))
//     .catch(err => console.error(err));
// };

export const uploadingSong = (file, user) => async dispatch => {
  const fileRef = await storage.ref(`/users/${user.uid}/${file.name}`);
  fileRef.put(file).then(async snapshot => {
    const location = await snapshot.ref.getDownloadURL();
    const tagArr = await mm.parseBlob(file).then(tags => {
      // console.log(tags);
      return tags;
    });
    // console.log(tagArr);
    const id = uuid();
    const { artist, title } = tagArr.common;
    const song = await getSongInfo(file, artist, title, location);

    db.collection('users')
      .doc(user.uid)
      .collection('library')
      .doc(id)
      .set(song);
    dispatch(uploadedSong(id, song));
  });
};

export const editSongData = (id, user, data) => async dispatch => {
  try {
    const songDataRef = db
      .collection('users')
      .doc(user.uid)
      .collection('library')
      .doc(id);
    await songDataRef.set(data);
    dispatch(editedSongData(id, data));
  } catch (err) {
    console.error(err);
  }
};

export const addPlaylist = (name, user) => async dispatch => {
  try {
    const newPlaylists = { ...user.playlists, [name]: [] };
    await db
      .collection('users')
      .doc(user.uid)
      .update({ playlists: newPlaylists });
    dispatch(addedPlaylist(newPlaylists));
  } catch (err) {
    console.error(err);
  }
};

export const addSongToPlaylist = (playlist, id, user) => async dispatch => {
  try {
    const { playlists } = user;
    playlists[playlist].push(id);
    await db
      .collection('users')
      .doc(user.uid)
      .update({ playlists });
    dispatch(addedPlaylist(playlists));
  } catch (err) {
    console.error(err);
  }
};

export const removeSongFromPlaylist = (
  playlist,
  id,
  user
) => async dispatch => {
  try {
    const { playlists } = user;

    const newPlaylistData = playlists[playlist].reduce((acc, curr) => {
      if (curr !== id) acc.push(curr);
      return acc;
    }, []);
    playlists[playlist] = newPlaylistData;
    await db
      .collection('users')
      .doc(user.uid)
      .update({ playlists });
    dispatch(addedPlaylist(playlists));
  } catch (err) {
    console.error(err);
  }
};

export const addTempSong = ((id, song) => dispatch => {
  dispatch(uploadedSong(id, song));
});

export default function(state = initialState, action) {
  switch (action.type) {
    case GOT_USER:
      return {
        ...state,
        user: action.user
      };

    case UPLOADED_SONG:
      return {
        ...state,
        user: {
          ...state.user,
          library: { ...state.user.library, [action.id]: { ...action.song } }
        }
      };
    case ADDED_PLAYLIST:
      return {
        ...state,
        user: {
          ...state.user,
          playlists: action.playlists
        }
      };

    default:
      return state;
  }
}
