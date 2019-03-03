import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Block,
  WindoW,
  GalleryBlock,
  Flex,
  Divider,
  Animator
} from '../sub-components/containers';
import { Textfield } from '../sub-components';

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
        dataHook={this.dataHook}
      />
    ],
    songsToRender: []
  };
  aboutBlock = React.createRef();

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
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
    console.log(data);
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
      />
    );
    this.setState({ textfields, songsToGet });
  };

  requestSongs = async () => {
    const { songsToGet } = this.state;
    const promisArr = songsToGet.map(song => {
      axios.post('/api/songs', { song });

    });
    const songsToRender = await Promise.all(promisArr)
    console.log(songsToRender)
  };

  render() {
    const { state, props, aboutBlock } = this;
    const { scrolled, songsToGet, songsToRender, textfields } = state;
    console.log(this.state);
    return (
      <div style={{ overflowX: 'hidden' }} className="flex column align-center">
        <Divider
          border
          backgroundColor="background-primary"
          color="color-tirciary"
        >
          <h1 className="headline-4">Community</h1>
        </Divider>
        <WindoW video>
          {/* <Animator
            inRef={aboutBlock}
            scrolled={scrolled}
            animation="a-wrapper--opacity"
            maxHeight="maxh-500px"
            maxWidth="maxw-800px"
          > */}
          <Flex column>
            <Flex row>
              <button
                type="button"
                onClick={this.addTextfield}
                className="button"
              >
                Add Another Field
              </button>
            </Flex>
            {textfields.map((field, index) => {
              return (
                <Textfield
                  key={index}
                  placeholder="Subject"
                  dataHook={this.dataHook}
                  // error={error.subject}
                  name={index}
                />
              );
            })}
          </Flex>
          {/* <Block
              column
              type="info-card"
              backgroundColor="background-secondary"
              color="color-primary"
            >
              <p className="body-1 p-20px">
                <i>The world is yours. If your willing to take it.</i>
              </p>

              <Link to={{ pathname: '/' }} className="headliner-4">
                <h4 className="headline-4 color-primary">
                  Read More about the Team
                </h4>
              </Link>
            </Block> */}
          {/* </Animator> */}
        </WindoW>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  charities: state.init.charities,
  sporting: state.init.sporting
});

export default connect(mapStateToProps)(Home);
