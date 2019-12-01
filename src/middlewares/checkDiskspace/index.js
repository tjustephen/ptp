const du = require('du'),
	{ bytesToGigaByte } = require('./utils.js');

module.exports = async (torrent, { config }, next) => {
	const { dataDirectoryPath, dataDirectoryMaxSize } = config;

	try {
		if (dataDirectoryPath === -1 || dataDirectoryMaxSize === -1) {
			return await next();
		}

		const dataDirectorySize = await du(dataDirectoryPath),
			dataDirectorySizeInGB = bytesToGigaByte(dataDirectorySize),
			torrentSizeInGB = bytesToGigaByte(torrent.Size);

		if ((dataDirectorySizeInGB + torrentSizeInGB) >= dataDirectoryMaxSize) {
			console.log('Not downloading as it will exceed dataDirectoryMaxSize size');
			return;
		}

		await next();
	} catch(error) {
		console.log(error);
	}
};
