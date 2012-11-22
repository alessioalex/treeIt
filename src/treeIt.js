(function() {
  "use strict";

  /**
   * Variable declarations
   */
  var root, treeIt, originalTreeIt, types, len, i;

  /**
   * Initializations
   */
  root           = this;
  originalTreeIt = root.treeIt;
  treeIt         = {};
  types          = [
    'Object', 'Array', 'Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'
  ];

  /**
   * Assign isType method to treeIt
   *
   * @param {String}
   */
  function createIsType(typeName) {
    treeIt['is' + typeName] = function(obj) {
      return Object.prototype.toString.call(obj) == '[object ' + typeName + ']';
    };
  }

  /**
   * isType methods:
   * isObject, isArguments, isFunction, isString, isNumber, isDate, isRegExp.
   */
  for (i = 0, len = types.length; i < len; i++) {
    createIsType(types[i]);
  }

  /**
   * Returns the object's keys, using the native Object.keys function if
   * available or the polyfill from MDN:
   * https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/keys
   *
   * Example:
   *
   *    var myObj = { name: 'John', job: 'programmer' };
   *    // this will output ['name', 'job']
   *    alert(treeIt.getKeys(myObj));
   *
   * @param {Object}
   * @return {Array}
   */
  treeIt.getKeys = Object.keys || (function () {
    var hasOwnProp, hasDontEnumBug, dontEnums, dontEnumsLength;

    hasOwnProp = Object.prototype.hasOwnProperty;
    hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString');
    dontEnums = [
      'toString',
      'toLocaleString',
      'valueOf',
      'hasOwnProperty',
      'isPrototypeOf',
      'propertyIsEnumerable',
      'constructor'
    ];
    dontEnumsLength = dontEnums.length;

    return function (obj) {
      var result, prop, i;

      result = [];

      if ((typeof obj !== 'object') && (typeof obj !== 'function') || (obj === null))  {
        throw new TypeError('Object.keys called on non-object');
      }

      for (prop in obj) {
        if (hasOwnProp.call(obj, prop)) { result.push(prop); }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProp.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }

      return result;
    };
  }());

  /**
   * Check if param is an array or an object.
   *
   * Example:
   *
   *    var count = 2;
   *    treeIt.hasBranches(count) === false;
   *    var props = { a: 1, b: 2 };
   *    treeIt.hasBranches(props) === true;
   *
   * @param {Object}
   * @return {Boolean}
   */
  treeIt.hasBranches = function(obj) {
    return (
      (typeof obj !== 'undefined' && obj !== null) &&
      (treeIt.isObject(obj) || treeIt.isArray(obj))
    );
  };

  /**
   * Returns an array with the param's keys.
   *
   * @param {Object} obj
   * @return {Array}
   */
  treeIt.getBranches = function(obj) {
    return (treeIt.hasBranches(obj)) ? treeIt.getKeys(obj) : [];
  };

  /**
   * Return default templates, Mustache style
   *
   * @return {String}
   */
  treeIt.getDefaultTemplates = function() {
    return {
      root       : '<ul>{{data}}</ul>',
      branch     : '<li class="branch">{{data}}</li>',
      branchRoot : '<span class="branchRoot">{{data}}</span>',
      leaf       : '<ul><li class="leaf">{{data}}</li></ul>'
    };
  };

  /**
   * Basic templating function that replaces '{{data}}' from the template `tmpl`
   * with `data` and returns the updates template.
   *
   * Example:
   *
   *    var tmpl = 'Hello {{data}}!';
   *    // this will output 'Hello world!'
   *    alert(treeIt.tmpl(tmpl, 'world'));
   *
   * @param {String} tmpl
   * @param {String} data
   * @return {String}
   */
  treeIt.tmpl = function(tmpl, data) {
    if (typeof data !== "undefined" && data !== null) {
      return tmpl.replace('{{data}}', data);
    } else {
      return '';
    }
  };

  /**
   * Return the html rendered template for a single item (that doesn't have
   * subbranches). Strings are rendered between '', to distinguish between
   * String and Number/Boolean.
   *
   * @param {String} data
   * @return {String}
   */
  treeIt.renderSingleLeaf = function(data) {
    if (treeIt.isString(data)) { data = "'" + data + "'"; }
    return treeIt.tmpl(treeIt.templates.leaf, data);
  };

  /**
   * Recursively traverse the `root` object's keys && sub-keys and return the
   * html code.
   *
   * @param {Object} root
   * @return {String}
   */
  treeIt.traverse = function(root) {
    var html, branches, i, len, branchHtml;

    html     = '';
    branches = treeIt.getBranches(root);

    if (!branches.length) {
      html += treeIt.renderSingleLeaf(root);
    } else {
      for (i = 0, len = branches.length; i < len; i++) {
        branchHtml = treeIt.tmpl(treeIt.templates.branchRoot, branches[i]);
        if (treeIt.hasBranches(root[branches[i]])) {
          branchHtml += treeIt.traverse(root[branches[i]]);
        } else {
          branchHtml += treeIt.renderSingleLeaf(root[branches[i]]);
        }

        html += treeIt.tmpl(treeIt.templates.branch, branchHtml);
      }
      html = treeIt.tmpl(treeIt.templates.root, html);
    }

    return html;
  };

  /**
   * Generate the HTML code for the `root` Object. If the second optional param
   * `templates` is passed, that will override the default templates.
   *
   * Example:
   *
   *    var data = [{
   *      name    : 'John Doe',
   *      married : false,
   *      age     : 25,
   *      job: {
   *        title     : 'programmer',
   *        location  : 'SF',
   *        time      : '8h/day',
   *        collegues : ['Mariah', 'Johnny']
   *      },
   *      hobbies: ['swimming', 'skating']
   *    }, {
   *      name    : 'Patrick',
   *      details : 'unknown'
   *    }];
   *
   *    var html = treeIt.generate(myObject);
   *    // ---------------------------------
   *
   *    html will contain the following code:
   *
   *    <ul>
   *      <li class="branch">
   *        <span class="branchRoot">0</span>
   *        <ul>
   *          <li class="branch">
   *            <span class="branchRoot">name</span>
   *            <ul><li class="leaf">'John Doe'</li></ul>
   *          </li>
   *          <li class="branch">
   *            <span class="branchRoot">married</span>
   *            <ul><li class="leaf">false</li></ul>
   *          </li>
   *          <li class="branch">
   *            <span class="branchRoot">age</span>
   *            <ul><li class="leaf">25</li></ul>
   *          </li>
   *          <li class="branch">
   *            <span class="branchRoot">job</span>
   *            <ul>
   *              <li class="branch">
   *                <span class="branchRoot">title</span>
   *                <ul><li class="leaf">'programmer'</li></ul>
   *              </li>
   *              <li class="branch">
   *                <span class="branchRoot">location</span>
   *                <ul><li class="leaf">'SF'</li></ul>
   *              </li>
   *              <li class="branch">
   *                <span class="branchRoot">time</span>
   *                <ul><li class="leaf">'8h/day'</li></ul>
   *              </li>
   *              <li class="branch">
   *                <span class="branchRoot">collegues</span>
   *                <ul>
   *                  <li class="branch">
   *                    <span class="branchRoot">0</span>
   *                    <ul><li class="leaf">'Mariah'</li></ul>
   *                  </li>
   *                  <li class="branch">
   *                    <span class="branchRoot">1</span>
   *                    <ul><li class="leaf">'Johnny'</li></ul>
   *                  </li>
   *                </ul>
   *              </li>
   *            </ul>
   *          </li>
   *          <li class="branch">
   *            <span class="branchRoot">hobbies</span>
   *            <ul>
   *              <li class="branch">
   *                <span class="branchRoot">0</span>
   *                <ul><li class="leaf">'swimming'</li></ul>
   *              </li>
   *              <li class="branch">
   *                <span class="branchRoot">1</span>
   *                <ul><li class="leaf">'skating'</li></ul>
   *              </li>
   *            </ul>
   *          </li>
   *        </ul>
   *      </li>
   *      <li class="branch">
   *        <span class="branchRoot">1</span>
   *        <ul>
   *          <li class="branch">
   *            <span class="branchRoot">name</span>
   *            <ul><li class="leaf">'Patrick'</li></ul>
   *          </li>
   *          <li class="branch">
   *            <span class="branchRoot">details</span>
   *            <ul><li class="leaf">'unknown'</li></ul>
   *          </li>
   *        </ul>
   *      </li>
   *    </ul>
   *
   * @param {Object} root
   * @param {Object} templates
   * @return {String}
   */
  treeIt.generate = function(root, templates) {
    var tmplKeys, i, len, res;

    treeIt.templates = treeIt.getDefaultTemplates();

    if (treeIt.isObject(templates)) {
      tmplKeys = treeIt.getBranches(templates);
      for (i = 0, len = tmplKeys.length; i < len; i++) {
        treeIt.templates[tmplKeys[i]] = templates[tmplKeys[i]];
      }
    }

    return treeIt.traverse(root);
  };

  /**
   * Run treeIt in *noConflict* mode, returning the `treeIt` variable to its
   * previous owner. Returns a reference to the treeIt object.
   */
  treeIt.noConflict = function() {
    root.treeIt = originalTreeIt;
    return treeIt;
  };

  /**
   * Check if it's a Node.js module and export it, else
   * assign treeIt object to the global context
   */
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = treeIt;
  } else {
    root.treeIt = treeIt;
  }
}).call(this);
