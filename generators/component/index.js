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
          default: 'exampleName'
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

    if (!this.options.isSub || (this.options.isSub && !this.options.isExample)) {
      prompts.push(
        {
          type: 'input',
          name: 'compName',
          message: `the name of your${compType ? ` ${compType} ` : ' '}component?`,
          default: compType ? `Example${compType}` : 'ExampleController'
        }
      );
    }

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  writing() {

    const { pluginData, compData } = formatGeneratorData({ props: this.props, options: this.options });

    const templateData = {
      serviceName: null,
      modelName: null,
      isSub: false
    };

    if (this.options.isSub && this.options.isExample) {
      const capCompType = utils.capitalize(compData.compType);
      templateData.serviceName = compData.compName.replace(capCompType, 'Service');
      if (pluginData.hasModel) {
        templateData.modelName = compData.compName.replace(capCompType, 'Model');
      }
      templateData.isSub = true;
    }

    // format source and dest paths
    const src = _(templates)
      .map('file')
      .find(temp => temp === `${compData.compType}.template`);
    const srcPath = src ? this.templatePath(src) : this.templatePath('other.template');
    const destPath = this.destinationPath(`api/${pluginData.pluginName}/${compData.compPath}/${compData.compName}.js`);

    // compile and copy the template to the dest folder
    this.fs.copyTpl(srcPath, destPath, templateData);
  }
};

function formatGeneratorData ({ props, options }) {
  const geneData = {
    pluginData: {},
    compData: {}
  };

  geneData.compData.compType = props.compTypeInput || props.compTypeList || options.compType;
  geneData.compData.compName = props.compName || 'Example' + utils.capitalize(geneData.compData.compType);
  geneData.compData.compPath = props.compTypeInput ? geneData.compData.compType : `${geneData.compData.compType}s`;

  geneData.pluginData.pluginName = props.pluginName || options.pluginInfo.pluginName;
  geneData.pluginData.hasModel = options.hasModel;

  return geneData;
}
