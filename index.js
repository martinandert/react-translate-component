'use strict';

var React       = require('react');
var Interpolate = require('react-interpolate-component');
var translate   = require('globalization');
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

  key: null,

  render: function() {
    var parent  = this.props.component || React.DOM.span;
    var useIC   = Translate.textContentComponents.indexOf(parent) === -1;
    var root    = useIC ? Interpolate : parent;
    var options = extend(true, { locale: this.state.locale }, this.props, { interpolate: !useIC });

    this.key = this.key || this.props.children;

    var translation = translate(this.key, options);

    delete options.scope;
    delete options.children;

    return root(options, translation);
  }
});

module.exports = Translate;

module.exports.translate = function(key, options) {
  return Translate(options, key);
};
