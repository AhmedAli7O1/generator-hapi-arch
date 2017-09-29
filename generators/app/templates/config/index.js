'use strict';

const _ = require('lodash');

module.exports = function () {

  const installedPkgs = this.npmPkgs;

  this.fs.copyTpl(
    this.templatePath('config/connection.template'),
    this.destinationPath('config/connection.js')
  );

  this.fs.copyTpl(
    this.templatePath('config/crontask.template'),
    this.destinationPath('config/crontask.js')
  );

  if (_.find(installedPkgs, x => x === 'mongoose')){
    this.fs.copyTpl(
      this.templatePath('config/mongo.template'),
      this.destinationPath('config/mongo.js')
    );
  }

  this.fs.copyTpl(
    this.templatePath('config/gitkeep.template'),
    this.destinationPath('config/development/.gitkeep')
  );

  this.fs.copyTpl(
    this.templatePath('config/gitkeep.template'),
    this.destinationPath('config/test/.gitkeep')
  );

  this.fs.copyTpl(
    this.templatePath('config/gitkeep.template'),
    this.destinationPath('config/staging/.gitkeep')
  );

  this.fs.copyTpl(
    this.templatePath('config/gitkeep.template'),
    this.destinationPath('config/production/.gitkeep')
  );

};
