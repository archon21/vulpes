import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Block,
  WindoW,
  GalleryBlock,
  Flex,
  Divider,
  Animator
} from '../sub-components/containers';
import { Video, Fab, List, Table, Carousel } from '../sub-components';

class Home extends Component {
  state = {
    scrolled: 0
  };
  aboutBlock = React.createRef();
  charity1 = React.createRef();
  charity2 = React.createRef();
  charity3 = React.createRef();
  charity4 = React.createRef();
  sportingBlock = React.createRef();
  sportingBlock2 = React.createRef();
  carousel = React.createRef();

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = e => {
    this.setState({ scrolled: window.pageYOffset });
  };

  render() {
    const {
      charity1,
      charity2,
      charity3,
      charity4,
      sportingBlock,
      sportingBlock2,
      carousel,
      state,
      props,
      aboutBlock
    } = this;
    const { charities, sporting } = props;
    const { scrolled } = state;
    console.log(aboutBlock);
    return (
      <div style={{ overflowX: 'hidden' }} className="flex column align-center">
        <WindoW video>
          <Video video="https://firebasestorage.googleapis.com/v0/b/hayesdevelopers.appspot.com/o/Hayes%20Developers.mp4?alt=media&token=6a7ba0b0-fee5-4cd7-ab8a-767d9c4aeaa4" />
        </WindoW>
        <Animator
          inRef={aboutBlock}
          scrolled={scrolled}
          animation="a-wrapper--opacity"
          maxHeight="maxh-500px"
          maxWidth="maxw-800px"
        >
          <Block
            column
            type="info-card"
            backgroundColor="background-secondary"
            color="color-primary"
          >
            <p className="body-1 p-20px">
              <i>
                Since 1974, Hayes Developers has been a leader in real estate
                development, leasing and property management of retail shopping
                centers. Our longevity and integrity are why many companies in
                the New England area trust the Hayes Team with their development
                needs.
              </i>
            </p>

            <Link to={{ pathname: '/hayes-team' }} className="headliner-4">
              <h4 className="headline-4 color-primary">
                Read More about the Hayes Team
              </h4>
            </Link>
          </Block>
        </Animator>
        <Divider
          border
          backgroundColor="background-primary"
          color="color-secondary"
        >
          <h1 className="headline-4">Community</h1>
        </Divider>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  charities: state.init.charities,
  sporting: state.init.sporting
});

export default connect(mapStateToProps)(Home);
