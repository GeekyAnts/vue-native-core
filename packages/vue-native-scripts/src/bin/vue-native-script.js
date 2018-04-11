#!/usr/bin/env node

const spawn = require('cross-spawn');
const script = process.argv[2];
const args = process.argv.slice(3);
const validCommands = ['compiler'];

if(validCommands.indexOf(script) !== -1) {
  const result = spawn.sync(
    'node',
    ['--no-deprecation', require.resolve('../scripts/' + script + '.js')].concat(args),
    { stdio: 'inherit' }
  );
  process.exit(result.status);
} else {
  console.log(
    `Invalid command '${script}'. Please check if you need to update react-native-scripts.`
  );
}
