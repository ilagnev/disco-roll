const http = require('https');
const url = require('url');

const interval = 5000;
const siteUrl = process.env['SITE_URL'];
let urlObj;

if (!siteUrl) {
	console.error('SITE_URL not defined');
	process.exit(-2);
} else {
	urlObj = url.parse(siteUrl);
	console.log(`URL to watch: ${siteUrl}`, JSON.stringify(urlObj));
}

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const requestParams = {
	method: 'HEAD',
	protocol: urlObj.protocol,
	host: urlObj.hostname,
  port: urlObj.port,
  path: urlObj.path,
}

const {
	initHardware,
	turnOnBall, turnOffBall,
	turnOnDebug, turnOffDebug,
	isBallOn, isDebugOn,
} = require('./tumblers');

let = isBall = false;
let = isDebug = false;

const switchBall = () => {
	isBall = !isBall;
	console.log('switch ball to', isBall);
	isBall ? turnOnBall() : turnOffBall();
}

const switchDebug = () => {
	isDebug = !isDebug;
	console.log('switch debug to', isDebug);
	isDebug ? turnOnDebug() : turnOffDebug();
}

const isCexAlive = () => {
	const request = http.request(requestParams, res => {
		console.log(new Date(), res.statusCode);

		// disco ball
		if (res.statusCode === 521 && isBall === false) {
			switchBall();
		} else if (res.statusCode === 200 && isBall === true) {
			switchBall();
		}

		// debug diod
		if (isDebug === true) {
			switchDebug();
		}
	});

	request.on('error', err => {
		console.error(new Date(), err.message || err);

		// no internet connection
		if (['ECONNREFUSED', 'ENOTFOUND'].includes(err.code) && isDebug === false) {
			switchDebug();
		}
	});

	request.end();
}

const init = async () => {
	await initHardware();

	isBall = await isBallOn();
	isDebug = await isDebugOn();

	console.log('init: ', { isBall, isDebug }, '\n');

	isCexAlive();
	setInterval(() => isCexAlive(), interval);
}

module.exports = init();