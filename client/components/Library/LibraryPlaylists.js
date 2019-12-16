import React from 'react';

const LibraryPlaylists = props => {
  const { handleSelectPlaylist, handleAddPlaylist } = props;
  const { user, selectedPlaylist } = props;


  return (
    <div className="library__playlists w-100 flex row">
      <button
        className="library__playlists__button"
        type="button"
        onClick={() => handleSelectPlaylist('Songs')}
      >
        <span className="body-1">Songs</span>
      </button>
      {Object.keys(user.playlists).map(playlist => {
        return (
          <button
            className="library__playlists__button py-10px"
            key={playlist}
            type="button"
            onClick={() => handleSelectPlaylist(playlist)}
          >
            <span
              className={`body-1 ${
                playlist === selectedPlaylist ? 'color-red' : 'color-white'
              }`}
            >
              {playlist}
            </span>
          </button>
        );
      })}
      <button
        className="library__playlists__button"
        type="button"
        onClick={handleAddPlaylist}
      >
        <i className="material-icons color-white">add</i>
      </button>
    </div>
  );
};

export default LibraryPlaylists;
