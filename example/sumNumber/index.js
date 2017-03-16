'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = '';

const states = {
  STARTMODE: '_STARTMODE',
  INPUTMODE: '_INPUTMODE'
};

const newSessionHandlers = {
  'NewSession': function() {
    if(Object.keys(this.attributes).length === 0) {
      this.attributes.endedSessionCount = 0;
      this.attributes.gamesPlayed = 0;
    }
    this.handler.state = states.STARTMODE;
    this.emit(':ask', `Welcome!. You have played ${this.attributes.gamesPlayed} times. would you like to play?`);
  },
  "AMAZON.StopIntent": function() {
    this.emit(':tell', "Goodbye!");
  },
  "AMAZON.CancelIntent": function() {
    this.emit(':tell', "Goodbye!");
  },
  'SessionEndedRequest': function () {
    this.attributes.endedSessionCount += 1;
    this.emit(":tell", "Goodbye!");
  }
};

const startModeHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
  'NewSession': function () {
    this.emit('NewSession'); // Uses the handler in newSessionHandlers
  },
  'AMAZON.HelpIntent': function() {
    let message = 'Tell me two numbers and I will tell you a secret. Do you want to start the game?';
    this.emit(':ask', message, message);
  },
  'AMAZON.YesIntent': function() {
    this.attributes.firstNumber = undefined;
    this.attributes.secondNumber = undefined;
    this.handler.state = states.INPUTMODE;
    this.emit(':ask', 'Great! ' + 'Try saying a number to start the game.', 'Try saying a number.');
  },
  'AMAZON.NoIntent': function() {
    this.emit(':tell', 'Ok, see you next time!');
  },
  "AMAZON.StopIntent": function() {
    this.emit(':tell', "Goodbye!");
  },
  "AMAZON.CancelIntent": function() {
    this.emit(':tell', "Goodbye!");
  },
  'SessionEndedRequest': function () {
    this.attributes.endedSessionCount += 1;
    this.emit(':tell', "Goodbye!");
  },
  'Unhandled': function() {
    console.log("UNHANDLED");
    let message = 'Say yes to continue, or no to end the game.';
    this.emit(':ask', message, message);
  }
});

const inputModeHandlers = Alexa.CreateStateHandler(states.INPUTMODE, {
  'NewSession': function () {
    this.handler.state = '';
    this.emitWithState('NewSession'); // Equivalent to the Start Mode NewSession handler
  },
  'NumberInputIntent': function() {
    let number = parseInt(this.event.request.intent.slots.number.value);
    if(isNaN(number)) {
      this.emit('NotANum');
    } else {
    if(this.attributes.firstNumber === undefined) {
      this.attributes.firstNumber = number;
      this.emit('NextNum');
    } else {
      this.attributes.secondNumber = number;
      let sum = this.attributes.firstNumber + number;
      let res = `The first number is ${this.attributes.firstNumber}, the second is ${number}, the sum is ${sum}`;
      this.emit('Finish', () => {
        this.emit(':ask',  res + '. Would you like to play a new game?',
        'Say yes to start a new game, or no to end the game.');
      });
    }
    }
  },
  'AMAZON.HelpIntent': function() {
    this.emit(':ask', 'Tell me two numbers and I will tell you a secret.', 'Try saying a number.');
  },
  "AMAZON.StopIntent": function() {
    this.emit(':tell', "Goodbye!");
  },
  "AMAZON.CancelIntent": function() {
    this.emit(':tell', "Goodbye!");
  },
  'SessionEndedRequest': function () {
    this.attributes.endedSessionCount += 1;
    this.emit(':tell', "Goodbye!");
  },
  'Unhandled': function() {
    this.emit(':ask', 'Sorry, I didn\'t get that. Try saying a number.', 'Try saying a number.');
  }
});

const utilHandlers = {
  'NextNum': function(val) {
    this.emit(':ask', 'OK!, Try saying the next number.', 'Try saying the next number.');
  },
  'Finish': function(callback) {
    this.handler.state = states.STARTMODE;
    this.attributes.gamesPlayed++;
    callback();
  },
  'NotANum': function() {
    this.emit(':ask', 'Sorry, I didn\'t get that. Try saying a number.', 'Try saying a number.');
  }
};

exports.handler = (event, context) => {
  const alexa = Alexa.handler(event, context);
  alexa.APP_ID = APP_ID;
  alexa.registerHandlers(newSessionHandlers, startModeHandlers, inputModeHandlers, utilHandlers);
  alexa.execute();
};
