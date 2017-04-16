'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var createReactClass = require('create-react-class');
var counterpart = require('counterpart');
var Translate = require('react-translate-component');

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

var LanguageSwitcher = createReactClass({
  handleChange: function(e) {
    counterpart.setLocale(e.target.value);
  },

  render: function() {
    var options = this.props.locales.map(function(locale) {
      var translationKey = 'example.languages.' + locale;

      return <Translate key={locale} value={locale} component="option" content={translationKey} />;
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

var PersonName = createReactClass({
  handleClick: function(e) {
    alert(counterpart.translate('example.you_clicked_on', { what: this.props.name }));
  },

  render: function() {
    return <Translate component="strong" attributes={{ title: 'example.click_me' }} onClick={this.handleClick}>{this.props.name}</Translate>;
  }
});

var PeopleList = createReactClass({
  render: function() {
    var items = this.props.people.map(function(person, index) {
      var name = <PersonName name={person.name} />;

      return (
        <Translate key={'p-' + index}
          component="li" className="person"
          scope="example" content="person_age_sentence"
          with={{ firstName: name, count: person.age }}
        />
      );
    }, this);

    return (
      <section>
        <Translate component="h1" content="example.headline" />
        <ul>{items}</ul>
      </section>
    );
  }
});

var SecondsPassed = createReactClass({
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
    return <Translate component="p" with={{ count: this.state.seconds }} content="example.seconds_passed" unsafe />;
  }
});

var App = createReactClass({
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
    var bundlePath = '/assets/bundle.' + (process.env.NODE_ENV === 'production' ? 'min.js' : 'js');

    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <title>React Translate Component</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <script src={bundlePath} />
        </head>

        <body>
          <LanguageSwitcher locales={this.props.locales} />
          <PeopleList people={this.props.people} />
          <SecondsPassed />
          <Translate locale="en" component="p" content="example.locale_prop_text" unsafe />

          <hr style={{ marginTop: 100 }} />
          <p style={{ fontSize: 'small' }}>
            This demo showcases the {' '}
            <a href="https://github.com/martinandert/react-translate-component">React Translate Component</a>.
            You can find the source code for this example {' '}
            <a href="https://github.com/martinandert/react-translate-component/tree/master/example">here</a>.
          </p>
        </body>
      </html>
    );
  }
});

if (typeof window !== 'undefined') {
  window.React = React;

  window.onload = function() {
    ReactDOM.render(<App />, document);
  };
}

module.exports = App;
