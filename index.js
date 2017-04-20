/*!
 * base-helpers <https://github.com/node-base/base-helpers>
 *
 * Copyright (c) 2016-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

var isObject = require('isobject');
var HelperCache = require('helper-cache');
var isValidApp = require('is-valid-app');
var debug = require('debug')('base-helpers');

module.exports = function() {
  return function(app) {
    if (!isValid(app)) return;
    app._ = app._ || {};

    /**
     * Prime the helpers cache on "app"
     */

    var helpers = app._.helpers || (app._.helpers = {async: {}, sync: {}});

    /**
     * Create loader objects
     */

    var async = new HelperCache({cache: helpers.async, async: true});
    var sync = new HelperCache({cache: helpers.sync});

    app._.helpers.async = async.cache;
    app._.helpers.sync = sync.cache;

    /**
     * Register a template helper.
     *
     * ```js
     * app.helper('upper', function(str) {
     *   return str.toUpperCase();
     * });
     * ```
     * @name .helper
     * @param {String} `name` Helper name
     * @param {Function} `fn` Helper function.
     * @api public
     */

    app.define('helper', function(name) {
      debug('registering sync helper "%s"', name);
      sync.load.apply(sync, arguments);
      return this;
    });

    /**
     * Register multiple template helpers.
     *
     * ```js
     * app.helpers({
     *   foo: function() {},
     *   bar: function() {},
     *   baz: function() {}
     * });
     * ```
     * @name .helpers
     * @param {Object|Array} `helpers` Object, array of objects, or glob patterns.
     * @api public
     */

    app.define('helpers', function(name, helpers) {
      if (typeof name === 'string' && isHelperGroup(helpers)) {
        return this.helperGroup.apply(this, arguments);
      }
      sync.load.apply(sync, arguments);
      return this;
    });

    /**
     * Register an async helper.
     *
     * ```js
     * app.asyncHelper('upper', function(str, next) {
     *   next(null, str.toUpperCase());
     * });
     * ```
     * @name .asyncHelper
     * @param {String} `name` Helper name.
     * @param {Function} `fn` Helper function
     * @api public
     */

    app.define('asyncHelper', function(name, fn) {
      debug('registering async helper "%s"', name);
      if (typeof fn === 'function') {
        fn.async = true;
      }
      async.load.apply(async, arguments);
      return this;
    });

    /**
     * Register multiple async template helpers.
     *
     * ```js
     * app.asyncHelpers({
     *   foo: function() {},
     *   bar: function() {},
     *   baz: function() {}
     * });
     * ```
     * @name .asyncHelpers
     * @param {Object|Array} `helpers` Object, array of objects, or glob patterns.
     * @api public
     */

    app.define('asyncHelpers', function(name, helpers) {
      if (typeof name === 'string' && isHelperGroup(helpers)) {
        return this.helperGroup.apply(this, arguments);
      }
      async.load.apply(async, arguments);
      return this;
    });

    /**
     * Get a previously registered helper.
     *
     * ```js
     * var fn = app.getHelper('foo');
     * ```
     * @name .getHelper
     * @param {String} `name` Helper name
     * @returns {Function} Returns the registered helper function.
     * @api public
     */

    app.define('getHelper', function(name) {
      debug('getting sync helper "%s"', name);
      return sync.getHelper(name);
    });

    /**
     * Get a previously registered async helper.
     *
     * ```js
     * var fn = app.getAsyncHelper('foo');
     * ```
     * @name .getAsyncHelper
     * @param {String} `name` Helper name
     * @returns {Function} Returns the registered helper function.
     * @api public
     */

    app.define('getAsyncHelper', function(name) {
      debug('getting async helper "%s"', name);
      return async.getHelper(name);
    });

    /**
     * Return true if sync helper `name` is registered.
     *
     * ```js
     * if (app.hasHelper('foo')) {
     *   // do stuff
     * }
     * ```
     * @name .hasHelper
     * @param {String} `name` sync helper name
     * @returns {Boolean} Returns true if the sync helper is registered
     * @api public
     */

    app.define('hasHelper', function(name) {
      return typeof sync.getHelper(name) === 'function';
    });

    /**
     * Return true if async helper `name` is registered.
     *
     * ```js
     * if (app.hasAsyncHelper('foo')) {
     *   // do stuff
     * }
     * ```
     * @name .hasAsyncHelper
     * @param {String} `name` Async helper name
     * @returns {Boolean} Returns true if the async helper is registered
     * @api public
     */

    app.define('hasAsyncHelper', function(name) {
      return typeof async.getHelper(name) === 'function';
    });

    /**
     * Register a namespaced helper group.
     *
     * ```js
     * // markdown-utils
     * app.helperGroup('mdu', {
     *   foo: function() {},
     *   bar: function() {},
     * });
     *
     * // Usage:
     * // <%%= mdu.foo() %>
     * // <%%= mdu.bar() %>
     * ```
     * @name .helperGroup
     * @param {Object|Array} `helpers` Object, array of objects, or glob patterns.
     * @api public
     */

    app.define('helperGroup', function(name, helpers, isAsync) {
      debug('registering helper group "%s"', name);
      if (isAsync) {
        async.loadGroup(name, helpers);
      } else {
        sync.loadGroup(name, helpers);
      }
      return this;
    });
  };
};

/**
 * Return false if `app` is not a valid instance of `Base`, or
 * the `base-helpers` plugin is alread registered.
 */

function isValid(app) {
  if (isValidApp(app, 'base-helpers', ['app', 'views', 'collection'])) {
    debug('initializing <%s>, from <%s>', __filename, module.parent.id);
    return true;
  }
  return false;
}

/**
 * Return true if the given value is a helper "group"
 */

function isHelperGroup(helpers) {
  if (!helpers) return false;
  if (typeof helpers === 'function' || isObject(helpers)) {
    var len = Object.keys(helpers).length;
    var min = helpers.async ? 1 : 0;
    return helpers.isGroup === true || len > min;
  }
  if (Array.isArray(helpers)) {
    return helpers.isGroup === true;
  }
  return false;
}
