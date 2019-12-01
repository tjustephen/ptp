const { getCache, validateConfig, fetchTorrents } = require('./utils'),
	Middleware = require('./utils/middleware.js'),
	{ checkDiskspace, matchesFilters, downloadTorrent, notifyDiscord, writeCache } = require('./middlewares');

module.exports = async function() {
	try {

		const cache = getCache(),
			config = await validateConfig(), 
			{ torrents, authKey, passKey } = await fetchTorrents(config);

		const app = new Middleware();

		app.use(matchesFilters, checkDiskspace, downloadTorrent, notifyDiscord);
		app.after(writeCache);

		await app.run(torrents, { authKey, passKey, cache, config });

	} catch(error) {
		console.log(error);
	}
}
