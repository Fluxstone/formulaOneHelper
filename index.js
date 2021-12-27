const Alexa = require('ask-sdk-core');
const F1 = require("./helper/f1InfoClasses");

//i18n stuff
const i18n = require('i18next'); 
const sprintf = require('i18next-sprintf-postprocessor'); 

const languageStrings = {
  'de' : require('./i18n/de'),
  'en' : require('./i18n/en'),
}

// inside the index.js
const LocalizationInterceptor = {
  process(handlerInput) {
      const localizationClient = i18n.use(sprintf).init({
          lng: handlerInput.requestEnvelope.request.locale,
          fallbackLng: 'de', // fallback to DE if locale doesn't exist
          resources: languageStrings
      });

      localizationClient.localize = function () {
          const args = arguments;
          let values = [];

          for (var i = 1; i < args.length; i++) {
              values.push(args[i]);
          }
          const value = i18n.t(args[0], {
              returnObjects: true,
              postProcess: 'sprintf',
              sprintf: values
          });

          if (Array.isArray(value)) {
              return value[Math.floor(Math.random() * value.length)];
          } else {
              return value;
          }
      }

      const attributes = handlerInput.attributesManager.getRequestAttributes();
      attributes.t = function (...args) { // pass on arguments to the localizationClient
          return localizationClient.localize(...args);
      };
  },
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
      const speechText = 'Willkommen zum Formel 1 Helfer! Du kannst mich über Ergebnisse, Rennzeiten und Tabellenplätze befragen!';
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    }
};

/*
*
* All race-result related intent handler
*
*/
const GetPodiumInfoWithDateIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'GetPodiumInfoWithDate';
    },
    async handle(handlerInput) {
      const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
      var speechText = "";
      
      const slots = handlerInput.requestEnvelope.request.intent.slots;
      
      var year = slots.year.value;
      var round = slots.round.value;

      var race = new F1.Race(year, round);
      var recievedResponse = await race.getPodiumInfoAtTarget();

      first = recievedResponse.first;
      second = recievedResponse.second;
      third = recievedResponse.third;
      
      speechText = requestAttributes.t('RACE_WINNER', first, second, third);

      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    }
};

const GetPodiumInfoLatestIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'GetPodiumInfoLatest';
    },
    async handle(handlerInput) {
      // we get the translator 't' function from the request attributes
      const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
  
      var speechText = "";
      
      var race = new F1.Race("current", "last");
      var recievedResponse = await race.getPodiumInfoAtTarget();

      first = recievedResponse.first;
      second = recievedResponse.second;
      third = recievedResponse.third;
      
      speechText = requestAttributes.t('RACE_WINNER', first, second, third);

      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    }
};

const GetRaceTableWithDateIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'GetRaceTableWithDate';
    },
    async handle(handlerInput) {
      var speechText = "";
      
      const slots = handlerInput.requestEnvelope.request.intent.slots;
      
      var year = slots.year.value;
      var round = slots.round.value;

      var race = new F1.Race(year, round);
      var recievedResponse = await race.getRaceTableAtTarget(0);
            
      setIntentContext(handlerInput, "GetRaceTable_ALL_RESULTS");
      setRaceContext(handlerInput, year, round);
      
      speechText = recievedResponse + " Wenn du die restliche Tabellenplatzierungen hören möchtest sage einfach: Ja.";
      

      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    }
};

const GetRaceTableLatestIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'GetRaceTableLatest';
    },
    async handle(handlerInput) {
      var speechText = "";
      setIntentContext(handlerInput, "GetRaceTable_ALL_RESULTS");
      setRaceContext(handlerInput, "current", "last");
      
      
      var race = new F1.Race("current", "last");
      var recievedResponse = await race.getRaceTableAtTarget(0);
      
      speechText = recievedResponse + " Wenn du die restliche Tabellenplatzierungen hören möchtest sage einfach: Ja.";
      
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    }
};

//Bug Siebter geht nicht. 7 geht / undefined
const GetPlacementWithDateIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'GetPlacementWithDate';
    },
    async handle(handlerInput) {
      const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

      var speechText = "";

      const slots = handlerInput.requestEnvelope.request.intent.slots;
      
      var year = slots.year.value;
      var round = slots.round.value;
      var placement = slots.placement.value;

      var race = new F1.Race(year, round);
      var recievedResponse = await race.getPlacementAtTarget(placement);

      speechText = requestAttributes.t('RACE_PLACEMENT', placement, recievedResponse);
      
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    }
};

//Bug Siebter geht nicht. 7 geht / undefined
const GetPlacementLatestIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'GetPlacementLatest';
    },
    async handle(handlerInput) {
      const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

      var speechText = "";

      const slots = handlerInput.requestEnvelope.request.intent.slots;

      var placement = slots.placement.value;

      var race = new F1.Race("current", "last");
      var recievedResponse = await race.getPlacementAtTarget(placement);
      
      speechText = requestAttributes.t('RACE_PLACEMENT', placement, recievedResponse);
      
      
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    }
};

/*
*
* All qualifying-result related intent handler
*
*/
const GetQualifyingPodiumWithDateIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'GetQualifyingPodiumWithDate';
    },
    async handle(handlerInput) {
      const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
      var speechText = "";

      const slots = handlerInput.requestEnvelope.request.intent.slots;

      var year = slots.year.value;
      var round = slots.round.value;
      
      var race = new F1.Race(year, round);
      var recievedResponse = await race.getQualifyingPodiumInfo();
      
      speechText = requestAttributes.t('QUALI_WINNER', recievedResponse.first, recievedResponse.firstTime, recievedResponse.second, recievedResponse.secondTime, recievedResponse.third, recievedResponse.thirdTime);
      
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    }
};

const GetQualifyingPodiumLatestIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'GetQualifyingPodiumLatest';
    },
    async handle(handlerInput) {
      const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

      var speechText = "";

      var race = new F1.Race("current", "last");
      var recievedResponse = await race.getQualifyingPodiumInfo();
      
      speechText = requestAttributes.t('QUALI_WINNER', recievedResponse.first, recievedResponse.firstTime, recievedResponse.second, recievedResponse.secondTime, recievedResponse.third, recievedResponse.thirdTime);
      
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    }
};

const GetQualifyingRaceTableLatestIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'GetQualifyingRaceTableLatest';
    },
    async handle(handlerInput) {
      var speechText = "";

      var race = new F1.Race("current", "last");
      var recievedResponse = await race.getQualifyingRaceTable(0);
      
      setIntentContext(handlerInput, "GetQualifyingRaceTable_ALL_RESULTS");
      setRaceContext(handlerInput, "current", "last");
      
      speechText = recievedResponse + " Wenn du die restliche Tabellenplatzierungen hören möchtest sage einfach: Ja.";
      
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    }
};

const GetQualifyingRaceTableWithDateIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'GetQualifyingRaceTableWithDate';
    },
    async handle(handlerInput) {
      var speechText = "";
      
      const slots = handlerInput.requestEnvelope.request.intent.slots;
      
      var year = slots.year.value;
      var round = slots.round.value;
      
      setIntentContext(handlerInput, "GetQualifyingRaceTable_ALL_RESULTS");
      setRaceContext(handlerInput, year, round);

      var race = new F1.Race(year, round);
      var recievedResponse = await race.getQualifyingRaceTable(0);
      
      
      speechText = recievedResponse + " Wenn du die restliche Tabellenplatzierungen hören möchtest sage einfach: Ja.";

      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    }
};

/*
*
* All driver- and constructor standings related intent handler
*
*/
const GetDriverStandingsTableLatestIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'GetDriverStandingsTableLatest';
    },
    async handle(handlerInput) {
      var speechText = "";
      
      setIntentContext(handlerInput, "GetDriverStandingsTable_ALL_RESULTS");
      setStandingsContext(handlerInput, "current");
      
      var standings = new F1.Standings("current");
      var recievedResponse = await standings.getDriverStandingsTable(0);
      
      speechText = recievedResponse + " Wenn du die restliche Tabellenplatzierungen hören möchtest sage einfach: Ja.";
      
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    }
};

const GetDriverStandingsLeadersLatestIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'GetDriverStandingsLeadersLatest';
    },
    async handle(handlerInput) {
      const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

      var speechText = "";
      
      var standings = new F1.Standings("current");
      var recievedResponse = await standings.getDriverStandingsLeaders();
      
      speechText = requestAttributes.t('DRIVER_LEADER', recievedResponse.firstPlaceDriver , recievedResponse.firstPlaceDriverPoints , recievedResponse.secondPlaceDriver , recievedResponse.secondPlaceDriverPoints , recievedResponse.thirdPlaceDriver , recievedResponse.thirdPlaceDriverPoints);
      
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    }
};

const GetDriverStandingsTableWithDateIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'GetDriverStandingsTableWithDate';
    },
    async handle(handlerInput) {
      var speechText = "";
      
      const slots = handlerInput.requestEnvelope.request.intent.slots;

      var year = slots.year.value;
      
      setIntentContext(handlerInput, "GetDriverStandingsTable_ALL_RESULTS");
      setStandingsContext(handlerInput, year);
      
      var standings = new F1.Standings(year);
      var recievedResponse = await standings.getDriverStandingsTable(0);
      
      speechText = recievedResponse + " Wenn du die restliche Tabellenplatzierungen hören möchtest sage einfach: Ja.";
      
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    }
};

const GetDriverStandingsPlacementLatestIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'GetDriverStandingsPlacementLatest';
    },
    async handle(handlerInput) {
      const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
      var speechText = "";
      
      const slots = handlerInput.requestEnvelope.request.intent.slots;

      var placement = slots.placement.value;
      
      var standings = new F1.Standings("current");
      var recievedResponse = await standings.getDriverStandingsPlacement(placement);

      speechText = requestAttributes.t('DRIVER_PLACEMENT', placement, recievedResponse.driver, recievedResponse.points);
      
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    }
};

//---Constructor Intents---
const GetConstructorStandingsTableLatestIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'GetConstructorStandingsTableLatest';
    },
    async handle(handlerInput) {
      var speechText = "";
      
      var standings = new F1.Standings("current");
      var recievedResponse = await standings.getConstructorStandingsTable();
      
      speechText = recievedResponse;
      
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    }
};

const GetConstructorStandingsLeadersLatestIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'GetConstructorStandingsLeadersLatest';
    },
    async handle(handlerInput) {
      const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
      var speechText = "";
      
      var standings = new F1.Standings("current");
      var recievedResponse = await standings.getConstructorStandingsLeaders();
      
      speechText = recievedResponse;
      
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    }
};

const GetConstructorStandingsTableWithDateIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'GetConstructorStandingsTableWithDate';
    },
    async handle(handlerInput) {
      var speechText = "";
      
      const slots = handlerInput.requestEnvelope.request.intent.slots;

      var year = slots.year.value;
      
      var standings = new F1.Standings(year);
      var recievedResponse = await standings.getConstructorStandingsTable();
      
      speechText = recievedResponse;
      
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    }
};

const GetConstructorStandingsPlacementLatestIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'GetConstructorStandingsPlacementLatest';
    },
    async handle(handlerInput) {
      var speechText = "";
      
      const slots = handlerInput.requestEnvelope.request.intent.slots;

      var placement = slots.placement.value;
      
      var standings = new F1.Standings("current");
      var recievedResponse = await standings.getConstructorStandingsPlacement(placement);
      
      speechText = recievedResponse;
      
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    }
};

/*
*
* Yes and No Intents + Functions regarding context
*
*/
function setIntentContext(handlerInput, context) {
  const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  sessionAttributes.targetContext = context;
  handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
}

function setStandingsContext(handlerInput, year){
  const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  sessionAttributes.targetYear = year;
  handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
}

function setRaceContext(handlerInput, year, round) {
  const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  sessionAttributes.targetYear = year;
  sessionAttributes.targetRound = round;
  handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
}

const YesIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent'
    },
    async handle(handlerInput) {
      var speechText = "";
      
      const attributes = handlerInput.attributesManager.getSessionAttributes();
      var currentContext = handlerInput.attributesManager.getSessionAttributes().targetContext;
      
      switch(attributes.targetContext){
        case "GetRaceTable_ALL_RESULTS":
          var race = new F1.Race(attributes.targetYear, attributes.targetRound);
          var recievedResponse = await race.getRaceTableAtTarget(1);
          speechText = recievedResponse;
          
          setIntentContext(handlerInput, null);
          setRaceContext(handlerInput, null, null);
          break;
        case "GetQualifyingRaceTable_ALL_RESULTS":
          var race = new F1.Race(attributes.targetYear, attributes.targetRound);
          var recievedResponse = await race.getQualifyingRaceTable(1);
          speechText = recievedResponse;
          
          setIntentContext(handlerInput, null);
          setRaceContext(handlerInput, null, null);
          break;
        case "GetDriverStandingsTable_ALL_RESULTS":
          var standings = new F1.Standings(attributes.targetYear);
          var recievedResponse = await standings.getDriverStandingsTable(1);
          speechText = recievedResponse;
          
          setIntentContext(handlerInput, null);
          setRaceContext(handlerInput, null, null);
          break;
        default:
          speechText = "Tut mir leid. Ich habe deine Frage nicht ganz verstanden. Bitte starte den Dialog erneut.";
          break;
      }
      
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    }
};

const NoIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent';
    },
    async handle(handlerInput) {
      var speechText = "";
      
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    }
};
/*
*
* Required Amazon Intent Handlers
*
*/
const ErrorHandler = {
    canHandle(handlerInput) {
      return true;
    },
    handle(handlerInput, error) {
      console.log(`Error handled: ${error.message}`);
  
      return handlerInput.responseBuilder
        .speak('Sorry, I can\'t understand the command. Please say again.')
        .reprompt('Sorry, I can\'t understand the command. Please say again.')
        .getResponse();
    },
};


const CancelIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent';
    },
    handle(handlerInput) {
      var speechText = "CancelIntentHandler";
      
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
      var speechText = "Du kannst mich zu verschiedenen Kategorien wie Renn- und Qualifyingergebnissen sowie Fahrer- und Konstrukteurstabellen befragen. Versuche es mal mit: Wer hat das letzte Rennen gewonnen? Wer wurde zehnter in Runde 4 in 2014? Wer führt die Konstrukteurs Tabelle in dieser Saison an? Bei weiteren Fragen schau auf der Website www.f1Helper.com nach.";
      
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    }
};

const StopIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent';
    },
    handle(handlerInput) {
      var speechText = "Skill wird geschlossen. Bis zum nächsten mal!";
      
      return handlerInput.responseBuilder
        .speak(speechText)
        .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
      var speechText = "Irgendetwas ist schief gelaufen! Bitte versuche es nochmal!";
      
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        GetPodiumInfoWithDateIntentHandler,
        GetPodiumInfoLatestIntentHandler,
        GetRaceTableWithDateIntentHandler,
        GetRaceTableLatestIntentHandler,
        GetPlacementWithDateIntentHandler,
        GetPlacementLatestIntentHandler,
        GetQualifyingPodiumWithDateIntentHandler,
        GetQualifyingPodiumLatestIntentHandler,
        GetQualifyingRaceTableLatestIntentHandler,
        GetQualifyingRaceTableWithDateIntentHandler,
        GetDriverStandingsTableLatestIntentHandler,
        GetDriverStandingsLeadersLatestIntentHandler,
        GetDriverStandingsTableWithDateIntentHandler,
        GetDriverStandingsPlacementLatestIntentHandler,
        GetConstructorStandingsTableLatestIntentHandler,
        GetConstructorStandingsLeadersLatestIntentHandler,
        GetConstructorStandingsTableWithDateIntentHandler,
        GetConstructorStandingsPlacementLatestIntentHandler,
        YesIntentHandler,
        NoIntentHandler,
        CancelIntentHandler,
        HelpIntentHandler,
        StopIntentHandler,
        FallbackIntentHandler
    )
    .addErrorHandler(ErrorHandler)
    .addRequestInterceptors(LocalizationInterceptor)
    .lambda();