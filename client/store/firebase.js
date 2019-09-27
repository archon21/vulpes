import { Auth, storage, db } from '../utilities/firebase';

const initialState = {
  user: {}
};

const GOT_USER = 'GOT_USER';
const UPLOADED_SONG = 'UPLOADED_SONG';

const gotUser = user => ({
  type: GOT_USER,
  user
});

const uploadedSong = (id, song) => ({
  type: UPLOADED_SONG,
  song,
  id
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

export const uploadingSong = (id, song) => async dispatch => {
  dispatch(uploadedSong(id, song));
};

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

    default:
      return state;
  }
}
