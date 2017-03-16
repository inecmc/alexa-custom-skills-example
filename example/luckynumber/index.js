'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = '';

const handlers = {
  'GetLuckyNumbers': function() {
    let number = Math.random() * (10 - 1) + 1;
    let res = 'Your lucky number is ' + parseInt(number);
    this.emit(':tell', res);
  },
  'AMAZON.HelpIntent': function () {
    this.emit(':ask', 'Say a number and I will tell you your lucky number today.');
  },
  'AMAZON.CancelIntent': function () {
    this.emit(':tell', "Goodbye!");
  },
  'AMAZON.StopIntent': function () {
    this.emit(':tell', "Goodbye!");
  },
  'SessionEndedRequest': function () {
    this.emit(':tell', "Goodbye!");
  }
};

exports.handler = (event, context) => {
  const alexa = Alexa.handler(event, context);
  alexa.APP_ID = APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
};
