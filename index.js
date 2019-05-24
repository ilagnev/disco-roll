const http = require('https');
const url = require('url');

const interval = 5000;
const siteUrl = process.env['SITE_URL'];
let urlObj;
let = isBall = false;
let = isDebug = false;

if (!siteUrl) {
	console.error('SITE_URL not defined');
	process.exit(-2);
} else {
	urlObj = url.parse(siteUrl);
	console.log(`URL to watch: ${siteUrl}`, { urlObj });
}

const {
	initHardware,
	turnOnBall, turnOffBall,
	turnOnDebug, turnOffDebug,
	isBallOn, isDebugOn,
} = require('./tumblers');

const requestParams = {
	method: 'HEAD',
	protocol: urlObj.protocol,
	host: urlObj.host,
  port: urlObj.port,
  path: urlObj.path,
}

const isCexAlive = () => {
	const request = http.request(requestParams, (res) => {

		console.log('not ended date:', new Date());
		console.log('not ended statusCode:', res.statusCode);
		// let data = '';
		// res.on('data', chunk => data += chunk);

		res.on('end', () => {
			console.log(new Date());
			console.log(res.statusCode);
			console.log('');
			// console.log(data.trim());
			// console.log(res.headers);
		});
	});

	request.on('error', err => {
		console.error(err);

		// no internet connection
		if (err.code === 'ENOTFOUND') {
			//todo turn red diod bulb (write to some channel)
			if (isDebug === false) {
				isDebug = true;
				turnOnDebug();
			}
		}
	});

	request.end();
}

const init = async () => {
	await initHardware();

	isBall = await isBallOn();
	isDebug = await isDebugOn();

	console.log('init: ', { isBall, isDebug });

	isCexAlive();
	setInterval(() => isCexAlive(), interval);
}

module.exports = init();