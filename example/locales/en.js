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
      one:    '<i>One second</i> has passed since requesting the page.',
      other:  '<i>%(count)s seconds</i> have passed since requesting the page.'
    },

    locale_prop_text: 'Although this sentence is fetched from translation data, it does not change when switching the language because the locale is hard-coded as a prop here.',

    you_clicked_on: 'You clicked on %(what)s.'
  }
};
