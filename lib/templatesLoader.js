"use strict";

const fs = require("fs");
const _ = require("lodash");
const path = require("path");

module.exports = function(context, location) {
  return new Promise((resolve, reject) => {
    fs.readdir(location, (err, dir) => {
      if (err) {
        reject(err);
      } 
      else {
        _.forEach(dir, module => {
          const loaded = require(path.join(location, module));
          loaded.call(context);
        });
        resolve();
      }
    });
  });
};
