'use strict';

module.exports = function () {

  return this.fs.copyTpl(
    this.templatePath('bootstrap/bootstrap.template'),
    this.destinationPath('bootstrap.js')
  );

};
