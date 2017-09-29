'use strict';

module.exports = function () {

  return this.fs.copyTpl(
    this.templatePath('index/index.template'),
    this.destinationPath('index.js')
  );

};
