'use strict';

var React       = require('react');
var counterpart = require('counterpart');
var Translate   = require('../');

// this is a counterpart-style convenience function that
// returns a React component
var _t = Translate.translate;

// this is required to disable counterpart's warning
// about a missing pluralization algorithm for German
counterpart.registerTranslations('de', require('counterpart/locales/de'));

// load our own translations
counterpart.registerTranslations('en', require('./locales/en'));
counterpart.registerTranslations('de', require('./locales/de'));

// uncomment the next line to set the initial locale to 'de'
//counterpart.setLocale('de');

var LanguageSwitcher = React.createClass({
  handleChange: function(e) {
    counterpart.setLocale(e.target.value);
  },

  render: function() {
    var options = this.props.locales.map(function(locale) {
      var translationKey = 'example.languages.' + locale;

      return <Translate key={locale} value={locale} component="option">{translationKey}</Translate>;
    });

    return (
      <p>
        { _t('example.switch_language') }

        <select defaultValue={counterpart.getLocale()} onChange={this.handleChange}>
          {options}
        </select>
      </p>
    );
  }
});

var PersonName = React.createClass({
  handleClick: function(e) {
    alert(counterpart.translate('example.you_clicked_on', { what: this.props.name }));
  },

  render: function() {
    return <strong onClick={this.handleClick}>{this.props.name}</strong>;
  }
});

var PeopleList = React.createClass({
  render: function() {
    var items = this.props.people.map(function(person, index) {
      var name = <PersonName name={person.name} />;

      var props = {
        key:        'p-' + index,
        firstName:  name,
        count:      person.age
      };

      return <Translate component="li" className="person" scope="example" {...props}>person_age_sentence</Translate>;
    }, this);

    return (
      <section>
        <Translate component="h1">example.headline</Translate>
        <ul>{items}</ul>
      </section>
    );
  }
});

var SecondsPassed = React.createClass({
  getInitialState: function() {
    return { seconds: 0 };
  },

  ticker: null,

  componentDidMount: function() {
    this.ticker = setInterval(this.tick, 1000);
  },

  componentWillUnmount: function() {
    clearInterval(this.ticker);
  },

  tick: function() {
    this.setState({ seconds: this.state.seconds + 1 });
  },

  render: function() {
    return <Translate component="p" count={this.state.seconds} unsafe>example.seconds_passed</Translate>;
  }
});

var App = React.createClass({
  getDefaultProps: function() {
    return {
      locales: ['en', 'de'],
      people: [
        { name: 'Peter', age: 0 },
        { name: 'Paula', age: 6 },
        { name: 'Frank', age: 1 }
      ]
    };
  },

  render: function() {
    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <title>React Translate Component</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <script src="/bundle.js"></script>
        </head>

        <body>
          <LanguageSwitcher locales={this.props.locales} />
          <PeopleList people={this.props.people} />
          <SecondsPassed />
          <Translate locale="en" component="p" unsafe={true}>example.locale_prop_text</Translate>
        </body>
      </html>
    );
  }
});

if (typeof window !== 'undefined') {
  window.React = React;

  window.onload = function() {
    React.render(<App />, document);
  };
}

module.exports = App;
