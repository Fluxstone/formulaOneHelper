module.exports = {
    translation : {
        'SKILL_NAME' : 'Super Welcome', // <- can either be a string...
        'GREETING' : [                  // <- or an array of strings.
            'Hello there',
            'Hey',
            'Hi!'
        ],
        'GREETING_WITH_NAME' : [
            'Hey %s',         // --> That %s is a wildcard. It will
            'Hi there, %s',   //     get turned into a name in our code.
            'Hello, %s'       //     e.g. requestAttributes.t('GREETING_WITH_NAME', 'Andrea')
        ],
        // ...more...
        'GREETINGS' : 'FILLER',
        'RACE_WINNER' : [
            'Den ersten Platz belegt %s während %s den zweiten Platz belegte. Dritter wurde %s .',
            'Erster wurde %s , zweiter %s und dritter %s .'
        ],
        'RACE_TABLE_FIRST_HALF' : [
            'Erster Platz %s . Zweiter Platz %s . Dritter Platz %s . Vierter Platz %s . Fünfter Platz %s . Sechster Platz %s . Siebter Platz %s . Achter Platz %s . Neunter Platz %s . Zehnter Platz %s .',
            'SENTENCE',
            'SENTENCE',
        ],
        'RACE_TABLE_SECOND_HALF' : [ //Wenn es mehr oder weniger Fahrer gibt: What do?
            'SENTENCE',
            'SENTENCE',
            'SENTENCE',
        ],
        'RACE_TABLE_QUESTION' : [ //Möchtest du die ganze Tabelle hören?
            'SENTENCE',
            'SENTENCE',
            'SENTENCE', 
        ], 
        'RACE_PLACEMENT' : [
            'SENTENCE',
            'SENTENCE',
            'SENTENCE',
        ],
        'QUALI_WINNER' : [
            'SENTENCE',
            'SENTENCE',
            'SENTENCE',
        ],
        'QUALI_TABLE_Q1' : [
            'SENTENCE',
            'SENTENCE',
            'SENTENCE',
        ],
        'QUALI_TABLE_Q2' : [
            'SENTENCE',
            'SENTENCE',
            'SENTENCE',
        ],
        'QUALI_TABLE_Q3' : [
            'SENTENCE',
            'SENTENCE',
            'SENTENCE',
        ],
        'QUALI_TABLE_FIRST_HALF' : [
            'SENTENCE',
            'SENTENCE',
            'SENTENCE',
        ],
        'QUALI_TABLE_SECOND_HALF' : [
            'SENTENCE',
            'SENTENCE',
            'SENTENCE',
        ],
        'QUALI_QUESTION' : [ //Möchtest du die ganze Tabelle hören?
            'SENTENCE',
            'SENTENCE',
            'SENTENCE',
        ], 
        'QUALI_PLACEMENT' : [
            'SENTENCE',
            'SENTENCE',
            'SENTENCE',
        ],
        'DRIVER_TABLE' : [
            'SENTENCE',
            'SENTENCE',
            'SENTENCE',
        ],
        'DRIVER_LEADER' : [
            'SENTENCE',
            'SENTENCE',
            'SENTENCE',
        ],
        'DRIVER_PLACEMENT' : [
            'SENTENCE',
            'SENTENCE',
            'SENTENCE',
        ],
        'CONSTRUCTOR_TABLE' : [
            'SENTENCE',
            'SENTENCE',
            'SENTENCE',
        ],
        'CONSTRUCTOR_LEADER' : [
            'SENTENCE',
            'SENTENCE',
            'SENTENCE',
        ],
        'CONSTRUCTOR_PLACEMENT' : [
            'SENTENCE',
            'SENTENCE',
            'SENTENCE',
        ],
    }
}