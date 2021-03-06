import spotifyApi from '../api/spotify';
import request from 'request-promise';

const upNext = (res, token) => async () => {
  try {
    const parsedPlaylist = await spotifyApi.getPlaylist2();

    const playing = await request.get({
      headers: { Authorization: `Bearer ${token}` },
      url: 'https://api.spotify.com/v1/me/player/currently-playing'
    });

    const parsedPlaying = JSON.parse(playing);
    const playingIndex = parsedPlaylist.findIndex(pitem => pitem.track.id === parsedPlaying.item.id);
    const upNext = parsedPlaylist.slice(playingIndex);
    const messages = upNext.reduce((acc, val, ind) => {
      const artists = val.track.artists.reduce((acc, val, ind) => `${acc}${ind !== 0 ? ',' : ''} ${val.name}`, '');
      return `${ind === 0 ? '*' : ''}${acc}${artists} - ${val.track.name}${ind === 0 ? '*' : ''}\n`;
    }, '');
    return res.send(messages);
  } catch (e) {
    res.send(e.message);
  }
};


export default upNext;
