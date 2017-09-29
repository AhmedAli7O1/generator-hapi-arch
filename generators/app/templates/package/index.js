'use strict';

const _ = require('lodash');
const utils = require('../../../../lib/utils');

module.exports = function () {

  return this.fs.copyTpl(
    this.templatePath('package/package.template'),
    this.destinationPath('package.json'),
    {
      appName: this.props.name,
      appVersion: this.props.version,
      appDesc: this.props.desc,
      appAuthor: this.props.author
    }
  );

};
