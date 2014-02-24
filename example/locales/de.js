module.exports = {
  example: {
    switch_language: 'Sprache ändern: ',

    languages: {
      en: 'Englisch',
      de: 'Deutsch'
    },

    headline: 'Personenliste',

    person_age_sentence: {
      zero:   '%(firstName)s ist nicht mal ein Jahr alt.',
      one:    '%(firstName)s ist genau ein Jahr alt.',
      other:  '%(firstName)s ist %(count)s Jahre alt.'
    },

    seconds_passed: {
      zero:   'Seit dem Aufruf dieser Webseite ist <i>noch keine Sekunde</i> vergangen.',
      one:    'Seit dem Aufruf dieser Webseite ist <i>eine Sekunde</i> vergangen.',
      other:  'Seit dem Aufruf dieser Webseite sind <i>%(count)s Sekunden</i> vergangen.'
    },

    locale_prop_text: 'Dieser deutsche Text sollte eigentlich niemals angezeigt werden, da hier das "locale" prop explizit auf "en" gesetzt wurde.',

    you_clicked_on: 'Du hast auf %(what)s geklickt.'
  }
};
