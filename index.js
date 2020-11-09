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

const GetPodiumInfoIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'GetPodiumInfo';
    },
    handle(handlerInput) {
      const speechText = "";
      var year = handlerInput.requestEnvelope.request.intent.slots.year.value;
      var round = handlerInput.requestEnvelope.request.intent.slots.round.value;

      //does this even work?
      var race = new F1.Race(year, round);
      race.getResultInfo(getPodiumInfo(jsonData, year, round));

      return handlerInput.responseBuilder
        .speak(speechText)
        .getResponse();
    }
};

function getPodiumInfo(jsonData, year, round){
  //Return handlerInput.responseBuilder ?
}

const ErrorHandler = {
    canHandle() {
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
        GetPodiumInfoIntentHandler
    )
    .addErrorHandler(ErrorHandler)
    .lambda();