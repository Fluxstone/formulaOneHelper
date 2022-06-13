module.exports = {
    translation : {
        'GREETING' : [                  // <- or an array of strings.
            'Willkommen zum Formel 1 Helfer! Du kannst mich über Ergebnisse, Rennzeiten und Tabellenplätze befragen!'
        ],
        'RACE_WINNER' : [
            'Den ersten Platz belegt %s während %s den zweiten Platz belegte. Dritter wurde %s .',
            'Erster wurde %s , zweiter %s und dritter %s .'
        ],
        'RACE_TABLE_QUESTION' : [ //Möchtest du die ganze Tabelle hören?
            'Möchtest du die ganze Tabelle hören? In diesem Fall sage einfach: Ja',
        ], 
        'NEXT_RACE_DATE' : [
            'Der %s findet am %s statt.'
        ],
        //Make Race_placement2 where "Drivername belegt placement"
        'RACE_PLACEMENT' : [
            'Platz %s belegte %s',
            'Den %s Platz belegt %s',
        ],
        'QUALI_WINNER' : [
            'Erster im Qualifying wurde %s mit einer Zeit von %s , gefolgt von %s mit einer Zeit von %s auf dem zweiten Platz während den dritten Platz %s mit einer Zeit von %s belegte',
        ],
        'QUALI_TABLE_FIRST_HALF' : [
            'Erster Platz %s . Zweiter Platz %s . Dritter Platz %s . Vierter Platz %s . Fünfter Platz %s . Sechster Platz %s . Siebter Platz %s . Achter Platz %s . Neunter Platz %s . Zehnter Platz %s .',
        ],
        'QUALI_TABLE_SECOND_HALF' : [
            'Elfter Platz %s . Zwölfter Platz %s . Dreizehnter Platz %s . Vierzehnter Platz %s . Fünfzehnter Platz %s . Sechszehnter Platz %s . Siebzehnter Platz %s . Achtzehnter Platz %s . Neunzehnter Platz %s . Zwanzigster Platz %s.',
        ],
        'QUALI_QUESTION' : [ //Möchtest du die ganze Tabelle hören?
            'Möchtest du die ganze Tabelle hören? In diesem Fall sage einfach: Ja',
        ], 
        'DRIVER_LEADER' : [
            'Erster ist %s mit %s Punkten gefolgt von %s mit %s Punkten. Dritter ist %s mit %s Punkten.',
        ],
        'DRIVER_PLACEMENT' : [
            'Platz %s wird von %s mit %s Punkten belegt.',
        ],
        'CONSTRUCTOR_LEADER' : [
            'Erster ist %s mit %s Punkten gefolgt von %s mit %s Punkten. Dritter ist %s mit %s Punkten.',
        ],
        'CONSTRUCTOR_PLACEMENT' : [
            'Platz %s wird von %s mit %s Punkten belegt',
        ],
        'CLOSING_SKILL_NORMAL' : [
            'Skill wird geschlossen! Bis zum nächsten mal!'
        ],
        'CANCEL_INTENT_HANDLER' : [
            'Aktion abgebrochen.'
        ],
        'HELP_INTENT_HANDLER' : [
            'Du kannst mich zu verschiedenen Kategorien wie Renn- und Qualifyingergebnissen sowie Fahrer- und Konstrukteurstabellen befragen. Versuche es mal mit: Wer hat das letzte Rennen gewonnen? Wer wurde zehnter in Runde 4 in 2014? Wer führt die Konstrukteurs Tabelle in dieser Saison an? Bei weiteren Fragen schau auf der Website www.f1Helper.com nach.'
        ],
        'STOP_INTENT_HANDLER' : [
            'Skill wird geschlossen! Bis zum nächsten mal!'
        ],
        'FALLBACK_INTENT_HANDLER' : [
            'Irgendetwas ist schief gelaufen! Bitte versuche es nochmal!"'
        ],
        'ERROR_INTENT_HANDLER' : [
            'Ein Fehler ist aufgetreten. Skill wird geschlossen.'
        ],
        'CONTEXT_ERROR_HANDLER' : [
            'Tut mir leid, etwas ist schief gelogen. Bitte starte den Dialog erneut.'
        ],
    }
}