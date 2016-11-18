var expect = require('chai').expect;
var uncensor = require('../.');

var profanities = [
  {
    phrase : "What the fuck is wrong with you?" ,
    masked : "What the fu** is wrong with you?"
  },
  {
    phrase : "That guy is such a pussy. Hate the motherfucker!" ,
    masked: "That guy is such a p***y. Hate the m*****fckuer!"}
];


var prints = [];

//loop through all profanities
profanities.forEach(function(o){

  // uncensor
  var unmasked_phrase = uncensor.unmask_phrase(o.masked);

  // //results to be an string
  expect(unmasked_phrase).to.be.a('string');
  //check that we understood all profanities
  expect(unmasked_phrase).to.equal(o.phrase);

  //log
  prints.push( o.masked + " >> " + unmasked_phrase );

});

console.log(prints.join("\n"));
//all tests passed
console.log("ALL TESTS PASSED!");
