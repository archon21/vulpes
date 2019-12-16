import React from 'react';

const LibraryCard = props => {
  const { handleSelectItem, handlePopup, id, song, audioID } = props;

  return (
    <div
      onClick={() => handleSelectItem(id, song)}
      key={song.title}
      className={`library__item
      ${audioID === id && 'selected'}
      flex row align-center`}
    >
      <i className="material-icons w-15 text-center">
        {audioID === id ? 'pause_circle_filled' : 'play_circle_filled'}
      </i>
      <div className="flex column library__item__inner">
        <span className="body-1 ellipsis">{song.title}</span>
        <span className="body-2 ellipsis">{song.artist}</span>
      </div>
      <div className="flex column w-10">
        <button
          type="button"
          onClick={(event) => handlePopup(event, id, song)}
          className="button-icon"
        >
          <i className="material-icons">scatter_plot</i>
        </button>
        <span className="body-2 ellipsis" />
      </div>
      {/* <button
                      onClick={() => this.props.editSongData(id, user, song)}
                      className="button small"
                    >
                      Edit
                    </button> */}
    </div>
  );
};

export default LibraryCard;
