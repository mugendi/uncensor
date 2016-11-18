const path = require('path');
const _ = require('lodash');
const fs = require('fs');

var index = {};
var srcFolder = path.join(__dirname,'..','src');


create_index();
function create_index(words){
  console.log("Creating New Index...");
  var badwords = [];
  var popular_badwords = [];

  try {
    badwords = require(path.join(srcFolder,'profanities.json'));
  } catch (e) {
    console.log(e)
    throw new Error('profanities.json missing in '+ srcFolder+' directory.');
  }

  var len = 0,
      arr = [],
      index = {},
      s = '',
      l ='',
      w = '',
      meaning = '';

  //add hyphenated words without the hyphens....
  //
  badwords.forEach(function(o){
    w = o.profanity;
    if(/[^a-z]/.test(w)){
      badwords.push(
        _.merge(o, { profanity:w.replace(/[^a-z]/g,'')} )
      );
    }
  });

  // console.log(badwords.length);
  badwords.forEach(function(o,i){
    // console.log(o);
    w = o.profanity;
    len = w.length;
    arr = w.split('');
    s = arr.shift();
    l = arr.pop();
    meaning = o.meaning;

    index[len] = index[len] || {ww:[],i};
    // index[len].ww.push(o);
    index[len].ww = _.union((index[len].ww || []),[o]);

    index[len][s] = index[len][s] || {ww:[]};
    if(index[len][s]){
      index[len][s].ww = _.union((index[len][s].ww || []),[o]);
    }

    // console.log(len,s,l);
    index[len][s][l] = index[len][s][l] || {ww:[]};
    if(index[len][s][l]){
      index[len][s][l].ww = _.union( (index[len][s][l].ww || []), [o] );
    }

  });

  //save index...
  fs.writeFileSync( path.join(srcFolder,'profanities-index.json') , JSON.stringify(index));

  return index;
}
