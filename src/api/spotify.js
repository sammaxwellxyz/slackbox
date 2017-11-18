import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_KEY,
  clientSecret: process.env.SPOTIFY_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

spotifyApi.addTracksToPlaylist2 = (tracks) => {
  const tracksArr = Array.isArray(tracks) ? tracks : [ tracks ];
  spotifyApi.addTracksToPlaylist(process.env.SPOTIFY_USERNAME, process.env.SPOTIFY_PLAYLIST_ID, tracksArr.map(track => `spotify:track:${track.id}`));
};

spotifyApi.getPlaylist2 = async (playlist = [], offset = 0, limit = 100) => {
  const { body: { tracks: parsedPlaylist } } = await spotifyApi.getPlaylist(process.env.SPOTIFY_USERNAME, process.env.SPOTIFY_PLAYLIST_ID, { offset, limit });
  console.log(parsedPlaylist);
  const updatedPlaylist = [ ...playlist, ...parsedPlaylist.items ];
  console.log('post push', updatedPlaylist)
  if (parsedPlaylist.next) return await spotifyApi.getPlaylist2(updatedPlaylist, offset + limit, limit);
  console.log('now return', updatedPlaylist)
  return updatedPlaylist;
};

export default spotifyApi;