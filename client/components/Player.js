import React, { Component } from 'react';
import * as mm from 'music-metadata-browser';
import { storage } from '../utilities/firebase';
import { connect } from 'react-redux';

class Player extends Component {
  state = {
    id: '',
    playing: false,
    title: '',
    artist: '',
    audio: null,
    minimized: true,
    touchEvent: [false, 0],
    playlist: 'Songs',
    repeat: false,
    shuffle: false
  };

  async componentDidMount() {
    const { audio } = this.props;
  }

  componentWillUnmount() {
    const { audio } = this.state;
  }

  handleSelectItem = (id, song) => {
    if (this.state.audio) {
      this.handleDestroyAudio();
    }
    const storageRef = song.location;
    let tagArr;
    storage
      .refFromURL(storageRef)
      .getDownloadURL()
      .then(url => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';

        xhr.onload = async () => {
          var blob = xhr.response;

          tagArr = await mm.parseBlob(blob).then(tags => {
            return tags;
          });
          const audio = new Audio(storageRef);
          audio.play();
          this.getCoverArt(tagArr.common.picture[0].data);
          this.setState({
            title: song.title,
            artist: song.artist,
            audio,
            minimized: false,
            playing: true,
            id
          });

          //   const unit9 = new Uint8Array(tagArr.images[0].data);
          //   const string = String.fromCharCode.apply(null, unit9);
          //   let base64 = btoa(string);

          //   const img = document.getElementById('img');
          //   img.src = `data:image/png;base64, ${base64}`;
        };
        // xhr.withCredentials = true;
        xhr.open('GET', url);

        xhr.send();
      })
      .catch(function(err) {
        console.error(err);
      });
  };

  getCoverArt = unit8 => {
    const string = String.fromCharCode.apply(null, unit8);
    const base64 = btoa(string);
    const img = document.getElementById('img');
    img.src = `data:image/png;base64, ${base64}`;
  };

  handleDestroyAudio = () => {
    const { audio } = this.state;
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
  };

  handlePlay = async event => {
    event.stopPropagation();
    const { audio, playing } = this.state;
    const newStatus = !playing ? audio.play() : audio.pause();
    this.setState({ playing: newStatus });
  };

  handleRepeat = () => {
    const { repeat, audio } = this.state;

    const newStatus = !repeat;
    audio.loop = newStatus;
    this.setState({ repeat: newStatus });
  };

  handleMinimize = event => {
    event.preventDefault()
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
          return el === id
      })
      nextSongIndex = libArr[index + 1];

      //   var randomSong = function(obj) {
      //     var keys = Object.keys(obj);
      //     return obj[keys[(keys.length * Math.random()) << 0]];
      //   };
    }
    const nextSong = user.library[nextSongIndex]

    this.handleSelectItem(nextId, nextSong);
  };

  render() {
    const {
      title,
      artist,
      playing,
      minimized,
      repeat,
      playlist,
      shuffle
    } = this.state;
    const { user } = this.props;
    const { library } = user;

    return (
      <div>
        <div className="library flex column align-center">
          <div className="library__playlists w-100 py-10px flex row">
            <button
              className="library__playlists__button"
              type="button"
              onClick={() => this.handleSelectPlaylist('Songs')}
            >
              <span className="body-1">Songs</span>
            </button>
            {Object.keys(user.playlists).map(playlist => {
              return (
                <button
                  className="library__playlists__button"
                  key={playlist}
                  type="button"
                  onClick={() => this.handleSelectPlaylist(playlist)}
                >
                  <span className="body-1">{playlist}</span>
                </button>
              );
            })}
          </div>
          {playlist === 'Songs'
            ? Object.entries(library).map(entry => {
                const song = entry[1];
                const id = entry[0];
                console.log(id, song);
                return (
                  <div
                    onClick={() => this.handleSelectItem(id, song)}
                    key={song.title}
                    className="library__item flex row align-center"
                  >
                    <span>{song.title}</span>
                  </div>
                );
              })
            : Object.values(user.playlists[playlist]).map(id => {
                const song = library[id];
                return (
                  <div
                    onClick={() => this.handleSelectItem(id, song)}
                    key={song.title}
                    className="library__item flex row align-center"
                  >
                    <span>{song.title}</span>
                  </div>
                );
              })}
        </div>
        <div
          onTouchStart={this.handleMinimize}
          onTouchEnd={this.handleMinimize}
          className={`player ${
            minimized ? 'minimized' : ''
          } flex row align-center w-100`}
        >
          <div
            onClick={this.handleMinimize}
            className="player__title w-100 flex row align-center"
          >
            <div className="flex column align-center">
              <span className="body-1 color-white">{title}</span>
              <span className="body-2 color-white">{artist}</span>
            </div>
            <button
              style={{ zIndex: '10' }}
              type="button"
              className={`player__top__pause ${!minimized ? 'hidden' : ''}`}
              onClick={this.handlePlay}
            >
              <i className="material-icons color-white">pause_square</i>
            </button>
          </div>
          <img id="img" className="player__image" />

          <div className="player__controls w-100 flex column align-center">
            <div className="flex row align-center justify-center w-100">
              <button
                style={{ background: 'transparent' }}
                className={
                  shuffle ? 'player__button--filled' : 'player__button--empty'
                }
                type="button"
                onClick={this.handleShuffle}
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
                onClick={this.handlePlay}
              >
                <i className="material-icons">
                  {playing ? 'pause' : 'play_arrow'}
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
                onClick={this.handleRepeat}
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

const mapStateToProps = state => ({
  user: state.firebase.user
});

export default connect(mapStateToProps)(Player);
