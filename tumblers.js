const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function runCommand(cmd) {
  const { stdout, stderr } = await exec(cmd);
  console.log(`${cmd}: stdout:${stdout} stderr:${stderr}`);
	return (stdout || '').trim();
}

module.exports = (async () => {
	await runCommand('gpio mode 7 output');
	await runCommand('gpio mode 21 output');

	return {
		turnOnBall: () => runCommand('gpio write 7 1'),
		turnOffBall: () => runCommand('gpio write 7 0'),
		turnOnDebug: () => runCommand('gpio write 21 1'),
		turnOffDebug: () => runCommand('gpio write 21 0'),
		isBallOn: async () => await runCommand('gpio read 7') === '1',
		isDebugOn: async () => await runCommand('gpio read 21') === '1',
	}
})();