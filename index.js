/*!
 * base-helpers (https://github.com/node-base/base-helpers)
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var debug = require('debug')('base-helpers');

module.exports = function(config) {
  return function(app) {
    if (this.isRegistered('base-helpers')) return;
    debug('initializing "%s", from "%s"', __filename, module.parent.id);

    this.define('helpers', function() {
      debug('running helpers');
      
    });
  };
};
