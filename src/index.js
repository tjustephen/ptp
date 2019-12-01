const { getCache, validateConfig, fetchTorrents } = require('./utils'),
	Runner = require('./utils/middleware.js'),
	{ checkDiskspace, matchesFilters, downloadTorrent, notifyDiscord, writeCache } = require('./middlewares');

module.exports = async function() {
	try {
		const cache = getCache(),
			config = await validateConfig(), 
			{ torrents, authKey, passKey } = await fetchTorrents(config);

		const runner = new Runner();

		runner.use(matchesFilters, checkDiskspace, downloadTorrent, notifyDiscord);
		runner.after(writeCache);

		await runner.run(torrents, { authKey, passKey, cache, config });
	} catch(error) {
		console.log(error);
	}
}
