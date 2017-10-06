const fs = require('fs');
const _ = require('lodash');
const yeoman = require('yeoman-environment');
const env = yeoman.createEnv();

function lookupGenerators () {
  return fs.readdirSync('./generators');
}

function registerGenerators (generators) {
  _.forEach(generators, (gene) => {
    env.register(require.resolve(`./generators/${gene}`), `hapi-arch:${gene}`);
  });
}

const localGenerators = lookupGenerators();
registerGenerators(localGenerators);


module.exports = function (generatorType) {
  // check requested type is exist
  if (_.includes(localGenerators, generatorType)) {
    env.run('hapi-arch:component');
  }
  else {
    console.log('requested generator not found!');
  }
};