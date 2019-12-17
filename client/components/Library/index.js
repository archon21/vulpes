import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getAudio,
  destroyAudio,
  editSongData,
  appInteraction,
  addPlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist
} from '../../store';
import LibraryCard from './LibraryCard';
import LibraryPlaylists from './LibraryPlaylists';

class Library extends Component {
  state = {
    playlist: 'Songs',
    playlistName: ''
  };

  componentDidUpdate(prevProps) {
    if (this.props.audioID !== prevProps.audioID) {
      this.setState({});
    }
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSelectItem = (id, song) => {
    const { audioURL, audioID } = this.props;

    if (audioURL) {
      this.props.destroyAudio();
    }
    const storageRef = song.location;
    this.props.getAudio(storageRef, song, id);
  };

  handlePopup = (event, id, song) => {
    const { user } = this.props;
    const { playlist } = this.state;
    event.stopPropagation();
    const { pageX, pageY } = event;
    if (id) {
      this.props.appInteraction(
        'popup',
        true,
        <div className="popup popup__container flex column align-center maxw-200px minw-100px">
          <button
            // onClick={() => this.props.addPlaylist()}
            type="button"
            className="button-text color-white"
            onClick={event => {
              event.stopPropagation();
              this.props.appInteraction('popup', false);
              this.props.appInteraction(
                'alert',
                true,

                <div className="flex column">
                  {Object.keys(user.playlists).map(playlist => {
                    return (
                      <button
                        type="button"
                        key={playlist}
                        onClick={() =>
                          this.props.addSongToPlaylist(playlist, id, user)
                        }
                        className="button-text headline-6 color-white"
                      >
                        {playlist}
                      </button>
                    );
                  })}
                </div>
                // { screenX: pageX, screenY: pageY }
              );
            }}
          >
            Add To Playlist
          </button>
          {playlist !== 'Songs' && (
            <button
              // onClick={() => this.props.addPlaylist()}
              type="button"
              className="button-text color-white"
              onClick={event => {
                event.stopPropagation();
                this.props.appInteraction('popup', false);
                this.props.appInteraction(
                  'alert',
                  true,

                  <div className="flex column">
                    <span className="headline-6 color-white">
                      Are you sure you want to remove {song.title} from{' '}
                      {playlist}?
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        this.props.removeSongFromPlaylist(playlist, id, user)
                      }
                      className="button color-red"
                    >
                      Remove
                    </button>
                  </div>
                  // { screenX: pageX, screenY: pageY }
                );
              }}
            >
              Remove From Playlist
            </button>
          )}
        </div>,
        { screenX: pageX, screenY: pageY }
      );
    } else {
      this.props.appInteraction('popup', false);
    }
  };

  handleAddPlaylist = () => {
    const { user } = this.props;
    this.props.appInteraction(
      'alert',
      true,
      <form
        onSubmit={event => {
          event.preventDefault();
          const playlistName = document.getElementById('playlistName').value;

          this.props.addPlaylist(playlistName, user);
        }}
        className="card flex row maxw-200px minw-100px"
      >
        <input
          placeholder="Playlist Name"
          id="playlistName"
          className="textfield"
        />
        <button className="button--text" type="submit">
          Add To Playlist
        </button>
      </form>
      // { screenX: pageX, screenY: pageY }
    );
  };

  handleSelectPlaylist = playlist => {
    this.setState({ playlist });
  };

  render() {
    const { playlist } = this.state;
    const { user, audioID } = this.props;
    const { library } = user;

    return (
      <div>
        <div className="library flex column align-center">
          <LibraryPlaylists
            selectedPlaylist={playlist}
            user={user}
            handleSelectPlaylist={this.handleSelectPlaylist}
            handleAddPlaylist={this.handleAddPlaylist}
          />

          {playlist === 'Songs'
            ? Object.entries(library).map(entry => {
                const [id, song] = entry;
                return (
                  <LibraryCard
                    handleSelectItem={this.handleSelectItem}
                    handlePopup={this.handlePopup}
                    song={song}
                    audioID={audioID}
                    id={id}
                  />
                );
              })
            : Object.values(user.playlists[playlist]).map(id => {
                const song = library[id];
                return (
                  <LibraryCard
                    handleSelectItem={this.handleSelectItem}
                    handlePopup={this.handlePopup}
                    song={song}
                    id={id}
                    audioID={audioID}
                  />
                );
              })}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  getAudio: (storageRef, song, id) => dispatch(getAudio(storageRef, song, id)),
  destroyAudio: () => dispatch(destroyAudio()),
  editSongData: (id, user, data) => dispatch(editSongData(id, user, data)),
  appInteraction: (action, status, template, coords) =>
    dispatch(appInteraction(action, status, template, coords)),
  addPlaylist: (name, user) => dispatch(addPlaylist(name, user)),
  addSongToPlaylist: (playlist, id, user) =>
    dispatch(addSongToPlaylist(playlist, id, user)),
  removeSongFromPlaylist: (playlist, id, user) =>
    dispatch(removeSongFromPlaylist(playlist, id, user))
});

const mapStateToProps = state => ({
  user: state.firebase.user,
  audioURL: state.audio.audioURL,
  audioTitle: state.audio.audioTitle,
  audioID: state.audio.audioID,
  audioArtist: state.audio.audioArtist
});

export default connect(mapStateToProps, mapDispatchToProps)(Library);
