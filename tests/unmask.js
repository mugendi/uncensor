var expect = require('chai').expect;
var uncensor = require('../.');

var profanities = [
  { profanity: "fuck" , mask: "fu**" },
  { profanity: "fuck" , mask: "f**k" },
  { profanity: "fuck" , mask: "fcuk" },
  { profanity: "pussy" , mask: "p***y" },
  { profanity: "pussys" , mask: "p***y*" },
  { profanity: "cock" , mask: "c**k" },
  { profanity: "asshole" , mask: "***h**e" },
  { profanity: "arselicker" , mask: "ar*****ker" },
  { profanity: "backwoodsman" , mask: "b**k********" },
  { profanity: "motherfucker" , mask: "m*****fckuer" },
];


var prints = [];

//loop through all profanities
profanities.forEach(function(o){

  // uncensor
  var res = uncensor.unmask(o.mask);
  //results to be an object
  expect(res).to.be.a('object');
  //expect profanity to be a word
  expect(res.results.word.profanity).to.be.a('string');
  //ensure we keep to the same length of mask
  expect(res.results.word.profanity).to.have.length(o.mask.length);
  //expect profanity returned to be what we expect
  expect(res.results.word.profanity).to.equal(o.profanity);

  //log
  prints.push( o.mask + " >> " + res.results.word.profanity + " -> DECISION STEPS: (" + res.results.meta.steps + ")" );

});

console.log(prints.join("\n"));
//all tests passed
console.log("ALL TESTS PASSED!");
