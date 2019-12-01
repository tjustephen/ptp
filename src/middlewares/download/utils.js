const fetch = require('node-fetch'),
	fs = require('fs');

exports.downloadTorrentFile = async (torrent, path, authKey, passKey) => {
	const url = `https://passthepopcorn.me/torrents.php?action=download&id=${torrent.Id}&authkey=${authKey}&torrent_pass=${passKey}`,
		response = await fetch(url),
		fileStream = fs.createWriteStream(`${path}/${torrent.Id}.torrent`);

	return await new Promise((resolve, reject) => {
		response.body.pipe(fileStream);
		response.body.on("error", error => {
			reject(error);
		});
		fileStream.on("finish", function() {
			console.log(`\nSaved: ${torrent.ReleaseName}`);
			resolve();
		});
	});
};

