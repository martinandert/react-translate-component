var assert      = require('assert');
var React       = require('react');
var counterpart = require('counterpart');
var TranslClass = require('./');
var Translate   = React.createFactory(TranslClass);
var render      = React.renderToString;

counterpart.registerTranslations('en', {
  test: {
    greeting: 'Hello, %(name)s!',
    greeting_html: 'Hello, <b>%(name)s</b>!'
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
    greeting_html: 'Hallo <b>%(name)s</b>!'
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

// raise React console warnings as failed assertions
console.warn = function(message) {
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
      assert.matches(/Hello, <\/span><span[^>]*>Martin/, render(Translate({ name: 'Martin', content: 'test.greeting' })));
      assert.matches(/Hello, <\/span><span[^>]*>Martin/, render(Translate({ name: 'Martin', content: ['test', 'greeting'] })));

      assert.matches(/Hello, <b>Martin<\/b>!/, render(Translate({ name: 'Martin', unsafe: true, content: 'test.greeting_html' })));
      assert.matches(/Hello, <\/span><b[^>]*>Martin<\/b><span[^>]*>!/, render(Translate({ name: React.DOM.b(null, 'Martin'), content: 'test.greeting' })));

      var propsWithScope = { name: 'Martin', scope: ['test'], content: 'greeting' };

      assert.matches(/Hello, <\/span><span[^>]*>Martin/, render(Translate(propsWithScope)));
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
  });

  it('respects Counterpart\'s current locale', function() {
    counterpart.withLocale('de', function() {
      assert.matches(/Hallo/, render(Translate({ name: 'Martin', content: 'test.greeting' })));
      assert.doesNotMatch(/^missing translation:/, render(Translate({ name: 'Martin' }, 'test.greeting')));
    });
  });

  it('respects Counterpart\'s current scope', function() {
    counterpart.withScope('test', function() {
      assert.matches(/Hello/, render(Translate({ name: 'Martin', content: 'greeting' })));
      assert.doesNotMatch(/^missing translation:/, render(Translate({ name: 'Martin', content: 'greeting' })));
    });
  });

  describe('with the `component` prop set to a "text-only" React component', function() {
    it('does not render HTML markup inside that component', function() {
      // TODO add special treatment for <textarea>
      ['option', 'title'].forEach(function(tagName) {
        var props = { component: tagName, name: 'Martin', content: 'test.greeting' };
        var markup = render(Translate(props));

        assert.matches(new RegExp('^<' + tagName + '[^>]*>[^<>]*<\/' + tagName + '>$'), markup);
      });
    });
  });

  describe('with the `locale` prop explicitly set', function() {
    it('disrespects the "global" locale', function() {
      var props = { locale: 'de', name: 'Martin', component: 'title', content: 'test.greeting' };
      var markup = render(Translate(props));

      counterpart.withLocale('en', function() {
        assert.matches(/Hallo Martin!/, markup);
      });
    });
  });

  it('provides a counterpart-inspired convenience method for building components', function() {
    var _t = TranslClass.translate;
    var component = _t('greeting', { scope: 'test', name: 'Martin', unsafe: true });

    assert(React.isValidElement(component));

    counterpart.withLocale('de', function() {
      var markup = render(component);
      assert.matches(/^<span[^>]*>Hallo Martin!<\/span>$/, markup);
      assert.doesNotMatch(/\sscope="test"/, markup);
    });

    assert.matches(/^<span[^>]*>Click me!<\/span>$/, render(_t('submit_button.tooltip')));
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
