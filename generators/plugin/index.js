'use strict';

const Generator = require('yeoman-generator');

const pluginInfo = {
  props: {}
};

module.exports = class extends Generator {
  initializing() {
    this.composeWith(require.resolve('../component'), { pluginInfo, isSub: true, compType: 'controller' });
    this.composeWith(require.resolve('../component'), { pluginInfo, isSub: true, compType: 'service' });

    if (this.options.isSub) {
      if (this.options.npmPkgs) {
        this.composeWith(require.resolve('../component'), { pluginInfo, isSub: true, compType: 'model' });
      }
    }

  }

  prompting() {

    const prompts = [{
      type: 'input',
      name: 'pluginName',
      message: 'plugin name?',
      default: 'testPlugin'
    }];

    return this.prompt(prompts).then(props => {
      this.props = props;
      pluginInfo.props = this.props;
    });
  }

};
