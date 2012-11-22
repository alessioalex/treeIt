     __                        ______   __
    /\ \__                    /\__  _\ /\ \__
    \ \ ,_\  _ __    __     __\/_/\ \/ \ \ ,_\
     \ \ \/ /\`'__\/'__`\ /'__`\ \ \ \  \ \ \/
      \ \ \_\ \ \//\  __//\  __/  \_\ \__\ \ \_
       \ \__\\ \_\\ \____\ \____\ /\_____\\ \__\
        \/__/ \/_/ \/____/\/____/ \/_____/ \/__/


## Intro

treeIt is a tiny JavaScript library that will transform you JS objects into HTML, without any properties change.
It can be used in both Node.js && the browser.

..meaning this:

```js
var data = [{
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
}];
```

becomes this:

```html
<ul>
  <li class="branch">
    <span class="branchRoot">0</span>
    <ul>
      <li class="branch">
        <span class="branchRoot">name</span>
        <ul><li class="leaf">'John Doe'</li></ul>
      </li>
      <li class="branch">
        <span class="branchRoot">married</span>
        <ul><li class="leaf">false</li></ul>
      </li>
      <li class="branch">
        <span class="branchRoot">age</span>
        <ul><li class="leaf">25</li></ul>
      </li>
      <li class="branch">
        <span class="branchRoot">job</span>
        <ul>
          <li class="branch">
            <span class="branchRoot">title</span>
            <ul><li class="leaf">'programmer'</li></ul>
          </li>
          <li class="branch">
            <span class="branchRoot">location</span>
            <ul><li class="leaf">'SF'</li></ul>
          </li>
          <li class="branch">
            <span class="branchRoot">time</span>
            <ul><li class="leaf">'8h/day'</li></ul>
          </li>
          <li class="branch">
            <span class="branchRoot">collegues</span>
            <ul>
              <li class="branch">
                <span class="branchRoot">0</span>
                <ul><li class="leaf">'Mariah'</li></ul>
              </li>
              <li class="branch">
                <span class="branchRoot">1</span>
                <ul><li class="leaf">'Johnny'</li></ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li class="branch">
        <span class="branchRoot">hobbies</span>
        <ul>
          <li class="branch">
            <span class="branchRoot">0</span>
            <ul><li class="leaf">'swimming'</li></ul>
          </li>
          <li class="branch">
            <span class="branchRoot">1</span>
            <ul><li class="leaf">'skating'</li></ul>
          </li>
        </ul>
      </li>
    </ul>
  </li>
  <li class="branch">
    <span class="branchRoot">1</span>
    <ul>
      <li class="branch">
        <span class="branchRoot">name</span>
        <ul><li class="leaf">'Patrick'</li></ul>
      </li>
      <li class="branch">
        <span class="branchRoot">details</span>
        <ul><li class="leaf">'unknown'</li></ul>
      </li>
    </ul>
  </li>
</ul>
```

..with a single line of code:

```js
treeIt.generate(myJsObj);
```

## Quick demo in the browser

http://jsbin.com/ajakam

## Installation

Node - install it with NPM:

```bash
$ npm install treeIt
```

Browser - include the script in the page:

&lt;script src="treeIt.min.js" &gt;&lt;/script&gt;

## Usage

### Browser:

```js
var htmlOutput;

obj = [{
  name : 'John',
  age  : 23
}, {
  name    : 'Mary',
  age     : 38,
  hobbies : ['swimming'], married: false
}];

htmlOutput = treeIt.generate(obj);
console.log(htmlOutput);
```

### Node.js:

Just include the treeIt module at the beginning of the snippet above:

```js
var treeIt = require('treeit');
// same as browser (see above)
```

### Don't like the default HTML templates used by treeIt? Pass in your own!

```js
var customTmpl, githubRepos, htmlOutput;

customTmpl = {
  root       : '<div class="tree">{{data}}</div>',
  branch     : '<div class="subTree">{{data}}</div>',
  branchRoot : '<span class="subTreeMaster">{{data}}</span>',
  leaf       : '<div class="singleItem">{{data}}</div>'
};

githubRepos = [
  {
    "id"   : 3,
    "name" : "octocat/Hello-World",
    "url"  : "https://api.github.com/repos/octocat/Hello-World"
  },
  {
    "id"   : 4,
    "name" : "octocat/Hello-World2",
    "url"  : "https://api.github.com/repos/octocat/Hello-World2"
  }
];

htmlOutput = treeIt.generate(githubRepos, customTmpl);
console.log(htmlOutput);
```

Output =>

```html
<div class="tree">
  <div class="subTree">
    <span class="subTreeMaster">0</span>
    <div class="tree">
      <div class="subTree">
        <span class="subTreeMaster">id</span>
        <div class="singleItem">3</div>
      </div>
      <div class="subTree">
        <span class="subTreeMaster">name</span>
        <div class="singleItem">'octocat/Hello-World'</div>
      </div>
      <div class="subTree">
        <span class="subTreeMaster">url</span>
        <div class="singleItem">'https://api.github.com/repos/octocat/Hello-World'</div>
      </div>
    </div>
  </div>
  <div class="subTree">
    <span class="subTreeMaster">1</span>
    <div class="tree">
      <div class="subTree">
        <span class="subTreeMaster">id</span>
        <div class="singleItem">4</div>
      </div>
      <div class="subTree">
        <span class="subTreeMaster">name</span>
        <div class="singleItem">'octocat/Hello-World2'</div>
      </div>
      <div class="subTree">
        <span class="subTreeMaster">url</span>
        <div class="singleItem">'https://api.github.com/repos/octocat/Hello-World2'</div>
      </div>
    </div>
  </div>
</div>
```

### Use .noConflict() if you don't want window.treeIt

```js
var myOwnVar = treeIt.noConflict();
```

## Browser support

It works in IE7 && IE8, so it should work everywhere ;-)

## Running tests

```js
$ npm install
$ npm test
```

## Building production & dev versions

```js
$ npm run-script build
```

The script above will generate treeIt.js && treeIt.min.js.

## License

> (The MIT License)
>
>Copyright (c) 2012 &lt;alexandru.vladutu@gmail.com&gt;
>
>Permission is hereby granted, free of charge, to any person obtaining
>a copy of this software and associated documentation files (the
>'Software'), to deal in the Software without restriction, including
>without limitation the rights to use, copy, modify, merge, publish,
>distribute, sublicense, and/or sell copies of the Software, and to
>permit persons to whom the Software is furnished to do so, subject to
>the following conditions:
>
>The above copyright notice and this permission notice shall be
>included in all copies or substantial portions of the Software.

>THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
>EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
>MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
>IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
>CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
>TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
>SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
