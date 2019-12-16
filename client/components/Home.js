import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { storage } from '../utilities/firebase';
import { WindoW, Flex, Divider } from '../sub-components/containers';
import { Textfield, Fab } from '../sub-components';
import { getSong, getQuery, addTempSong } from '../store';

class Home extends Component {
  state = {
    items: [],
    query: ''
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  // addTextfield = () => {
  //   const { textfields, songsToGet } = this.state;
  //   textfields.push(
  //     <Textfield
  //       key={textfields.length}
  //       placeholder="Subject"
  //       dataHook={this.dataHook}
  //       // error={error.subject}
  //       name={textfields.length}
  //       maxWidth="maxw-800px"
  //     />
  //   );
  //   this.setState({ textfields, songsToGet });
  // };

  handleQuery = async event => {
    event.preventDefault();
    const { query } = this.state;
    await this.props.getQuery(query);
    const { items } = this.props.query;
    this.setState({ items });
  };

  handleSongDownload = async (title, url, artist, thumbnail) => {
    const { user } = this.props;
    await this.props.getSong(title, url, user, artist, thumbnail);
    const { songToAdd } = this.props;
    this.props.addTempSong(songToAdd.id, songToAdd.song);
  };

  render() {
    const { state } = this;
    const { query, items } = state;

    return (
      <div style={{ overflowX: 'hidden' }} className="flex column align-center">
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
          {items.length > 0 ? (
            <div>
              <h3 className="headline-3">{query}</h3>
              {items.map(item => {
                const {
                  thumbnail,
                  title,
                  description,
                  duration,
                  views,
                  link,
                  author
                } = item;
                console.log(author.name);
                return (
                  <div
                    onClick={() =>
                      this.handleSongDownload(
                        title,
                        link,
                        author.name,
                        thumbnail
                      )
                    }
                    className="flex row align-center"
                    key={title}
                  >
                    <img src={thumbnail} className="" />
                    <div className="flex column align-center" />
                    <span className="headline-5">{title}</span>
                    <span className="headline-5">{description}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <form
              className="flex column align-center"
              // onDownloadComplete={this.onDownloadComplete}
              onSubmit={this.handleQuery}
            >
              {/* {textfields.map((field, index) => {
              return ( */}
              <input
                name="query"
                value={query}
                onChange={this.handleChange}
                className=""
                style={{ zIndex: 10 }}
              />
              {/* );
            })} */}
              <Flex row>
                <button type="submit" className="button color-tirciary">
                  Download
                </button>
                {/*
              <button
                type="button"
                onClick={this.addTextfield}
                className="button color-tirciary"
              >
                Add Another Field
              </button> */}
              </Flex>
            </form>
          )}
        </WindoW>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  query: state.util.query,
  user: state.firebase.user,
  songToAdd: state.util.songToAdd
});

const mapDispatchToProps = dispatch => ({
  addTempSong: (id, song) => dispatch(addTempSong(id, song)),
  getSong: (title, songsToGet, user, artist, thumbnail) =>
    dispatch(getSong(title, songsToGet, user, artist, thumbnail)),
  getQuery: query => dispatch(getQuery(query))
});
export default connect(mapStateToProps, mapDispatchToProps)(Home);
