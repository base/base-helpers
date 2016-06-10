'use strict';

require('mocha');
var assert = require('assert');
var helpers = require('..');
var App = require('base');
var app;
App.use(function() {
  this.isApp = true;
});

describe('helpers', function() {
  describe('prototype methods', function() {
    beforeEach(function() {
      app = new App();
      app.use(helpers());
    });
    it('should expose `helper`', function() {
      assert.equal(typeof app.helper, 'function');
    });
    it('should expose `asyncHelper`', function() {
      assert.equal(typeof app.asyncHelper, 'function');
    });
  });

  describe('instance', function() {
    it('should prime _', function() {
      app = new App();
      app.use(helpers());
      assert.equal(typeof app._, 'object');
    });
  });

  describe('helpers', function() {
    beforeEach(function() {
      app = new App();
      app.use(helpers());
    });

    it('should add a sync helper to the `sync` object:', function() {
      app.helper('one', function() {});
      assert.equal(typeof app._.helpers.sync.one, 'function');
    });

    it('should load a glob of sync helper functions:', function() {
      app.helpers('test/fixtures/[a-c].js');

      assert.equal(typeof app._.helpers.sync.c, 'function');
      assert.equal(typeof app._.helpers.sync.b, 'function');
      assert.equal(typeof app._.helpers.sync.a, 'function');
    });

    it('should fail gracefully on bad globs:', function(cb) {
      try {
        app.helpers('test/fixtures/*.foo');
        cb();
      } catch (err) {
        cb(new Error('should not throw an error.'));
      }
    });

    it('should add a glob of sync helper objects:', function() {
      app.helpers('test/fixtures/!([a-c]).js');
      assert.equal(typeof app._.helpers.sync.one, 'function');
      assert.equal(typeof app._.helpers.sync.two, 'function');
      assert.equal(typeof app._.helpers.sync.three, 'function');
    });

    it('should add a glob with mixed helper objects and functions:', function() {
      app.helpers('test/fixtures/*.js');
      assert.equal(typeof app._.helpers.sync.a, 'function');
      assert.equal(typeof app._.helpers.sync.b, 'function');
      assert.equal(typeof app._.helpers.sync.c, 'function');
      assert.equal(typeof app._.helpers.sync.one, 'function');
      assert.equal(typeof app._.helpers.sync.two, 'function');
      assert.equal(typeof app._.helpers.sync.three, 'function');
    });

    it('should add an object of sync helpers to the `sync` object:', function() {
      app.helpers({
        x: function() {},
        y: function() {},
        z: function() {}
      });

      assert.equal(typeof app._.helpers.sync.x, 'function');
      assert.equal(typeof app._.helpers.sync.y, 'function');
      assert.equal(typeof app._.helpers.sync.z, 'function');
    });

    it('should add a helper "group":', function() {
      app.helperGroup('foo', {
        x: function() {},
        y: function() {},
        z: function() {}
      });

      assert.equal(typeof app._.helpers.sync.foo.x, 'function');
      assert.equal(typeof app._.helpers.sync.foo.y, 'function');
      assert.equal(typeof app._.helpers.sync.foo.z, 'function');
    });

    it('should merge helpers onto a helper "group":', function() {
      app.helperGroup('foo', {
        x: function() {},
        y: function() {},
        z: function() {}
      });

      assert.equal(typeof app._.helpers.sync.foo.x, 'function');
      assert.equal(typeof app._.helpers.sync.foo.y, 'function');
      assert.equal(typeof app._.helpers.sync.foo.z, 'function');

      app.helperGroup('foo', {
        a: function() {},
        b: function() {},
        c: function() {}
      });

      assert.equal(typeof app._.helpers.sync.foo.a, 'function');
      assert.equal(typeof app._.helpers.sync.foo.b, 'function');
      assert.equal(typeof app._.helpers.sync.foo.c, 'function');
      assert.equal(typeof app._.helpers.sync.foo.x, 'function');
      assert.equal(typeof app._.helpers.sync.foo.y, 'function');
      assert.equal(typeof app._.helpers.sync.foo.z, 'function');
    });
  });

  describe('async helpers', function() {
    beforeEach(function() {
      app = new App();
      app.use(helpers());
    });

    it('should add an async helper to the `async` object:', function() {
      app.asyncHelper('two', function() {});
      assert.equal(typeof app._.helpers.async.two, 'function');
    });

    it('should load a glob of async helper functions:', function() {
      app.asyncHelpers('test/fixtures/[a-c].js');
      assert.equal(typeof app._.helpers.async.a, 'function');
      assert.equal(typeof app._.helpers.async.b, 'function');
      assert.equal(typeof app._.helpers.async.c, 'function');
    });

    it('should add a glob of async helper objects:', function() {
      app.asyncHelpers('test/fixtures/!([a-c]).js');
      assert.equal(typeof app._.helpers.async.one, 'function');
      assert.equal(typeof app._.helpers.async.two, 'function');
      assert.equal(typeof app._.helpers.async.three, 'function');
    });

    it('should fail gracefully on bad globs:', function(cb) {
      try {
        app.asyncHelpers('test/fixtures/*.foo');
        cb();
      } catch (err) {
        cb(new Error('should not throw an error.'));
      }
    });

    it('should add a glob with mixed helper objects and functions:', function() {
      app.asyncHelpers('test/fixtures/*.js');
      assert.equal(typeof app._.helpers.async.a, 'function');
      assert.equal(typeof app._.helpers.async.b, 'function');
      assert.equal(typeof app._.helpers.async.c, 'function');
      assert.equal(typeof app._.helpers.async.one, 'function');
      assert.equal(typeof app._.helpers.async.two, 'function');
      assert.equal(typeof app._.helpers.async.three, 'function');
    });

    it('should add an object of async helpers to the `async` object:', function() {
      app.asyncHelpers({
        x: function() {},
        y: function() {},
        z: function() {}
      });

      assert.equal(typeof app._.helpers.async.x, 'function');
      assert.equal(typeof app._.helpers.async.y, 'function');
      assert.equal(typeof app._.helpers.async.z, 'function');
    });

    it('should add an async helper "group":', function() {
      app.helperGroup('foo', {
        x: function() {},
        y: function() {},
        z: function() {}
      }, true);

      assert.equal(typeof app._.helpers.async.foo.x, 'function');
      assert.equal(typeof app._.helpers.async.foo.y, 'function');
      assert.equal(typeof app._.helpers.async.foo.z, 'function');
    });

    it('should merge helpers onto an async helper "group":', function() {
      app.helperGroup('foo', {
        x: function() {},
        y: function() {},
        z: function() {}
      }, true);

      assert.equal(typeof app._.helpers.async.foo.x, 'function');
      assert.equal(typeof app._.helpers.async.foo.y, 'function');
      assert.equal(typeof app._.helpers.async.foo.z, 'function');


      app.helperGroup('foo', {
        a: function() {},
        b: function() {},
        c: function() {}
      }, true);

      assert.equal(typeof app._.helpers.async.foo.a, 'function');
      assert.equal(typeof app._.helpers.async.foo.b, 'function');
      assert.equal(typeof app._.helpers.async.foo.c, 'function');
      assert.equal(typeof app._.helpers.async.foo.x, 'function');
      assert.equal(typeof app._.helpers.async.foo.y, 'function');
      assert.equal(typeof app._.helpers.async.foo.z, 'function');
    });

    it('should add an async helper "group":', function() {
      app.helperGroup('foo', {
        x: function() {},
        y: function() {},
        z: function() {}
      }, true);

      assert.equal(typeof app._.helpers.async.foo.x, 'function');
      assert.equal(typeof app._.helpers.async.foo.y, 'function');
      assert.equal(typeof app._.helpers.async.foo.z, 'function');
    });
  });
});
