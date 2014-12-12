'use strict';

var React       = require('react');
var Interpolate = require('react-interpolate-component');
var translate   = require('counterpart');
var extend      = require('object-assign');

var Translate = React.createClass({
  displayName: 'Translate',

  propTypes: {
    locale: React.PropTypes.string,
    count:  React.PropTypes.number,

    content: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.arrayOf(React.PropTypes.string)
    ]),

    scope: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.arrayOf(React.PropTypes.string)
    ]),

    attributes: React.PropTypes.object
  },

  statics: {
    textContentComponents: ['title', 'option', 'textarea']
  },

  getDefaultProps: function() {
    return { component: 'span' };
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
    var textContent = Translate.textContentComponents.indexOf(this.props.component) > -1;
    var interpolate = textContent || this.props.unsafe === true;
    var props       = extend({ locale: this.state.locale }, this.props, { interpolate: interpolate });

    if (props.attributes) {
      for (var attribute in props.attributes) {
        if (props.attributes[attribute]) {
          props[attribute] = translate(props.attributes[attribute], props);
        }
      }

      delete props.attributes;
    }

    if (props.content) {
      var translation = translate(props.content, props);

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
