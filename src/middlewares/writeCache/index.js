const { writeTorrentCache } = require('../../utils/index.js');

module.exports = async (torrents, { cache }, next) => {
	writeTorrentCache(cache, torrents);

	await next();
};
