var assert      = require('assert');
var React       = require('react');
var ReactDOM    = require('react-dom/server');
var counterpart = require('counterpart');
var TranslClass = require('./');
var Translate   = React.createFactory(TranslClass);
var render      = ReactDOM.renderToStaticMarkup;

counterpart.registerTranslations('en', {
  test: {
    greeting: 'Hello, %(name)s!',
    greeting_html: 'Hello, <b>%(name)s</b>!',
    tooltip: 'Hey there, %(name)s!',
    foo: 'bar %(x)s baz'
  },

  search_input: {
    placeholder: 'Search...',
    tooltip: 'Enter a search term'
  },

  submit_button: {
    label: 'Submit Form',
    tooltip: 'Click me!'
  }
});

counterpart.registerTranslations('de', {
  test: {
    greeting: 'Hallo %(name)s!',
    greeting_html: 'Hallo <b>%(name)s</b>!',
    tooltip: 'Wie geht\'s, %(name)s?',
    foo: 'bar %(x)s baz'
  },

  search_input: {
    placeholder: 'Suchen...',
    tooltip: 'Suchbegriff eingeben'
  },

  submit_button: {
    label: 'Formular absenden',
    tooltip: 'Klick mich!'
  }
});

// hack: raise React console warnings as failed assertions
console.error = function(message) {
  assert(false, message);
};

describe('The Translate component', function() {
  it('transfers props', function() {
    var props  = { component: 'h1', className: 'foo', content: 'bar' };
    var markup = render(Translate(props));

    assert.matches(/^<h1 [^>]*?class="foo"/, markup);
  });

  it('translates stuff properly', function() {
    counterpart.withLocale('en', function() {
      assert.matches(/Hello, Martin/, render(Translate({ with: { name: 'Martin' }, content: 'test.greeting' })));
      assert.matches(/Hello, Martin/, render(Translate({ with: { name: 'Martin' }, content: ['test', 'greeting'] })));

      assert.matches(/Hello, <b>Martin<\/b>!/, render(Translate({ with: { name: 'Martin' }, unsafe: true, content: 'test.greeting_html' })));
      assert.matches(/Hello, <b>Martin<\/b>!/, render(Translate({ with: { name: React.DOM.b(null, 'Martin') }, content: 'test.greeting' })));

      var propsWithScope = { with: { name: 'Martin' }, scope: ['test'], content: 'greeting' };

      assert.matches(/Hello, Martin/, render(Translate(propsWithScope)));
      assert.doesNotMatch(/\sscope="test"/, render(Translate(propsWithScope)));
    });
  });

  it('translates stuff properly using the deprecated way of providing interpolations', function() {
    counterpart.withLocale('en', function() {
      assert.matches(/Hello, Martin/, render(Translate({ name: 'Martin', content: 'test.greeting' })));
      assert.matches(/Hello, Martin/, render(Translate({ name: 'Martin', content: ['test', 'greeting'] })));

      assert.matches(/Hello, <b>Martin<\/b>!/, render(Translate({ name: 'Martin', unsafe: true, content: 'test.greeting_html' })));
      assert.matches(/Hello, <b>Martin<\/b>!/, render(Translate({ name: React.DOM.b(null, 'Martin'), content: 'test.greeting' })));

      var propsWithScope = { name: 'Martin', scope: ['test'], content: 'greeting' };

      assert.matches(/Hello, Martin/, render(Translate(propsWithScope)));
      assert.doesNotMatch(/\sscope="test"/, render(Translate(propsWithScope)));
    });
  });

  it('supports the translation of HTML element attributes', function() {
    counterpart.withLocale('en', function() {
      var props = { component: 'input', type: 'search', name: 'q', scope: 'search_input', attributes: { placeholder: 'placeholder', title: 'tooltip' } };
      var markup = render(Translate(props));

      assert.matches(/^<input [^>]+>$/, markup);
      assert.matches(/\stype="search"/, markup);
      assert.matches(/\sname="q"/, markup);
      assert.matches(/\splaceholder="Search..."/, markup);
      assert.matches(/\stitle="Enter a search term"/, markup);
      assert.doesNotMatch(/\sscope=/, markup);
    });

    counterpart.withLocale('de', function() {
      var props = { component: 'button', type: 'submit', content: 'submit_button.label', attributes: { title: 'submit_button.tooltip' } };
      var markup = render(Translate(props));

      assert.matches(/^<button [^>]+>Formular absenden<\/button>$/, markup);
      assert.matches(/\stype="submit"/, markup);
      assert.matches(/\stitle="Klick mich!"/, markup);
    });

    counterpart.withLocale('en', function() {
      var props = { with: { x: 'foo' }, attributes: { title: 'test.foo' } };
      var markup = render(Translate(props));

      assert.matches(/\stitle="bar foo baz"/, markup);
    });
  });

  it('does not translate its children (since v0.7 the content attribute is used to translate the, well... content)', function() {
    counterpart.withLocale('de', function() {
      var props = { component: 'button', type: 'submit', attributes: { title: 'submit_button.tooltip' } };
      var markup = render(Translate(props, React.DOM.span(null, 'Do it!')));

      assert.matches(/^<button [^>]+><span[^>]*>Do it!<\/span><\/button>$/, markup);
      assert.matches(/\stitle="Klick mich!"/, markup);
    });
  });

  it('respects Counterpart\'s current locale', function() {
    counterpart.withLocale('de', function() {
      assert.matches(/Hallo/, render(Translate({ with: { name: 'Martin' }, content: 'test.greeting' })));
      assert.doesNotMatch(/^missing translation:/, render(Translate({ with: { name: 'Martin' } }, 'test.greeting')));
    });
  });

  it('respects Counterpart\'s current scope', function() {
    counterpart.withScope('test', function() {
      assert.matches(/Hello/, render(Translate({ with: { name: 'Martin' }, content: 'greeting' })));
      assert.doesNotMatch(/^missing translation:/, render(Translate({ with: { name: 'Martin' }, content: 'greeting' })));
    });
  });

  describe('with the `component` prop set to a "text-only" React component', function() {
    it('does not render HTML markup inside that component', function() {
      // TODO add special treatment for <textarea>
      ['option', 'title'].forEach(function(tagName) {
        var props = { component: tagName, with: { name: 'Martin' }, content: 'test.greeting' };
        var markup = render(Translate(props));

        assert.matches(new RegExp('^<' + tagName + '[^>]*>[^<>]*<\/' + tagName + '>$'), markup);
      });
    });
  });

  describe('with the `locale` prop explicitly set', function() {
    it('disrespects the "global" locale', function() {
      var props = { locale: 'de', with: { name: 'Martin' }, component: 'title', content: 'test.greeting' };
      var markup = render(Translate(props));

      counterpart.withLocale('en', function() {
        assert.matches(/Hallo Martin!/, markup);
      });
    });
  });

  it('provides a counterpart-inspired convenience method for building components', function() {
    var _t = TranslClass.translate;
    var component = _t('greeting', {
      scope: 'test', with: { name: 'Martin' }, unsafe: true,
      attributes: { title: 'tooltip' }
    });

    assert(React.isValidElement(component));

    counterpart.withLocale('de', function() {
      var markup = render(component);
      assert.matches(/^<span\s.*?title="Wie geht&#x27;s, Martin\?"[^>]*>Hallo Martin!<\/span>$/, markup);
      assert.doesNotMatch(/\sscope="test"/, markup);
    });

    assert.matches(/^<span[^>]*>Click me!<\/span>$/, render(_t('submit_button.tooltip')));
  });

  it('allows a translator to be passed via React\'s context', function() {
    var Wrapper = React.createClass({
      childContextTypes: {
        translator: TranslClass.translatorType
      },

      getChildContext: function() {
        return {
          translator: this.props.translator
        };
      },

      render: function() {
        return Translate({ content: 'foo', attributes: { title: 'bar' } });
      }
    });

    Wrapper = React.createFactory(Wrapper);

    var markup;
    var translator = new counterpart.Instance();
    translator.registerTranslations('de', { foo: 'FOO-DE', bar: 'BAR-DE' });
    translator.registerTranslations('en', { foo: 'FOO-EN', bar: 'BAR-EN' });

    translator.setLocale('en');
    markup = render(Wrapper({ translator: translator }));
    assert.matches(/FOO-EN/, markup);
    assert.matches(/BAR-EN/, markup);

    translator.setLocale('de');
    markup = render(Wrapper({ translator: translator }));
    assert.matches(/FOO-DE/, markup);
    assert.matches(/BAR-DE/, markup);
  });

  it('provides a withTranslations decorator', function() {
    function test(Component) {
      var markup;
      var Component = React.createFactory(Component);

      markup = render(Component({ locale: 'en' }));
      assert.matches(/FOO-EN/, markup);

      markup = render(Component({ locale: 'de' }));
      assert.matches(/FOO-DE/, markup);
    }

    var withTranslations = TranslClass.withTranslations;

    var Component = React.createClass({
      render: function() {
        return Translate({ content: 'foo', locale: this.props.locale });
      }
    });

    test(withTranslations({ de: { foo: 'FOO-DE' }, en: { foo: 'FOO-EN' } })(Component));
    test(withTranslations(Component, { de: { foo: 'FOO-DE' }, en: { foo: 'FOO-EN' } }));
  });

  it('can register and de-register an onLocaleChange listener', function() {
    var setLocale = TranslClass.setLocale;

    function onLocaleChangeListener(expectedLocale, newLocale) {
      assert.equal(newLocale, expectedLocale);
    }

    var cb = onLocaleChangeListener.bind(null, 'de');
    TranslClass.onLocaleChange(cb);
    setLocale('de');
    TranslClass.offLocaleChange(cb);

    cb = onLocaleChangeListener.bind(null, 'en');
    TranslClass.onLocaleChange(cb);
    setLocale('en');
    TranslClass.offLocaleChange(cb);
  });
});



// spec helpers

assert.matches = function(regexp, value, message) {
  if (!regexp.test(value)) {
    assert.fail(value, regexp, message, '=~');
  }
};

assert.doesNotMatch = function(regexp, value, message) {
  if (regexp.test(value)) {
    assert.fail(value, regexp, message, '!~');
  }
};
