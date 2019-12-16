import React, { Component } from 'react';
import * as mm from 'music-metadata-browser';
import { connect } from 'react-redux';
import {
  changeAudioValue,
  getAudio,
  destroyAudio,
  editSongData,
  appInteraction,
  addPlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  changeAudioLocation
} from '../../store';
import LibraryCard from './LibraryCard';
import LibraryPlaylists from './LibraryPlaylists';

class Library extends Component {
  state = {
    minimized: true,
    touchEvent: [false, 0],
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

  handleSelectItem = async (id, song) => {
    const { audio, audioID } = this.props;

    if (audio) {
      await this.props.destroyAudio();
    }
    const storageRef = song.location;
    await this.props.getAudio(storageRef, song, id);
    this.setState({ minimized: false });
  };

  handleMinimize = event => {
    // event.preventDefault();
    const { minimized, touchEvent } = this.state;
    if (event.changedTouches && !touchEvent[0]) {
      this.setState({ touchEvent: [true, event.changedTouches[0].screenY] });
    } else if (event.changedTouches && touchEvent[0]) {
      event.changedTouches[0].screenY > touchEvent[1]
        ? this.setState({ touchEvent: [false, 0], minimized: true })
        : this.setState({ touchEvent: [false, 0], minimized: false });
    } else {
      this.setState({ minimized: !minimized });
    }
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

  handleNext = () => {
    const { playlist, id } = this.state;
    const { user } = this.props;
    let nextSongIndex, nextId;
    if (playlist === 'Songs') {
      const libArr = Object.keys(user.library);
      const index = libArr.findIndex(el => {
        return el === id;
      });
      nextId = libArr.find(el => {
        return el === id;
      });
      nextSongIndex = libArr[index + 1];

      //   var randomSong = function(obj) {
      //     var keys = Object.keys(obj);
      //     return obj[keys[(keys.length * Math.random()) << 0]];
      //   };
    }
    const nextSong = user.library[nextSongIndex];

    this.handleSelectItem(nextId, nextSong);
  };

  handlePlayerClick = event => {
    event.stopPropagation();
    console.log('YOOOOO');
    this.props.changeAudioStatus('TOGGLE', 'audioStatus');
  };

  render() {
    const { minimized, repeat, playlist, shuffle } = this.state;
    const {
      user,
      audio,
      audioTitle,
      audioID,
      audioArtist,
      audioStatus,
      audioArt
    } = this.props;
    const { library } = user;

    return (
      <div>
        {audio && audio[0]}
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
        <div
          onTouchStart={this.handleMinimize}
          onTouchEnd={this.handleMinimize}
          style={{ backgroundImage: audioArt ? audioArt : null }}
          className={`player  ${
            minimized ? 'minimized' : ''
          } flex row align-center w-100`}
        >
          <div
            onClick={this.handleMinimize}
            className="player__title w-100 flex row align-center"
          >
            <div className="w-15" />
            <div className="flex column align-start w-70">
              <span className="body-1 color-white ellipsis">{audioTitle}</span>
              <span className="body-2 color-white ellipsis">{audioArtist}</span>
            </div>
            <button
              style={{ zIndex: '10' }}
              type="button"
              className={`player__top__pause ${
                !minimized ? 'hidden' : ''
              } w-15`}
              onClick={this.handlePlayerClick}
            >
              <i className="material-icons color-white">
                {audioStatus ? 'pause' : 'play_arrow'}
              </i>
            </button>
          </div>
          <img src={audioArt} id="img" className="player__image" />

          <div className="player__controls w-100 flex column align-center">
            {console.log(audio && audio.duration)}
            <input
              onChange={event =>
                this.props.changeAudioLocation(event.target.value)
              }
              type="range"
              min="0"
              max={audio && audio.duration !==NaN &&audio.duration}
              value={() => {
                audio &&
                  setInterval(() => {
                    audio.currentTime;
                  }, 100);
              }}
              class="slider"
              id="myRange"
            />

            <div className="flex row align-center justify-center w-100">
              <button
                style={{ background: 'transparent' }}
                className={
                  shuffle ? 'player__button--filled' : 'player__button--empty'
                }
                type="button"
                onClick={() =>
                  this.props.changeAudioStatus('TOGGLE', 'audioShuffle')
                }
              >
                <i className="material-icons">shuffle</i>
              </button>
              <button
                className="player__button"
                type="button"
                onClick={this.handleNext}
              >
                <i className="material-icons">skip_previous</i>
              </button>
              <button
                className="player__button"
                type="button"
                onClick={this.handlePlayerClick}
              >
                <i className="material-icons">
                  {audioStatus ? 'pause' : 'play_arrow'}
                </i>
              </button>
              <button
                className="player__button"
                type="button"
                onClick={this.handleNext}
              >
                <i className="material-icons">skip_next</i>
              </button>
              <button
                style={{ background: 'transparent' }}
                className={
                  repeat ? 'player__button--filled' : 'player__button--empty'
                }
                type="button"
                onClick={event => {
                  event.stopPropagation();
                  this.props.changeAudioStatus('TOGGLE', 'audioRepeat');
                }}
              >
                <i className="material-icons">repeat</i>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  changeAudioStatus: (key, value) => dispatch(changeAudioValue(key, value)),
  getAudio: (storageRef, song, id) => dispatch(getAudio(storageRef, song, id)),
  destroyAudio: () => dispatch(destroyAudio()),
  editSongData: (id, user, data) => dispatch(editSongData(id, user, data)),
  appInteraction: (action, status, template, coords) =>
    dispatch(appInteraction(action, status, template, coords)),
  addPlaylist: (name, user) => dispatch(addPlaylist(name, user)),
  addSongToPlaylist: (playlist, id, user) =>
    dispatch(addSongToPlaylist(playlist, id, user)),
  removeSongFromPlaylist: (playlist, id, user) =>
    dispatch(removeSongFromPlaylist(playlist, id, user)),
  changeAudioLocation: event => dispatch(changeAudioLocation(event))
});

const mapStateToProps = state => ({
  user: state.firebase.user,
  audio: state.audio.audio,
  audioTitle: state.audio.audioTitle,
  audioID: state.audio.audioID,
  audioArtist: state.audio.audioArtist,
  audioStatus: state.audio.audioStatus,
  audioArt: state.audio.audioArt
});

export default connect(mapStateToProps, mapDispatchToProps)(Library);
