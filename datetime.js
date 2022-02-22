function nowHuman(timeZone = 'UTC') {
	var options = {
		weekday: 'short',
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		timeZone: timeZone,
		timeZoneName: 'short',
		hour12: true,
	}

	return new Intl.DateTimeFormat('default', options).format(new Date())
}

//Always returns UTC
function nowUnix() {
	return Math.floor(Date.now() / 1000)
}

module.exports = {
	nowHuman,
	nowUnix,
}
