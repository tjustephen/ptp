const { isOlderThan } = require('./utils.js');

module.exports = async (torrent, { cache, config }, next) => {
	let isMatch = true;

	const minSize = config.minsize === -1 ? -1 : Number(config.minsize) * 1024 * 1024,
		maxSize = config.maxsize === -1 ? -1 : Number(config.maxsize) * 1024 * 1024;

	if (cache.freeleech.includes(torrent.Id)) {
		return;
	}

	if (config.minSeeders !== -1) {
		if (torrent.Seeders < config.minSeeders) {
			return;
		}
	}

	if (config.maxSeeders !== -1) {
		if(torrent.Seeders > config.maxSeeders) {
			return;
		}
	}

	if (config.minLeechers !== -1) {
		if(torrent.Leechers < config.minLeechers) {
			return;
		}
	}

	if (config.maxLeechers !== -1) {
		if(torrent.Leechers > config.maxLeechers) {
			return;
		}
	}

	if (config.minSize !== -1) {
		if(torrent.Size < minSize) {
			return;
		}
	}

	if (config.maxSize !== -1) {
		if(torrent.Size > maxSize) {
			return;
		}
	}

	if (config.maxAge !== -1) {
		if(isOlderThan(torrent.UploadTime, config.maxAge)) {
			return;
		}
	}

	if (config.resolution !== -1 && config.resolution.length) {
		const resolutions = config.resolution.includes(',') ? config.resolution.split(',') : [config.resolution];

		if (!resolutions.find(resolution => resolution.trim().toLowerCase() === torrent.Resolution.toLowerCase())) {
			return;
		}
	}

	if (config.codec !== -1 && config.codec.length) {
		const codecs = config.codec.includes(',') ? config.codec.split(',') : [config.codec];

		if (!codecs.find(codec => codec.trim().toLowerCase() === torrent.Codec.toLowerCase())) {
			return;
		}
	}

	if (config.container !== -1 && config.container.length) {
		const containers = config.container.includes(',') ? config.container.split(',') : [config.container];

		if (!containers.find(container => container.trim().toLowerCase() === torrent.Container.toLowerCase())) {
			return;
		}
	}

	if (config.source !== -1 && config.source.length) {
		const sources = config.source.includes(',') ? config.source.split(',') : [config.source];

		if (!sources.find(source => source.trim().toLowerCase() === torrent.Source.toLowerCase())) {
			return;
		}
	}

	if (config.releaseGroup !== -1 && config.releaseGroup.length) {
		const releaseGroups = config.releaseGroup.includes(',') ? config.releaseGroup.split(',') : [config.releaseGroup];

		if (torrent.ReleaseGroup === null) return;

		if (!releaseGroups.find(releaseGroup => releaseGroup.trim().toLowerCase() === torrent.ReleaseGroup.toLowerCase())) {
			return;
		}
	}

	await next();
};
