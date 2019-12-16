import React, { Component } from 'react';
import { connect } from 'react-redux';

import { WindoW } from '../sub-components/containers';
import { Fab } from '../sub-components';
import { uploadingSong } from '../store';

class Uploader extends Component {
  state = {};

  handleUpload = async event => {
    event.preventDefault();
    const { user } = this.props;
    const file = await event.target.files[0];
    this.props.uploadingSong(file, user);
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
  uploadingSong: (file, user) => dispatch(uploadingSong(file, user))
});
export default connect(mapStateToProps, mapDispatchToProps)(Uploader);
