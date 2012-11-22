var treeIt = require('../src/treeIt');

describe('Utility functions', function() {

  describe('treeIt.isObject()', function() {
    it('should identify an object', function() {
      treeIt.isObject({a: 2, c: { e: 5 }}).should.be.true;
      treeIt.isObject({a: 3}).should.be.true;
      treeIt.isObject([1, 2, 3]).should.be.false;
      treeIt.isObject(1).should.be.false;
      treeIt.isObject("str").should.be.false;
    });
  });

  describe('treeIt.isArray()', function() {
    it('should identify an array', function() {
      treeIt.isArray([1, 2, 3]).should.be.true;
      treeIt.isArray([{ a: 2 }, 2, "str"]).should.be.true;
      treeIt.isArray({a: 2, c: { e: 5 }}).should.be.false;
      treeIt.isArray({a: 3}).should.be.false;
      treeIt.isArray(1).should.be.false;
      treeIt.isArray("str").should.be.false;
    });
  });

  describe('treeIt.isString()', function() {
    it('should identify an string', function() {
      treeIt.isString("str").should.be.true;
      treeIt.isString([1, 2, 3]).should.be.false;
      treeIt.isString({a: 3}).should.be.false;
      treeIt.isString(1).should.be.false;
    });
  });

  describe('treeIt.getKeys()', function() {
    it('should return the keys of an object', function() {
      treeIt.getKeys({ name: "john", job: "gardner" }).should.eql(['name', 'job']);
      treeIt.getKeys([2, 3, 5]).should.eql(['0', '1', '2']);
      (function() { treeIt.getKeys("123"); }).should.throw;
    });
  });

  describe('treeIt.hasBranches()', function() {
    it('should check for object/array', function() {
      treeIt.hasBranches({a: 2, c: { e: 5 }}).should.be.true;
      treeIt.hasBranches({a: 3}).should.be.true;
      treeIt.hasBranches([1, 2, 3]).should.be.true;
      treeIt.hasBranches(1).should.be.false;
      treeIt.hasBranches("str").should.be.false;
    });
  });

});

describe('HTML generation', function() {
  var fixtures = [{
    'obj': [{
      name    : 'John Doe',
      married : false,
      age     : 25,
      job     : {
        title     : 'programmer',
        location  : 'SF',
        time      : '8h/day',
        collegues : ['Mariah', 'Johnny']
      },
      hobbies: ['swimming', 'skating']
    }, {
      name    : 'Patrick',
      details : 'unknown'
    }],
    'html': '<ul><li class="branch"><span class="branchRoot">0</span><ul><li class="branch"><span class="branchRoot">name</span><ul><li class="leaf">\'John Doe\'</li></ul></li><li class="branch"><span class="branchRoot">married</span><ul><li class="leaf">false</li></ul></li><li class="branch"><span class="branchRoot">age</span><ul><li class="leaf">25</li></ul></li><li class="branch"><span class="branchRoot">job</span><ul><li class="branch"><span class="branchRoot">title</span><ul><li class="leaf">\'programmer\'</li></ul></li><li class="branch"><span class="branchRoot">location</span><ul><li class="leaf">\'SF\'</li></ul></li><li class="branch"><span class="branchRoot">time</span><ul><li class="leaf">\'8h/day\'</li></ul></li><li class="branch"><span class="branchRoot">collegues</span><ul><li class="branch"><span class="branchRoot">0</span><ul><li class="leaf">\'Mariah\'</li></ul></li><li class="branch"><span class="branchRoot">1</span><ul><li class="leaf">\'Johnny\'</li></ul></li></ul></li></ul></li><li class="branch"><span class="branchRoot">hobbies</span><ul><li class="branch"><span class="branchRoot">0</span><ul><li class="leaf">\'swimming\'</li></ul></li><li class="branch"><span class="branchRoot">1</span><ul><li class="leaf">\'skating\'</li></ul></li></ul></li></ul></li><li class="branch"><span class="branchRoot">1</span><ul><li class="branch"><span class="branchRoot">name</span><ul><li class="leaf">\'Patrick\'</li></ul></li><li class="branch"><span class="branchRoot">details</span><ul><li class="leaf">\'unknown\'</li></ul></li></ul></li></ul>'
  }, {
    'obj': {
      anArray : [1, 2, 3],
      aString : "str",
      bool    : false
    },
    'html': "<ul><li class=\"branch\"><span class=\"branchRoot\">anArray</span><ul><li class=\"branch\"><span class=\"branchRoot\">0</span><ul><li class=\"leaf\">1</li></ul></li><li class=\"branch\"><span class=\"branchRoot\">1</span><ul><li class=\"leaf\">2</li></ul></li><li class=\"branch\"><span class=\"branchRoot\">2</span><ul><li class=\"leaf\">3</li></ul></li></ul></li><li class=\"branch\"><span class=\"branchRoot\">aString</span><ul><li class=\"leaf\">'str'</li></ul></li><li class=\"branch\"><span class=\"branchRoot\">bool</span><ul><li class=\"leaf\">false</li></ul></li></ul>"
  }];

  it('should generate the html for the object', function() {
    var i, len;

    for (i = 0, len = fixtures.length; i < len; i++) {
      treeIt.generate(fixtures[i].obj).should.equal(fixtures[i].html);
    }

  });

  it('should generate the html for the object when custom templates provided', function() {
    var data, customTmpl, output;

    customTmpl = {
      root       : '<div class="list">{{data}}</div>',
      branch     : '<div class="group">{{data}}</div>',
      branchRoot : '<span class="leader">{{data}}</span>',
      leaf       : '<div class="item">{{data}}</div>'
    };

    data = { a: 1, b: { c: 2, d: 3, e: 'f' }};
    output = "<div class=\"list\"><div class=\"group\"><span class=\"leader\">a</span><div class=\"item\">1</div></div><div class=\"group\"><span class=\"leader\">b</span><div class=\"list\"><div class=\"group\"><span class=\"leader\">c</span><div class=\"item\">2</div></div><div class=\"group\"><span class=\"leader\">d</span><div class=\"item\">3</div></div><div class=\"group\"><span class=\"leader\">e</span><div class=\"item\">'f'</div></div></div></div></div>";

    treeIt.generate(data, customTmpl).should.equal(output);
  });

  it('should keep the default templates when no custom templates are passed', function() {
    var customTmpl, data;

    customTmpl = {
      root       : '<div class="list">{{data}}</div>',
      branch     : '<div class="group">{{data}}</div>',
      branchRoot : '<span class="leader">{{data}}</span>',
      leaf       : '<div class="item">{{data}}</div>'
    };

    data = { a: 1, b: { c: 2, d: 3, e: 'f' }};
    treeIt.generate(data, customTmpl);

    treeIt.generate(fixtures[0].obj).should.equal(fixtures[0].html);
  });

});
