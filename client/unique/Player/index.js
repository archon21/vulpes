import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as mm from 'music-metadata-browser';
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

const getCoverArt = unit8 => {
  const string = String.fromCharCode.apply(null, unit8);
  const base64 = btoa(string);

  return `data:image/png;base64, ${base64}`;
};

class Player extends Component {
  state = {
    audioID: '',
    audio: null,
    audioPlaying: false,
    audioRepeat: false,
    audioShuffle: false,
    audioArt: null,
    minimized: true,
    touchEvent: [false, 0],
    audioLocation: 0,
    interval: null
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.audioID !== this.props.audioID) {
      console.log('Update', nextProps.audioID, this.state.audio);
      if (nextProps.audioID === '' && this.state.audio) {
        const { audio } = this.state;
        audio.pause();
        audio.removeAttribute('src'); // empty source
        audio.load();
        clearInterval(this.state.interval);
        return this.setState({
          audio: null,
          audioID: '',
          audioArt: '',
          minimized: true,
          audioPlaying: false,
          audioLocation: 0,
          interval: null
        });
      } else {
        try {
          const { audioURL } = nextProps;

          const xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.onload = async () => {
            console.log('Loaded');
            var blob = xhr.response;
            const tagArr = await mm.parseBlob(blob).then(tags => {
              return tags;
            });
            const audio = new Audio(audioURL);

            audio.id = nextProps.audioID;
            audio.play();

            const audioArt = await getCoverArt(tagArr.common.picture[0].data);

            const interval = setInterval(() => {
              this.setState({ audioLocation: audio.currentTime + 1 });
            }, 1000);
            return this.setState({
              audio,
              minimized: false,
              audioArt,
              audioID: nextProps.audioID,
              audioPlaying: true,
              interval
            });
          };
          xhr.open('GET', audioURL);
          xhr.send();
        } catch (err) {
          return 'Audio Failed';
        }
      }
    }
    return true;
    // if(nextState.minimized) {}
  }

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

  changeAudioLocation = event => {
    event.stopPropagation();
    const { audio } = this.state;

    const audioLocation = event.target.value;
    audio.currentTime = audioLocation;
    this.setState({ audioLocation });
  };

  changeAudioStatus = (event, arg) => {
    event.stopPropagation();
    const { audio, audioShuffle, audioPlaying, audioRepeat } = this.state;
    switch (arg) {
      case 'audioShuffle':
        return this.setState({ audioShuffle: !audioShuffle });
      case 'audioPlaying':
        audioPlaying ? audio.pause() : audio.play();
        return this.setState({ audioPlaying: !audioPlaying });
      case 'audioRepeat':
        console.log(!audioRepeat, 'repeat');
        audio.loop = !audioRepeat;
        return this.setState({ audioRepeat: !audioRepeat });
      default:
        return;
    }
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

  render() {
    console.log(this.state);
    const {
      minimized,
      audioRepeat,
      audioShuffle,
      audioPlaying,
      audioLocation
    } = this.state;
    const { audioTitle, audioArtist } = this.props;
    const { audio, audioArt } = this.state;
    return (
      <div
        onTouchStart={this.handleMinimize}
        onTouchEnd={this.handleMinimize}
        style={{ backgroundImage: audioArt ? audioArt : null }}
        className={`player  ${
          minimized ? 'minimized' : ''
        } flex row align-center w-100`}
      >
        {audio && audio[0]}
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
            className={`player__top__pause ${!minimized ? 'hidden' : ''} w-15`}
            onClick={event => this.changeAudioStatus(event, 'audioPlaying')}
          >
            <i className="material-icons color-white">
              {audioPlaying ? 'pause' : 'play_arrow'}
            </i>
          </button>
        </div>
        <img src={audioArt} id="img" className="player__image" />

        <div className="player__controls w-100 flex column align-center justify-center">
          {console.log(audio && audio.duration)}
          <input
            onChange={event => this.changeAudioLocation(event)}
            type="range"
            min="0"
            max={audio && audio.duration !== NaN && audio.duration}
            value={audioLocation}
            className={`player__controls__slider  ${
              minimized ? 'minimized' : ''
            }
              `}
            id="myRange"
          />

          <div className="flex row align-center justify-center w-100">
            <button
              style={{ background: 'transparent' }}
              className={
                audioShuffle
                  ? 'player__button--filled'
                  : 'player__button--empty'
              }
              type="button"
              onClick={event => this.changeAudioStatus(event, 'audioShuffle')}
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
              onClick={event => this.changeAudioStatus(event, 'audioPlaying')}
            >
              <i className="material-icons">
                {audioPlaying ? 'pause' : 'play_arrow'}
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
                audioRepeat ? 'player__button--filled' : 'player__button--empty'
              }
              type="button"
              onClick={event => this.changeAudioStatus(event, 'audioRepeat')}
            >
              <i className="material-icons">repeat</i>
            </button>
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
  audioURL: state.audio.audioURL,
  audioTitle: state.audio.audioTitle,
  audioID: state.audio.audioID,
  audioArtist: state.audio.audioArtist
});

export default connect(mapStateToProps, mapDispatchToProps)(Player);
