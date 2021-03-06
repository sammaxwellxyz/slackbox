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
  const { body: parsedPlaylist } = await spotifyApi.getPlaylistTracks(process.env.SPOTIFY_USERNAME, process.env.SPOTIFY_PLAYLIST_ID, { offset, limit });
  const updatedPlaylist = [ ...playlist, ...parsedPlaylist.items ];
  if (parsedPlaylist.next) return await spotifyApi.getPlaylist2(updatedPlaylist, offset + limit, limit);
  return updatedPlaylist;
};

spotifyApi.clearPlaylist = async (offset = 0, limit = 100) => {
  const { body: parsedPlaylist } = await spotifyApi.getPlaylistTracks(process.env.SPOTIFY_USERNAME, process.env.SPOTIFY_PLAYLIST_ID, { offset, limit });
  await spotifyApi.removeTracksFromPlaylist(process.env.SPOTIFY_USERNAME, process.env.SPOTIFY_PLAYLIST_ID, parsedPlaylist.items.map(({ track: { uri } }) => ({ uri })));
  if (parsedPlaylist.next) return await spotifyApi.clearPlaylist(offset + limit, limit);
  return true;
};


export default spotifyApi;