const { downloadTorrentFile } = require('./utils.js');

module.exports = async (torrent, { authKey, passKey, config }, next) => {
	if (!config.downloadPath) {
		return await next();
	}

	try {
		await downloadTorrentFile(torrent, config.downloadPath, authKey, passKey);
	} catch(error) {
		console.log('Could not download torrent:', error);
		return;
	}

	await next();
};
