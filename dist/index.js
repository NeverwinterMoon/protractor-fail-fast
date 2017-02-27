'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _jasmineFailFast = require('jasmine-fail-fast');

/**
 * protractor-fail-fast
 *
 * For the lack of a better (known) option, using a file to communicate between test runners.
 * If the file exists, it means a test has failed in one (or more) of the runners. If a runner
 * detects that this file exists, it will exit using `jasmine-fail-fast`.
 *
 */

var TOUCH_ON_FAIL = (0, _path.resolve)(process.cwd(), './.protractor-failed');

exports['default'] = {
  // Custom hooks

  /**
   * Wrapper around `jasmine-fail-fast`'s `init`, which must be called in `onPrepare` as follows:
   * `jasmine.getEnv().addReporter(failFast.init());`
   *
   * Yet to find a way of automating this via a Protractor plugin hook. `jasmine` isn't available
   * in `setup`.
   */
  init: function init() {
    // Clean up the "fail file" before starting, in case it exists.
    // TODO: Would love to clean up on exit, but yet to find a hook/way to ensure that the file
    // isn't deleted before the last runner exits.
    this.clean();

    return (0, _jasmineFailFast.init)();
  },

  clean: function clean() {
    unsetFailed();
  },

  // Protractor hooks
  postTest: function postTest(passed) {
    if (!passed) {
      setFailed();
      (0, _jasmineFailFast.disableSpecs)();
    }
  }
};

function hasFailed() {
  return _fs2['default'].existsSync(TOUCH_ON_FAIL);
}

function setFailed() {
  _fs2['default'].closeSync(_fs2['default'].openSync(TOUCH_ON_FAIL, 'w'));
}

function unsetFailed() {
  if (hasFailed()) {
    _fs2['default'].unlinkSync(TOUCH_ON_FAIL);
  }
}
module.exports = exports['default'];
