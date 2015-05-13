# React Translate Component

Translate is a component for [React][1] that utilizes the [Counterpart module][2] and the [Interpolate component][3] to provide multi-lingual/localized text content. It allows switching locales without a page reload.


## Installation

Install via npm:

```bash
% npm install react-translate-component
```


## Usage

Here is a quick-start tutorial to get you up and running with Translate. It's a step-by-step guide on how to build a simple app that uses the Translate component from scratch. We assume you have recent versions of [Node.js][5] and [npm][6] installed.

First, let's create a new project:

```bash
$ mkdir translate-example
$ cd translate-example
$ touch client.js
$ npm init                   # accept all defaults here
```

Next, add a dependency to our Translate component:

```bash
$ npm install react-translate-component --save
```

This also installs React and Counterpart because these are configured as a peer dependencies.

We will put our application logic into `client.js`. Open the file in your favorite editor and add the following lines:

```js
'use strict';

var counterpart = require('counterpart');
var React       = require('react');
var Translate   = require('react-translate-component');
```

This loads the localization library, React and our Translate component.

Let's write our entry-point React component. Add the following code to the file:

```jsx
var MyApp = React.createClass({
  render: function() {
    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <title>React Translate Quick-Start</title>
          <script src="/bundle.js" />
        </head>

        <body>
          --> body content will be added soon <--
        </body>
      </html>
    );
  }
});

if (typeof window !== 'undefined') {
  window.onload = function() {
    React.render(<MyApp />, document);
  };
}

module.exports = MyApp;
```

Now we have the basic HTML chrome for our tiny little app.

Next, we will create a LocaleSwitcher component which will be used to, well, switch locales. Here is the code to append to `client.js`:

```jsx
var LocaleSwitcher = React.createClass({
  handleChange: function(e) {
    counterpart.setLocale(e.target.value);
  },

  render: function() {
    return (
      <p>
        <span>Switch Locale:</span>

        <select defaultValue={counterpart.getLocale()} onChange={this.handleChange}>
          <option>en</option>
          <option>de</option>
        </select>
      </p>
    );
  }
});
```

For demonstration purposes, we don't bother and hard-code the available locales.

Whenever the user selects a different locale from the drop-down, we correspondingly set the new drop-down's value as locale in the Counterpart library, which in turn triggers an event that our (soon to be integrated) Translate component listens to. As initially active value for the select element we specify Counterpart's current locale ("en" by default).

Now add LocaleSwitcher as child of the empty body element of our MyApp component:

```jsx
        <body>
          <LocaleSwitcher />
        </body>
```

Next, we create a Greeter component that is going to display a localized message which will greet you:

```jsx
var Greeter = React.createClass({
  render: function() {
    return <Translate {...this.props} content="example.greeting" />;
  }
});
```

In the component's render function, we simply transfer all incoming props to Translate (the component this repo is all about). As `content` property we specify the string "example.greeting" which acts as the key into the translations dictionary of Counterpart.

Now add the new Greeter component to the body element, provide a `name` prop holding your first name and a `component` prop which is set to "h1":

```jsx
        <body>
          <LocaleSwitcher />
          <Greeter name="Martin" component="h1" />
        </body>
```

The value of the `name` prop will be interpolated into the translation result. The `component` prop tells Translate which HTML tag to render as container element (a `<span>` by default).

All that's left to do is to add the actual translations. You do so by calling the `registerTranslations` function of Counterpart. Add this to `client.js`:

```js
counterpart.registerTranslations('en', {
  example: {
    greeting: 'Hello %(name)s! How are you today?'
  }
});

counterpart.registerTranslations('de', {
  example: {
    greeting: 'Hallo, %(name)s! Wie geht\'s dir heute so?'
  }
});
```

In the translations above we defined placeholders (in sprintf's named arguments syntax) which will be interpolated with the value of the `name` prop we gave to the Greeter component.

That's it for the application logic. To eventually see this working in a browser, we need to create the server-side code that will be executed by Node.js.

First, let's install some required dependencies and create a `server.js` file:

```bash
$ npm install express connect-browserify reactify node-jsx --save
$ touch server.js
```

Now open up `server.js` and add the following lines:

```js
'use strict';

var express     = require('express');
var browserify  = require('connect-browserify');
var reactify    = require('reactify');
var React       = require('react');

require('node-jsx').install();

var App = React.createFactory(require('./client'));

express()
  .use('/bundle.js', browserify.serve({
    entry: __dirname + '/client',
    debug: true, watch: true,
    transforms: [reactify]
  }))
  .get('/', function(req, res, next) {
    res.send(React.renderToString(App()));
  })
  .listen(3000, function() {
    console.log('Point your browser to http://localhost:3000');
  });
```

Note that you shouldn't use this code in production as the `bundle.js` file will be compiled on every request.

Last but not least, start the application:

```bash
$ node server.js
```

It should tell you to point your browser to [http://localhost:3000][8]. There you will find the page greeting you. Observe that when switching locales the greeting message adjusts its text to the new locale without ever reloading the page or doing any ajax magic.

Please take a look at this repo's `spec.js` file to see some more nice tricks like translating HTML element attributes (title, placeholder etc.). To become a master craftsman we encourage you to also read [Counterpart's README][7].


## Asynchronous Rendering on the Server-side

The above example for `server.js` will not work when you're calling `React.renderToString(...)` within the callback of an async function and calling `counterpart.setLocale(...)` synchronously outside of that callback. This is because the Counterpart module is used as a singleton instance inside of the Translate component. See PR [#6] for details.

To fix this, create a wrapper component (or extend your root component) and pass an instance of Counterpart as React context. Here's an example:

```js
var http = require('http');
var Translator = require('counterpart').Instance;
var React = require('react');
var Translate = require('react-translate-component');
var MyApp = require('./my/components/App');

var en = require('./my/locales/en');
var de = require('./my/locales/de');

var Wrapper = React.createClass({
  childContextTypes: {
    translator: Translate.translatorType
  },

  getChildContext: function() {
    return {
      translator: this.props.translator
    };
  },

  render: function() {
    return <MyApp data={this.props.data} />;
  }
});

http.createServer(function(req, res) {
  var queryData = url.parse(req.url, true).query;

  var translator = new Translator();
  translator.registerTranslations('en', en);
  translator.registerTranslations('de', de);
  translator.setLocale(req.locale || 'en');

  doAsyncStuffHere(function(err, data) {
    if (err) { return err; }

    var html = React.renderToString(<Wrapper data={data} translator={translator} />);

    res.write(html);
  });
}).listen(3000);
```

## An Advanced Example

The code for a more sophisticated example can be found in the repo's `example` directory. You can clone this repository and run `make install example` and point your web browser to `http://localhost:3000`. In case you are too lazy for that, we also have a [live demo of the example app][4].


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
[4]: http://react-translate-demo.martinandert.com/
[5]: http://nodejs.org/
[6]: https://www.npmjs.org/
[7]: https://github.com/martinandert/counterpart#readme
[8]: http://localhost:3000
