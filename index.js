'use strict';

var React       = require('react');
var Interpolate = require('react-interpolate-component');
var translate   = require('counterpart');
var extend      = require('extend');

var Translate = React.createClass({
  displayName: 'Translate',

  propTypes: {
    locale: React.PropTypes.string,
    count:  React.PropTypes.number,

    children: React.PropTypes.oneOfType([
      React.PropTypes.string.isRequired,
      React.PropTypes.arrayOf(React.PropTypes.string).isRequired
    ]),

    scope: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.arrayOf(React.PropTypes.string)
    ]),
  },

  statics: {
    textContentComponents: [
      React.DOM.title,
      React.DOM.option,
      React.DOM.textarea
    ]
  },

  getInitialState: function() {
    return { locale: translate.getLocale() };
  },

  componentDidMount: function() {
    if (!this.props.locale) {
      translate.onLocaleChange(this.localeChanged);
    }
  },

  componentWillUnmount: function() {
    if (!this.props.locale) {
      translate.offLocaleChange(this.localeChanged);
    }
  },

  localeChanged: function(newLocale) {
    this.setState({ locale: newLocale });
  },

  render: function() {
    var container   = this.props.component || React.DOM.span;
    var textContent = Translate.textContentComponents.indexOf(container) > -1;
    var interpolate = textContent || this.props.unsafe === true;
    var options     = extend({ locale: this.state.locale }, this.props, { interpolate: interpolate });

    var translation = translate(this.props.children, options);

    delete options.locale;
    delete options.scope;
    delete options.children;
    delete options.interpolate;

    return Interpolate(options, translation);
  }
});

module.exports = Translate;

module.exports.translate = function(key, options) {
  return Translate(options, key);
};
