exports.isOlderThan = (date, minutes) => {
	const earliest = 1000 * minutes * 60,
		time = Date.now() - earliest;
	
	return new Date(date) < time;
};
