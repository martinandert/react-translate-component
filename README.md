# React Translate Component

A component for [React][1] that utilizes the [Counterpart module][2] and the [Interpolate component][3] to translate its content.


## Installation

Install via npm:

```bash
% npm install react-translate-component
```


## Usage

Here is step-by-step guide on how to build a simple app that uses this component from scratch. We assume you have [Node.js][5] and [npm][6] installed.

First, let's create a project:

```bash
$ mkdir translate-example
$ cd translate-example
$ npm init
```

Next, add a dependency to our Translate component:

```bash
npm install react-translate-component --save
```

This also installs React because it is configured as a peer dependency.

Then we need a JavaScript file to put our application logic into:

```bash
$ touch index.js
```

Open this file in your favorite editor and add the following lines:

```js
'use strict';

var counterpart = require('counterpart');
var React       = require('react');
var Interpolate = require('react-interpolate-component');
```

This loads the localization library, React and our Interpolate component.

Let's write our entry-point component. Add the following code to the file:

```js
var MyApp = React.createClass({
  displayName: 'MyApp',

  render: function() {
    return (
      React.DOM.html(null,
        React.DOM.head(null,
          React.DOM.script({ src: '/bundle.js' })
        ),

        React.DOM.body(null,
          /* body content will be added soon */
        )
      )
    );
  }
});

if (typeof window !== 'undefined') {
  window.onload = function() {
    React.renderComponent(MyApp(), document);
  };
}

module.exports = MyApp;
```

Now we have the basic chrome for our litte app.

Next, we will create a locale switcher component. Here the code to add to the file:

```js
var LocaleSwitcher = React.createClass({
  handleChange: function(e) {
    counterpart.setLocale(e.target.value);
  },

  render: function() {
    return (
      React.DOM.p(null,
        React.DOM.span(null, 'Switch Locale:'),

        React.DOM.select({ defaultValue: counterpart.getLocale(), onChange: this.handleChange }, 
          React.DOM.option(null, 'en'),
          React.DOM.option(null, 'de')
        )
      )
    );
  }
});
```

For our litte app, we hard-coded the available locales. Whenever the user selects a different locale from the drop-down, we set the locale in the Counterpart library, which in turn triggers an event that our soon to be integrated Translate component listens to.

*To be continued soon.*


## Example

The examples code is located at `example` directory. You can clone this repository and run `make install example` and point your web browser to
`http://localhost:3000`. In case you are too lazy for that, we also have a [live demo of the example app][4] on Heroku.


## Contributing

Here's a quick guide:

1. Fork the repo and `make install`.

2. Run the tests. We only take pull requests with passing tests, and it's great to know that you have a clean slate: `make test`.

3. Add a test for your change. Only refactoring and documentation changes require no new tests. If you are adding functionality or are fixing a bug, we need a test!

4. Make the test pass.

5. Push to your fork and submit a pull request.


## Licence

Released under The MIT License.



[1]: http://facebook.github.io/react/
[2]: https://github.com/martinandert/counterpart
[3]: https://github.com/martinandert/react-interpolate-component
[4]: http://react-translate-component.herokuapp.com/
[5]: http://nodejs.org/
[6]: https://www.npmjs.org/
