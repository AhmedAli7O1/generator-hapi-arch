'use strict';
const Generator = require('yeoman-generator');
const _ = require('lodash');
const path = require('path');
const utils = require('../../lib/utils');

const templatesDir = path.join(__dirname, './templates');

// load templates names
const templates = utils.loadExtFromDir(templatesDir, '.template');
const availableTemplates = _.map(templates, 'name');
utils.shiftToEnd(availableTemplates, 'other');

module.exports = class extends Generator {
  prompting() {

    const prompts = [];

    const compType = this.options.compType ? utils.capitalize(this.options.compType) : null;

    /**
     * run the following block only
     * if this was a sub generator
     * e.g part of the plugin generator
     * or the full app generator.
     */
    if (!this.options.isSub) {
      prompts.push(
        {
          type: 'input',
          name: 'pluginName',
          message: 'plugin name?',
          default: 'pluginName'
        },
        {
          type: "list",
          name: "compTypeList",
          message: "what to include in your project?",
          choices: availableTemplates,
          default: 'controller'
        },
        {
          when: function (res) {
            return res.compTypeList === 'other';
          },
          type: 'input',
          name: 'compTypeInput',
          message: 'component type?',
          default: 'controller'
        }
      );
    }

    prompts.push(
      {
        type: 'input',
        name: 'compName',
        message: 'component name?',
        default: compType ? `Test${compType}` : 'TestController'
      }
    );


    return this.prompt(prompts).then(props => {
      this.props = props;
      // check if this is a sub generator to a plugin, set the plugin information.
      if (this.options.isSub) {
        this.props.pluginName = this.options.pluginInfo.props.pluginName;
        this.props.compType = this.options.compType;
      }
      else {
        this.props.compType = this.props.compTypeInput || this.props.compTypeList;
      }
    });
  }

  writing() {
    // format the template data
    const templateData = {
      serviceName: null,
      modelName: null,
      isSub: false
    };

    if (this.options.isSub) {
      templateData.serviceName = this.props.compName.replace('Controller', 'Service');
      templateData.modelName = this.props.compName.replace('Service', '');
      templateData.isSub = true;
    }

    // format source and dest paths
    const compType = this.props.compType || this.options.compType;
    const src = _(templates)
      .map('file')
      .find(temp => temp === `${compType}.template`);
    const srcPath = src ? this.templatePath(src) : this.templatePath('other.template');
    const destPath = this.destinationPath(`api/${this.props.pluginName}/${src ? compType + 's' : compType}/${this.props.compName}.js`);

    // compile and copy the template to the dest folder
    this.fs.copyTpl(srcPath, destPath, templateData);
  }
};
