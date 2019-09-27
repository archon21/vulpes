import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';


import { storage } from '../utilities/firebase';
import { WindoW, Flex, Divider } from '../sub-components/containers';
import { Textfield, Fab } from '../sub-components';
import { getSongs } from '../store';

class Home extends Component {
  state = {
    scrolled: 0,
    songsToGet: [],
    textfields: [
      <Textfield
        key={0}
        placeholder="Add a song's URL."
        // error={error.subject}
        name={0}
        maxWidth="800px"
        dataHook={this.dataHook}
      />
    ],
    songsToRender: []
  };
  aboutBlock = React.createRef();


  componentDidUpdate(prevProps) {
    prevProps.songsToRender.length !== this.props.songsToRender.length &&
      this.onDownloadComplete();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = e => {
    this.setState({ scrolled: window.pageYOffset });
  };

  dataHook = data => {
    const { songsToGet } = this.state;
    songsToGet[data.name] = data.value;

    this.setState({ songsToGet });
  };

  addTextfield = () => {
    const { textfields, songsToGet } = this.state;
    textfields.push(
      <Textfield
        key={textfields.length}
        placeholder="Subject"
        dataHook={this.dataHook}
        // error={error.subject}
        name={textfields.length}
        maxWidth="maxw-800px"
      />
    );
    this.setState({ textfields, songsToGet });
  };

  requestSongs = async event => {
    event.preventDefault();
    const { songsToGet } = this.state;
    this.props.getSongs(songsToGet);
  };

  onDownloadComplete = event => {
    const { postsToRender } = this.props;
    console.log(postsToRender, event);
  };

  render() {
    const { state, props, aboutBlock } = this;
    const { scrolled, songsToGet, textfields } = state;
    const { songsToRender } = props;
    return (
      <div style={{ overflowX: 'hidden' }} className="flex column align-center">
        <audio autoPlay />
        <div className="w-100 h-100">
          <img id="img" className="player__image" />
        </div>

        <Fab
          options={[
            {
              name: 'downlaod',
              label: 'Download All',
              action: () => this.requestSongs()
            },
            {
              name: 'cancel',
              label: 'Clear All Songs',
              action: () => this.props.history.push('/')
            },
            {
              name: 'arrow_upward',
              label: 'Back To Top',
              action: () => window.scrollTo(0, 0)
            }
          ]}
        />
        <Divider
          border
          backgroundColor="background-primary"
          color="color-tirciary"
        >
          <h1 className="headline-4">Downloader</h1>
          <h6 className="headline-6">Take Whats Yours</h6>
        </Divider>
        <WindoW>
          <form
            className="flex column align-center"
            // onDownloadComplete={this.onDownloadComplete}
            onSubmit={this.requestSongs}
          >
            {textfields.map((field, index) => {
              return (
                <Textfield
                  key={index}
                  placeholder="Subject"
                  dataHook={this.dataHook}
                  // error={error.subject}
                  name={index}
                  maxWidth="maxw-800px"
                />
              );
            })}
            <Flex row>
              <button type="submit" className="button color-tirciary">
                Download
              </button>

              <button
                type="button"
                onClick={this.addTextfield}
                className="button color-tirciary"
              >
                Add Another Field
              </button>
            </Flex>
          </form>
        </WindoW>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  songsToRender: state.util.songsToRender
});

const mapDispatchToProps = dispatch => ({
  getSongs: songsToGet => dispatch(getSongs(songsToGet))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
