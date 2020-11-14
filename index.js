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
    async handle(handlerInput) {
      var speechText = "";
      
      const slots = handlerInput.requestEnvelope.request.intent.slots;
      
      var year = slots.year.value;
      var round = slots.round.value;

      var race = new F1.Race(year, round);
      var speechText = await race.getResultInfo();


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
        GetPodiumInfoIntentHandler
    )
    .addErrorHandler(ErrorHandler)
    .lambda();
    