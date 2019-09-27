import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import * as mm from 'music-metadata-browser';
import uuid from 'uuid/v1';
import { storage, db } from '../utilities/firebase';
import { WindoW } from '../sub-components/containers';
import { Fab } from '../sub-components';
import { getSongs, uploadingSong } from '../store';

class Uploader extends Component {
  state = {};

  handleUpload = async event => {
    event.preventDefault();
    const { user } = this.props;
    const file = await event.target.files[0];
    const fileRef = await storage.ref(`/users/${user.uid}/${file.name}`);
    fileRef.put(file).then(async snapshot => {
      const location = await snapshot.ref.getDownloadURL();

      const tagArr = await mm.parseBlob(file).then(tags => {
        return tags;
      });
      const id = uuid();
      const { artist, title } = tagArr.common;
      const song = this.getSongInfo(file, artist, title, location);
      this.props.uploadingSong(id, song);
      db.collection('users')
        .doc(user.uid)
        .collection('library')
        .doc(id)
        .set(song);
    });
  };

  getSongInfo = (file, artist, title, location) => {
    if (!title) {
      const fileNameArr = file.name.split('-');
      if (fileNameArr.length > 1) {
        return {
          title: fileNameArr[1],
          artist: fileNameArr[0],
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

  render() {
    return (
      <div style={{ overflowX: 'hidden' }} className="flex column align-center">
        <Fab
          options={[
            {
              name: 'upload',
              label: 'Upload',
              action: this.handleUpload
            }
          ]}
        />

        <WindoW>
          <form
            className="flex column align-center"
            // onDownloadComplete={this.onDownloadComplete}
            onSubmit={this.requestSongs}
          >
            <label className="button color-tirciary" htmlFor="file-upload">
              image_upload
            </label>
            <input
              type="button"
              onChange={event => this.handleUpload(event)}
              id="file-upload"
              type="file"
              hidden
            />
          </form>
        </WindoW>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  songsToRender: state.util.songsToRender,
  user: state.firebase.user
});

const mapDispatchToProps = dispatch => ({
  getSongs: songsToGet => dispatch(getSongs(songsToGet)),
  uploadingSong: (id, song) => dispatch(uploadingSong(id, song))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Uploader);
