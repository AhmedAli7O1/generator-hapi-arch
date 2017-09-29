'use strict';

const _ = require('lodash');
const utils = require('../../../../lib/utils');
const deps = require('./deps.json');

module.exports = function () {

  const installedPkgs = this.npmPkgs;

  const seletcedDeps = _(deps)
    .filter(d => _.includes(installedPkgs, d.name))
    .map('command')
    .value();

  return this.fs.copyTpl(
    this.templatePath('thirdParty/thirdParty.template'),
    this.destinationPath('thirdParty.js'),
    {
      installedPkgs,
      deps: utils.arrayToLines(seletcedDeps)
    }
  );

};
