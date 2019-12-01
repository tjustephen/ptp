const path = require('path'),
	fs = require('fs'),
	fetch = require('node-fetch'),
	importFresh = require('import-fresh'),
	directoryExists = require('directory-exists');

const configPath = path.join(__dirname, '../../config.json'),
	cachePath = path.join(__dirname, '../../data/cache.json');

const getConfig = () => {
	try {
		const config = importFresh(configPath);
		JSON.parse(JSON.stringify(config));
		return config;
	} catch(error) {
		if (error.message.includes('Cannot find module')) {
			console.log('Please ensure you\'ve created and filled in the config.json file');
			console.log('You may copy example.config.json to config.json and use that as a template.');
			process.exit();
		}

		if (error.message.includes('Unexpected token') || error.message.includes('Unexpected end of JSON input')) {
			console.log('Config.json contains invalid JSON. Please check and try again.');
			process.exit();
		}

		console.log(error);
		process.exit();
	}
};

exports.validateConfig = async () => {
	const configKeys = ['apiUser','apiKey','interval','downloadPath','dataDirectoryPath','dataDirectoryMaxSize','discordWebhookUrl','minSeeders','maxSeeders','minLeechers','maxLeechers','minSize','maxSize','maxAge','resolution','codec','container','source','releaseGroup'],
		config = getConfig(),
		configFormatError = 'The format of config.json has changed. Please ensure it contains the exact same format and properties as example.config.json',
		downloadPathError = 'Specified downloadPath directory does not exist. Please check your config.';

	if (!config.apiUser || !config.apiKey) {
		console.log('Please ensure you\'ve added your ApiUser and ApiKey details from your PTP profile to the config file. See the example config file for details.');
		process.exit();
	}

	if (configKeys.length !== Object.keys(config).length || !configKeys.every(key => config[key] !== undefined)) {
		console.log(configFormatError);
		process.exit();
	}

	if ((config.dataDirectoryPath && !config.dataDirectoryMaxSize) || (!config.dataDirectoryPath && config.dataDirectoryMaxSize)) {
		console.log('Please add both a dataDirectoryPath and dataDirectoryMaxSize to your config if you wish to make use of the directory size check');
		process.exit();
	}

	if (!config.downloadPath) {
		return config;
	}

	const folderExists = await directoryExists(config.downloadPath);

	if (!folderExists) {
		console.log(downloadPathError);
		process.exit();
	}

	return config;
};

exports.getCache = () => {
	try {
		const cache = importFresh(cachePath);
		return JSON.parse(JSON.stringify(cache));
	} catch(error) {
		if (error.message.includes('Cannot find module') || error.message.includes('Unexpected end of JSON input')) {
			return { freeleech: [] };
		}

		console.log('Cache has become corrupted. Please remove the data/cache.json file and try again.');
		process.exit();
	}
};

exports.writeTorrentCache = (cache, torrents) => {
	cache.freeleech = cache.freeleech.concat(torrents
		.map(torrent => cache.freeleech.includes(torrent.Id) ? null : torrent.Id)
		.filter(id => id !== null));

	fs.writeFileSync(cachePath, JSON.stringify(cache), {
		encoding: 'utf8'
	});
};

const checkStatus = response => new Promise((resolve, reject) => {
	if (response.status >= 200 && response.status < 300) {
		resolve(response);
	} else {
		const error = new Error(response.statusText);
		error.response = response;
		reject(error);
	}
});

const getTorrentsFromResponse = data => {
	return data.Movies.map(group => {
		const torrent = group.Torrents[0];

		torrent.Seeders = Number(torrent.Seeders);
		torrent.Leechers = Number(torrent.Leechers);
		torrent.Size = Number(torrent.Size);
		torrent.GroupId = group.GroupId;

		return torrent;
	}).filter(torrent => torrent.FreeleechType == 'Freeleech');
};

exports.fetchTorrents = async config => {
	let authKey, passKey, torrents = [];

	try {
		await (async function fetchTorrents(pageNumber) {
			const endpoint = `https://passthepopcorn.me/torrents.php?freetorrent=1&grouping=0&json=noredirect&page=${pageNumber}`,
				response = await fetch(endpoint, {
					headers: {
						'ApiUser': config.apiUser,
						'ApiKey': config.apiKey
					}
				});

			await checkStatus(response);

			const json = await response.json(),
				totalPages = Math.ceil(Number(json.TotalResults) / 50);

			torrents = torrents.concat(getTorrentsFromResponse(json));

			if (pageNumber < totalPages) {
				await fetchTorrents(pageNumber + 1);
			} else {
				authKey = json.AuthKey;
				passKey = json.PassKey;
			}
		})(1);

		return { torrents, authKey, passKey };
	} catch(error) {

		console.log(error);
		process.exit();
	}
};