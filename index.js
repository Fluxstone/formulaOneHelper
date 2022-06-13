const Alexa = require('ask-sdk-core');
const F1 = require("./helper/f1InfoClasses");

//i18n stuff
const i18n = require('i18next'); 
const sprintf = require('i18next-sprintf-postprocessor'); 

var momentTZ = require('moment-timezone');

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
      const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
      speechText = requestAttributes.t('GREETING');

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
      var targetLocale = handlerInput.requestEnvelope.request.locale;
      const slots = handlerInput.requestEnvelope.request.intent.slots;
      
      var year = slots.year.value;
      var round = slots.round.value;

      var race = new F1.Race(year, round);
      var recievedResponse = await race.getRaceTableAtTarget(0, targetLocale);
            
      setIntentContext(handlerInput, "GetRaceTable_ALL_RESULTS");
      setRaceContext(handlerInput, year, round);
      
      //Translation implementend here given that its unclear how many competitors are on the grid. Fallback locale is German
      if(targetLocale == "de-DE"){
        speechText = recievedResponse + " Wenn du die restliche Tabellenplatzierungen hören möchtest sage einfach: Ja.";
      } else if (locale == "en-US"){
        speechText = recievedResponse + " If you would like to hear the remaining table places say: Yes";
      } else {
        speechText = recievedResponse + " Wenn du die restliche Tabellenplatzierungen hören möchtest sage einfach: Ja.";
      }
      

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
      var targetLocale = handlerInput.requestEnvelope.request.locale;

      setIntentContext(handlerInput, "GetRaceTable_ALL_RESULTS");
      setRaceContext(handlerInput, "current", "last");
      
      
      var race = new F1.Race("current", "last");
      var recievedResponse = await race.getRaceTableAtTarget(0, targetLocale);
      

      //Translation implementend here given that its unclear how many competitors are on the grid. Fallback locale is German
      if(targetLocale == "de-DE"){
        speechText = recievedResponse + " Wenn du die restliche Tabellenplatzierungen hören möchtest sage einfach: Ja.";
      } else if (locale == "en-US"){
        speechText = recievedResponse + " If you would like to hear the remaining table places say: Yes";
      } else {
        speechText = recievedResponse + " Wenn du die restliche Tabellenplatzierungen hören möchtest sage einfach: Ja.";
      }
      
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
      var targetLocale = handlerInput.requestEnvelope.request.locale;

      var race = new F1.Race("current", "last");
      var recievedResponse = await race.getQualifyingRaceTable(0, targetLocale);

      setIntentContext(handlerInput, "GetQualifyingRaceTable_ALL_RESULTS");
      setRaceContext(handlerInput, "current", "last");

      //Translation implementend here given that its unclear how many competitors are on the grid. Fallback locale is German
      if(targetLocale == "de-DE"){
        console.log("In germany");
        speechText = recievedResponse + " Wenn du die restliche Tabellenplatzierungen hören möchtest sage einfach: Ja.";
      } else if (locale == "en-US"){
        console.log("In murrica");
        speechText = recievedResponse + " If you would like to hear the remaining table places say: Yes";
      } else {
        speechText = recievedResponse + " Wenn du die restliche Tabellenplatzierungen hören möchtest sage einfach: Ja.";
      }
      
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
      var targetLocale = handlerInput.requestEnvelope.request.locale;
      const slots = handlerInput.requestEnvelope.request.intent.slots;
      
      var year = slots.year.value;
      var round = slots.round.value;
      
      setIntentContext(handlerInput, "GetQualifyingRaceTable_ALL_RESULTS");
      setRaceContext(handlerInput, year, round);

      var race = new F1.Race(year, round);
      var recievedResponse = await race.getQualifyingRaceTable(0, targetLocale);
      
      
      //Translation implementend here given that its unclear how many competitors are on the grid. Fallback locale is German
      if(targetLocale == "de-DE"){
        speechText = recievedResponse + " Wenn du die restliche Tabellenplatzierungen hören möchtest sage einfach: Ja.";
      } else if (locale == "en-US"){
        speechText = recievedResponse + " If you would like to hear the remaining table places say: Yes";
      } else {
        speechText = recievedResponse + " Wenn du die restliche Tabellenplatzierungen hören möchtest sage einfach: Ja.";
      }

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
      var targetLocale = handlerInput.requestEnvelope.request.locale;
      setIntentContext(handlerInput, "GetDriverStandingsTable_ALL_RESULTS");
      setStandingsContext(handlerInput, "current");
      
      var standings = new F1.Standings("current");
      var recievedResponse = await standings.getDriverStandingsTable(0, targetLocale);

      console.log(recievedResponse);
      
      //Translation implementend here given that its unclear how many competitors are on the grid. Fallback locale is German
      if(targetLocale == "de-DE"){
        speechText = recievedResponse + " Wenn du die restliche Tabellenplatzierungen hören möchtest sage einfach: Ja.";
      } else if (locale == "en-US"){
        speechText = recievedResponse + " If you would like to hear the remaining table places say: Yes";
      } else {
        speechText = recievedResponse + " Wenn du die restliche Tabellenplatzierungen hören möchtest sage einfach: Ja.";
      }
      
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
      var targetLocale = handlerInput.requestEnvelope.request.locale;
      const slots = handlerInput.requestEnvelope.request.intent.slots;
      var year = slots.year.value;
      
      setIntentContext(handlerInput, "GetDriverStandingsTable_ALL_RESULTS");
      setStandingsContext(handlerInput, year);
      
      var standings = new F1.Standings(year);
      var recievedResponse = await standings.getDriverStandingsTable(0, targetLocale);
      
      //Translation implementend here given that its unclear how many competitors are on the grid. Fallback locale is German
      if(targetLocale == "de-DE"){
        speechText = recievedResponse + " Wenn du die restliche Tabellenplatzierungen hören möchtest sage einfach: Ja.";
      } else if (locale == "en-US"){
        speechText = recievedResponse + " If you would like to hear the remaining table places say: Yes";
      } else {
        speechText = recievedResponse + " Wenn du die restliche Tabellenplatzierungen hören möchtest sage einfach: Ja.";
      }
      
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
      var recievedResponse = await standings.getConstructorStandingsTable(handlerInput.requestEnvelope.request.locale);
      
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
      speechText = requestAttributes.t('CONSTRUCTOR_LEADER', recievedResponse.firstConstructor, recievedResponse.firstConstructorPoints, recievedResponse.secondConstructor, recievedResponse.secondConstructorPoints, recievedResponse.thirdConstructor, recievedResponse.thirdConstructorPoints);

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
      var recievedResponse = await standings.getConstructorStandingsTable(handlerInput.requestEnvelope.request.locale);
      
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
      const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
      var speechText = "";
      
      const slots = handlerInput.requestEnvelope.request.intent.slots;

      var placement = slots.placement.value;
      
      var standings = new F1.Standings("current");
      var recievedResponse = await standings.getConstructorStandingsPlacement(placement);
      speechText = requestAttributes.t('CONSTRUCTOR_PLACEMENT', recievedResponse.position, recievedResponse.name, recievedResponse.points);

      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    }
};

//---Misc Intents---
const GetNextRaceDateIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetNextRaceDate';
  },
  async handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    var speechText = "";

    const deviceId = handlerInput.requestEnvelope.context.System.device.deviceId;
    const authToken = handlerInput.requestEnvelope.context.System.apiAccessToken;

    var race = new F1.Race("current", "last");
    var recievedResponse = await race.getNextRaceDate(deviceId, authToken);

    var offsetDate = momentTZ(recievedResponse.date).format("DD-MM-YYYY HH:mm");

    speechText = requestAttributes.t('NEXT_RACE_DATE', recievedResponse.name, offsetDate);
    
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
      const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
      var speechText = "";
      
      const attributes = handlerInput.attributesManager.getSessionAttributes();
      var currentContext = handlerInput.attributesManager.getSessionAttributes().targetContext;
      
      switch(attributes.targetContext){
        case "GetRaceTable_ALL_RESULTS":
          var targetLocale = handlerInput.requestEnvelope.request.locale;
          var race = new F1.Race(attributes.targetYear, attributes.targetRound);
          var recievedResponse = await race.getRaceTableAtTarget(1, targetLocale);
          speechText = recievedResponse;
          
          setIntentContext(handlerInput, null);
          setRaceContext(handlerInput, null, null);
          break;
        case "GetQualifyingRaceTable_ALL_RESULTS":
          var targetLocale = handlerInput.requestEnvelope.request.locale;
          var race = new F1.Race(attributes.targetYear, attributes.targetRound);
          var recievedResponse = await race.getQualifyingRaceTable(1, targetLocale);
          speechText = recievedResponse;
          
          setIntentContext(handlerInput, null);
          setRaceContext(handlerInput, null, null);
          break;
        case "GetDriverStandingsTable_ALL_RESULTS":
          var targetLocale = handlerInput.requestEnvelope.request.locale;
          var standings = new F1.Standings(attributes.targetYear);
          var recievedResponse = await standings.getDriverStandingsTable(1, targetLocale);
          speechText = recievedResponse;
          setIntentContext(handlerInput, null);
          setRaceContext(handlerInput, null, null);
          break;
        default:
          speechText = requestAttributes.t('CONTEXT_ERROR_HANDLER');
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

      const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
      var speechText = "";
      speechText = requestAttributes.t('ERROR_INTENT_HANDLER');
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    },
};

const CancelIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent';
    },
    handle(handlerInput) {
      const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
      var speechText = "";
      speechText = requestAttributes.t('CANCEL_INTENT_HANDLER');
      
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
      const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
      var speechText = "";
      speechText = requestAttributes.t('HELP_INTENT_HANDLER');

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
      const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
      var speechText = "";
      speechText = requestAttributes.t('CLOSING_SKILL_NORMAL');
      
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

      const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
      var speechText = "";
      speechText = requestAttributes.t('FALLBACK_INTENT_HANDLER');
      
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
        GetNextRaceDateIntentHandler,
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



//TODO:
/**
 * Table noch ne Übersetzung rein √
 * Die Default Handler noch ne Übersetzung rein √
 * Diesen einen Bug noch mit 7 checken √
 * Die Englischen Übersetzungen noch fertig machen √
 * Code aufräumen
 * Qualifying crasht noch rum?
 */