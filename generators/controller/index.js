'use strict';
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  prompting() {

    const prompts = [{
      type: 'input',
      name: 'ctrlName',
      message: 'controller name?',
      default: 'TestController'
    }];

    if (!this.options.isSub) {
      prompts.unshift({
        type: 'input',
        name: 'pluginName',
        message: 'plugin name?',
        default: 'pluginName'
      });
    }

    return this.prompt(prompts).then(props => {
      // To access props later use ;
      this.props = props;
    });
  }

  paths() {
    if (this.props.pluginName) {
      const appPath = this.destinationPath(this.props.pluginName);
      this.destinationRoot(appPath);
    }
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('controller.template'),
      this.destinationPath(`controllers/${this.props.ctrlName}.js`),
      { serviceName: this.options.isSub ? this.props.ctrlName.replace('Controller', 'Service') : null }
    );
  }
};
