module.exports = {
  example: {
    switch_language: 'Switch Language: ',

    languages: {
      en: 'English',
      de: 'German'
    },

    headline: 'Listing People',

    person_age_sentence: {
      zero:   '%(firstName)s is not even a year old.',
      one:    '%(firstName)s is one year old.',
      other:  '%(firstName)s is %(count)s years old.'
    },

    seconds_passed: {
      one:    '<b>One second</b> has passed since requesting the page.',
      other:  '<b>%(count)s seconds</b> have passed since requesting the page.'
    },

    locale_prop_text: 'Although this sentence is fetched from translation data, it does not change when switching the language because the <i>locale is hard-coded as a prop</i> here.',

    you_clicked_on: 'You clicked on %(what)s.'
  }
};
