"use strict";

/* eslint camelcase: off */

const Generator = require("yeoman-generator");
const chalk = require("chalk");
const _ = require("lodash");
const deps = require("./deps.json");
const os = require("os");
const beautify = require("gulp-beautify");
const path = require('path');
const loader = require(path.join(__dirname, '..', '..', 'lib', 'templatesLoader'));
const templatesPath = path.join(__dirname, 'templates');

module.exports = class extends Generator {
  prompting() {
    const pkgs = _.map(deps.optional, "desc");
    const defaultPkgs = _(deps.optional)
      .filter("default")
      .map("desc")
      .value();

    const prompts = [
      {
        type: "input",
        name: "name",
        message: "Your project name:",
        default: this.appname
      },
      {
        type: "input",
        name: "version",
        message: "Your project version:",
        default: "0.1.0"
      },
      {
        type: "input",
        name: "desc",
        message: "description:",
        default: ""
      },
      {
        type: "input",
        name: "author",
        message: "author:",
        default: os.userInfo().username
      },
      {
        type: "checkbox",
        name: "deps",
        message: "what to include in your project?",
        choices: pkgs,
        default: defaultPkgs
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  pkgs() {
    let npmPkgs = _.map(deps.required, "name");

    const selectedPkgs = _.filter(deps.optional, x =>
      _.includes(this.props.deps, x.desc)
    );
    const selectedPkgsNames = _.map(selectedPkgs, "name");
    const selectedPkgsDeps = _(selectedPkgs)
      .map("deps")
      .flatten()
      .filter(x => x)
      .value();

    npmPkgs = _.union(npmPkgs, selectedPkgsNames, selectedPkgsDeps);
    this.npmPkgs = npmPkgs;
  }

  callSub() {
    this.composeWith(require.resolve('../plugin'),{ npmPkgs: this.npmPkgs, isSub: true });
  }

  paths() {
    const appPath = this.destinationPath(this.props.name);
    this.destinationRoot(appPath);
  }

  writing() {
    this.registerTransformStream(beautify({ 
      indent_size: 2,
      preserve_newlines: true,
      max_preserve_newlines: 2,
      jslint_happy: false
    }));

    return loader(this, templatesPath);
  }

  install() {
    // Commented for Testing
    return this.npmInstall(this.npmPkgs, {save: true});
    
  }
};
