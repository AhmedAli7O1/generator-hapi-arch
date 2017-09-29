'use strict';

const _ = require('lodash');
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  prompting() {

    const prompts = [{
      type: 'input',
      name: 'pluginName',
      message: 'plugin name?',
      default: 'examplePlugin'
    }];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  // call sub generators
  callSub() {

    const { props } = this;
    const { isSub } = this.options;
    let { npmPkgs } = this.options;
    const isExample = isSub;

    // get user package.json
    if (!npmPkgs) {
      const pkgPath = this.destinationPath('package.json');
      try {
        const pkg = require(pkgPath);
        npmPkgs = _.keys(pkg.dependencies);
      }
      catch (e) {
        this.log('Warning!', e);
      }
    }

    const hasModel = _.includes(npmPkgs, 'mongoose');

    this.composeWith(require.resolve('../component'), { pluginInfo: props, isSub: true, isExample, compType: 'controller' });
    this.composeWith(require.resolve('../component'), { pluginInfo: props, isSub: true, isExample, hasModel, compType: 'service' });
    this.composeWith(require.resolve('../component'), { pluginInfo: props, isSub: true, isExample, hasModel, compType: 'test' });
    this.composeWith(require.resolve('../component'), { pluginInfo: props, isSub: true, isExample, compType: 'crontask' });

    // call the model generator only if the user selected mongoose
    if (hasModel) {
      this.composeWith(require.resolve('../component'), { pluginInfo: props, isSub: true, isExample, compType: 'model' });
    }

  }

};
