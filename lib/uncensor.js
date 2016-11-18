
const levenshtein = require('fast-levenshtein');
const path = require('path');
const _ = require('lodash');
const fs = require('fs');

var index = {};
var srcFolder = path.join(__dirname,'..','src');

index = require( path.join(srcFolder,'profanities-index.json') );


module.exports = {
  unmask : unmask,
  unmask_phrase : unmask_phrase
};


function unmask_phrase(phrase){
  if(typeof phrase !== 'string'){
    throw new Error('Censored phrase entered must be a string!');
  }

  //split to words by whitespace...
  var profanities = phrase.split(/[\s\.\?\/\\!,:;]/)
                          //filter out only the profanities
                          .filter(a=>/[^a-z]/i.test(a))
                          //unmask the profanities
                          .map(unmask);

  //loop thru each
  profanities.forEach(function(res){
    //if we have found something
    if(res.results.word && (profanity=res.results.word.profanity)){
      phrase = phrase.replace(res.censored, profanity);
    }
  });

  return phrase;

}

function unmask(censored, count){
  count = Number(count) ? count : 10;

  if(typeof censored !== 'string'){
    throw new Error('Censored value entered must be a string!');
  }

  //lowercase...
  censored = censored.toLowerCase();

  //now the filler...
  //first, we get the length, first & last letters
  var s=0, l=0, len=0, pos=0, lev=0,
      arr=[], arr2=[], words=[], steps=[], levs=[],
      results = {};

  arr = censored.split('');
  len = arr.length;
  s = arr[0];
  l = arr[arr.length-1];

  // console.log(arr,len,s,l);
  // now attempt to find best set of words
  if(index[len]){
    words = index[len].ww;
    steps.push('Length Check');

    //check first letter
    if(index[len][s]){
      words = index[len][s].ww;
      steps.push('Start Letter Match');
      //now check the last letters
      if(index[len][s][l]){
        words = index[len][s][l].ww;
        steps.push('Last Letter Match');
      }
    }

    // console.log(words);
    var filtered = false;
    var unfiltered_words_arr = _.union([],words);

    //remove words that dont match other given chars
    words.forEach(function(o,j){

      arr2 = o.profanity.split('');

      //loop thru & test
      for(var i in arr2){
        i = Number(i);
        //remove word if there are non matching letters
        if(/[a-z0-9]/.test(arr[i]) && arr2[i]!==arr[i]){
          delete words[j];
          filtered = true;
          //break as soon as we have found a word to disqualify/remove
          break;
        }
      }

    });

    //remove nulls
    words = _.compact(words);
    // console.log(censored, words);
    if(words.length === 0){
      words = unfiltered_words_arr;
    }
    else if(filtered){ steps.push("Word Filtering"); }

  }

  //if just one word, return it
  if(words.length<2){
    results = {
      word : words[0] || null,
      other_words : []
    };
  }
  else{
    steps.push('Levenshtein Ordering [' + words.length + ' words]');
    // console.log(words);
    //
    //run levenshtein where we have more than one word
    words.forEach(function(word){
      // console.log(word.profanity);
      lev = levenshtein.get(word.profanity,censored);
      pos = ((len-lev)/len) * word.popularity;

      if(!levs[lev]){
        levs[lev] = _.merge(word, { pos:pos });
      }
      else{
        levs.push( _.merge(word, { pos:pos }) );
      }

    });

    //sort levs...
    levs = _.orderBy(_.compact(levs), ['pos'], ['desc'])
            //reduce the results
            .slice( 0, count )
            //map return keys we wanna return
            .map(a=>_.pick(a,['profanity','popularity']));

    // console.log(levs)

    results = {
     word : levs.shift() || null,
     other_words : levs
    };

  }

  results.meta = {
    count : levs.length+1,
    steps: steps.join(' > '),
  };

  return {  censored : censored,
            results : results
          };

}
