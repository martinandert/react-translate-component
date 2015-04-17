'use strict';

var React       = require('react');
var Interpolate = require('react-interpolate-component');
var counterpart = require('counterpart');
var extend      = require('object-assign');

var Translate = React.createClass({
  displayName: 'Translate',

  contextTypes: {
    counterpart: React.PropTypes.object
  },

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
    return {
      locale: (this.context.counterpart || counterpart).getLocale()
    };
  },

  componentDidMount: function() {
    if (!this.props.locale) {
      (this.context.counterpart || counterpart).onLocaleChange(this.localeChanged);
    }
  },

  componentWillUnmount: function() {
    if (!this.props.locale) {
      (this.context.counterpart || counterpart).offLocaleChange(this.localeChanged);
    }
  },

  localeChanged: function(newLocale) {
    this.setState({ locale: newLocale });
  },

  translate: function() {
    var cp = this.context.counterpart || counterpart;
    return cp.translate.apply(cp, arguments);
  },

  render: function() {
    var textContent = Translate.textContentComponents.indexOf(this.props.component) > -1;
    var interpolate = textContent || this.props.unsafe === true;
    var props       = extend({ locale: this.state.locale }, this.props, { interpolate: interpolate });

    if (props.attributes) {
      for (var attribute in props.attributes) {
        if (props.attributes[attribute]) {
          props[attribute] = this.translate(props.attributes[attribute], props);
        }
      }

      delete props.attributes;
    }

    if (props.content) {
      var translation = this.translate(props.content, props);

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
