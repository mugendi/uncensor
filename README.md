# Uncensor*****
This module is created for the purposes of unmasking censored strings such as ```"f**k"```.

## But Why?
In our web-tracking tasks, we often come across statements like **"That C.E.O is a p\*\*\*k!"**. Now if you have to run sentiment analysis on this post, or even for the purposes of appropriately saving it in a full text data-store (we love [elasticsearch](https://elastic.co)), you must first decode what **p\*\*\*k** stands for. This is what we call "Uncensoring"!

*I'm sure there are many other use cases for this. Now that a divisive U.S. election has churned out a lot of curse words into the interwebs!*

## Enough Politics. Let's Dive In!
It is easy to use **uncensor**.
Install from npm ```npm install --save uncensor```

```javascript
const uncensor = require('uncensor');

var masked = "f**k";
var unmasked = uncensor.unmask(masked);

console.log(unmasked);
```

This prints out:

```json
{
    "censored": "f**k",
    "results": {
        "word": {
            "profanity": "fuck",
            "popularity": 9
        },
        "other_words": [
            {
                "profanity": "fook",
                "popularity": 0
            },
            {
                "profanity": "feck",
                "popularity": 0
            }
        ],
        "meta": {
            "count": 3,
            "steps": "Length Check > Start Letter Match > Last Letter Match > Levenshtein Ordering [3 words]"
        }
    }
}
```
Note that results include a *meta* object that indicates the steps taken to arrive at results presented.

* **Length Check** : results filtered by length of mask.

* **Start Letter Match & Last Letter Match** : masked words usually indicate the start & last letters. So we further filter the results by those letters.

* **Levenshtein Ordering** : We then use *levenshtein distance* & profanity popularity to sort out results where multiple results are returned.

## Dealing With Phrases
You can also unmask entire phrases.

```javascript
const uncensor = require('uncensor');

var masked_phrase = "That guy is such a p***y. Hate the m*****fckuer!";
var unmasked_phrase = uncensor.unmask_phrase(masked_phrase);

console.log(unmasked_phrase);

//PRINTS: That guy is such a pussy. Hate the motherfucker!
```
## Run the Tests...
You can run ```tests folder``` for some of the tests.
