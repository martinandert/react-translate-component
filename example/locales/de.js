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
      zero:   'Seit dem Aufruf dieser Webseite ist <b>noch keine Sekunde</b> vergangen.',
      one:    'Seit dem Aufruf dieser Webseite ist <b>eine Sekunde</b> vergangen.',
      other:  'Seit dem Aufruf dieser Webseite sind <b>%(count)s Sekunden</b> vergangen.'
    },

    locale_prop_text: 'Dieser deutsche Text sollte eigentlich niemals angezeigt werden, da hier das "locale" prop <i>explizit</i> auf "en" gesetzt wurde.',

    click_me: 'Klick mich!',
    you_clicked_on: 'Du hast auf %(what)s geklickt.'
  }
};
