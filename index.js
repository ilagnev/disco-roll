const http = require('https');

const url = process.env['SITE_URL'];
const interval = 5000;

if (!url) {
	console.error('SITE_URL not defined');
	process.exit(-2);
}

const isCexAlive = () => {
	var request = http.request(url, function (res) {
		var data = '';
		res.on('data', chunk => data += chunk);
		res.on('end', () => {
			console.log(new Date());
			// console.log(data.trim());
			console.log(res.statusCode);
			// console.log(res.headers);
			console.log("\n");
		});
	});
	request.on('error', function (e) {
		console.log(e);
	});
	request.end();
}

isCexAlive();
setInterval(() => isCexAlive(), interval);