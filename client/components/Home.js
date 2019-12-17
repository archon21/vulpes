import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { storage } from '../utilities/firebase';
import { WindoW, Flex, Divider } from '../sub-components/containers';
import { Textfield, Fab, Button } from '../sub-components';
import { getSong, getQuery, addTempSong } from '../store';

class Home extends Component {
  state = {
    items: [],
    query: '',
    requesting: false
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
    this.setState({ requesting: true });
    const { query } = this.state;
    await this.props.getQuery(query);
    const { items } = this.props.query;
    this.setState({ items, requesting: false });
  };

  handleSongDownload = async (title, url, artist, thumbnail) => {
    this.setState({ requesting: true });
    const { user } = this.props;
    await this.props.getSong(title, url, user, artist, thumbnail);
    const { songToAdd } = this.props;
    this.props.addTempSong(songToAdd.id, songToAdd.song);
    this.setState({ requesting: false });
  };

  render() {
    const { state } = this;
    const { query, items, requesting } = state;

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
          <form
            onSubmit={
              !requesting ? this.handleQuery : event => event.preventDefault()
            }
            className="flex row align-center justify-center wrap"
            // onDownloadComplete={this.onDownloadComplete}
          >
            <Textfield
              name="query"
              value={query}
              handleChange={this.handleChange}
              placeholder="Youtube search"
              required
            ></Textfield>

            <Button
              type="submit"
              text=" Search"
              variant={`button--small ${requesting &&
                'button--disabled'} color-tirciary`}
            ></Button>
          </form>
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

            return (
              <div
                className="downloader__link flex column align-center wrap w-90"
                key={title}
              >
                <div className="flex row wrap align-center justify-center wrap">
                  <img src={thumbnail} className="" />
                  <div className="flex column w-60 minw-325px">
                    <span className="headline-5">{title}</span>
                    <span className="body-1 downloader__link__description ">
                      {description}
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  text=" Download"
                  onClick={() =>
                    this.handleSongDownload(title, link, author.name, thumbnail)
                  }
                  variant={`button--small ${requesting &&
                    'button--disabled'} color-tirciary`}
                ></Button>
                <div className="downloader__link__divider w-90"></div>
              </div>
            );
          })}
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
