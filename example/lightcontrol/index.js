'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = '';

const newSessionHandlers = {
  'LaunchRequest': function() {
    this.handler.state = '';
    this.emit(':ask', "Hello! How can I do for you?");
  },
  'LightControl': function() {
    this.handler.state = '';
    if(this.event.request.intent.slots.option.value && this.event.request.intent.slots.place.value) {
      this.attributes.option = this.event.request.intent.slots.option.value;
      this.attributes.place = this.event.request.intent.slots.place.value;
      if(this.attributes.option && this.attributes.place) {
        this.emit('ControlLight');
      }
    } else {
      this.emit('NotValidInput');
    }
  },
  'OptionOnlyIntent': function () {
    if(this.event.request.intent.slots.option.value) {
      this.attributes.option = this.event.request.intent.slots.option.value;
      if(!this.attributes.hasOwnProperty('place')) {
        this.emit(':ask', `Ok. Where should I turn ${this.attributes.option} the light?`);
      } else if(this.attributes.option && this.attributes.place) {
        this.emit('ControlLight');
      }
    } else {
      this.emit('NotValidInput');
    }
  },
  'PlaceOnlyIntent': function () {
    if(this.event.request.intent.slots.place.value) {
      this.attributes.place = this.event.request.intent.slots.place.value;
      if(!this.attributes.hasOwnProperty('option')) {
        this.emit(':ask', `Ok. What should I do for you in the ${this.attributes.place}?`);
      } else if(this.attributes.option && this.attributes.place) {
        this.emit('ControlLight');
      }
    } else {
      this.emit('NotValidInput');
    }
  },
  "AMAZON.StopIntent": function() {
    this.emit('Goodbye');
  },
  "AMAZON.CancelIntent": function() {
    this.emit('Goodbye');
  },
  'SessionEndedRequest': function () {
    this.emit('Goodbye');
  }
};

var utilHandlers = {
  'ControlLight': function() {
    let msg = `OK. I have turned ${this.attributes.option} the light in the ${this.attributes.place}.`;
    this.emit(':tell', msg);
  },
  'NotValidInput': function() {
    this.emit(':ask', "Sorry, I didn\'t get that. Try saying again.");
  },
  'Goodbye': function() {
    this.emit(':tell', "Ok. Goodbye!");
  }
};

exports.handler = (event, context) => {
  const alexa = Alexa.handler(event, context);
  alexa.APP_ID = APP_ID;
  alexa.registerHandlers(newSessionHandlers, utilHandlers);
  alexa.execute();
};
