'use strict';

const _ = require('lodash');
const utils = require('../../../../lib/utils');

module.exports = function () {

  const installedPkgs = this.npmPkgs;
  const archServices = [];
  const archPlugins = [];

  if (_.find(installedPkgs, x => x === 'mongoose')){
    archServices.push('mongo');
    archPlugins.push('mongoose');
  }


  return this.fs.copyTpl(
    this.templatePath('arch/arch.template'),
    this.destinationPath('arch.json'),
    {
      archServices: utils.arrayToString(archServices),
      archPlugins: utils.arrayToString(archPlugins)
    }
  );

};
