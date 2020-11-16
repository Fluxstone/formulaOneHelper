const Alexa = require('ask-sdk-core');
const F1 = require("./helper/f1InfoClasses");

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

const GetPodiumInfoWithDateIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'GetPodiumInfoWithDate';
    },
    async handle(handlerInput) {
      var speechText = "";
      
      const slots = handlerInput.requestEnvelope.request.intent.slots;
      
      var year = slots.year.value;
      var round = slots.round.value;

      var race = new F1.Race(year, round);
      var recievedResponse = await race.getPodiumInfoAtTarget();
      
      speechText = recievedResponse;

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
      var speechText = "";
      
      var race = new F1.Race("current", "last");
      var recievedResponse = await race.getPodiumInfoAtTarget();
      
      speechText = recievedResponse;

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
      var recievedResponse = await race.getRaceTableAtTarget();
      
      speechText = recievedResponse;
      

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

      var race = new F1.Race("current", "last");
      var recievedResponse = await race.getRaceTableAtTarget();
      
      speechText = recievedResponse;
      
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    }
};

const GetPlacementWithDateIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'GetPlacementWithDate';
    },
    async handle(handlerInput) {
      var speechText = "";

      const slots = handlerInput.requestEnvelope.request.intent.slots;
      
      var year = slots.year.value;
      var round = slots.round.value;
      var placement = slots.placement.value;

      var race = new F1.Race(year, round);
      var recievedResponse = await race.getPlacementAtTarget(placement);
      
      speechText = recievedResponse;
      
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    }
};

const GetPlacementLatestIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'GetPlacementLatest';
    },
    async handle(handlerInput) {
      var speechText = "";

      const slots = handlerInput.requestEnvelope.request.intent.slots;

      var placement = slots.placement.value;

      var race = new F1.Race("current", "last");
      var recievedResponse = await race.getPlacementAtTarget(placement);
      
      speechText = recievedResponse;
      
      
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    }
};

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

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        GetPodiumInfoWithDateIntentHandler,
        GetPodiumInfoLatestIntentHandler,
        GetRaceTableWithDateIntentHandler,
        GetRaceTableLatestIntentHandler,
        GetPlacementWithDateIntentHandler,
        GetPlacementLatestIntentHandler
    )
    .addErrorHandler(ErrorHandler)
    .lambda();
    