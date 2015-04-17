'use strict';

var React       = require('react');
var Interpolate = require('react-interpolate-component');
var translator  = require('counterpart');
var extend      = require('object-assign');

var PropTypes = React.PropTypes;

var translatorType = PropTypes.shape({
  getLocale:        PropTypes.func,
  onLocaleChange:   PropTypes.func,
  offLocaleChange:  PropTypes.func,
  translate:        PropTypes.func
});

var Translate = React.createClass({
  displayName: 'Translate',

  contextTypes: {
    translator: translatorType
  },

  propTypes: {
    locale: PropTypes.string,
    count:  PropTypes.number,

    content: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string)
    ]),

    scope: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string)
    ]),

    attributes: PropTypes.object
  },

  statics: {
    textContentComponents: ['title', 'option', 'textarea']
  },

  getDefaultProps: function() {
    return { component: 'span' };
  },

  getInitialState: function() {
    return { locale: this.getTranslator().getLocale() };
  },

  getTranslator: function() {
    return this.context.translator || translator;
  },

  componentDidMount: function() {
    if (!this.props.locale) {
      this.getTranslator().onLocaleChange(this.localeChanged);
    }
  },

  componentWillUnmount: function() {
    if (!this.props.locale) {
      this.getTranslator().offLocaleChange(this.localeChanged);
    }
  },

  localeChanged: function(newLocale) {
    this.setState({ locale: newLocale });
  },

  render: function() {
    var translator  = this.getTranslator();
    var textContent = Translate.textContentComponents.indexOf(this.props.component) > -1;
    var interpolate = textContent || this.props.unsafe === true;
    var props       = extend({ locale: this.state.locale }, this.props, { interpolate: interpolate });

    if (props.attributes) {
      for (var attribute in props.attributes) {
        if (props.attributes[attribute]) {
          props[attribute] = translator.translate(props.attributes[attribute], props);
        }
      }

      delete props.attributes;
    }

    if (props.content) {
      var translation = translator.translate(props.content, props);

      delete props.content;
      delete props.locale;
      delete props.scope;
      delete props.children;
      delete props.interpolate;

      return React.createElement(Interpolate, props, translation);
    } else {
      delete props.locale;
      delete props.scope;
      delete props.interpolate;

      return React.createElement(props.component, props);
    }
  }
});

module.exports = Translate;

module.exports.translate = function(key, options) {
  return React.createElement(Translate, extend({}, options, { content: key }));
};

module.exports.translatorType = translatorType;
