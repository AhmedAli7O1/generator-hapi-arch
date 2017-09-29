'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');

module.exports = {

  arrayToLines: function (arrayOfString) {
    let linesString = '';
    _.forEach(arrayOfString, x => linesString += x + '\n');
    return linesString;
  },

  arrayToString: function (dataArray) {
    return '[' + _.map(dataArray, x => '"' + x + '"').toString() + ']';
  },

  capitalize: function (text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  },

  loadExtFromDir: function (dir, ext) {
    const files = fs.readdirSync(dir);
    return _(files)
      .filter(file => path.extname(file) === ext)
      .map(file => {
        return {
          name: file.replace(ext, ''),
          ext: ext.slice(1),
          file: file
        };
      })
      .value();
  },

  moveElementToLast: function (arr, element) {
    const index = _.indexOf(arr, element);
    arr.splice(index, 1);
    arr.splice(arr.length - 1, 0, element);
    return arr;
  },

  shiftToEnd: function (arr, element) {
    _.pull(arr, element);
    arr.push(element);
    return arr;
  }

};