var link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://radio.musicsaur.com/static/emojione.sprites.css";
document.head.appendChild(link);
var link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://cdn.rawgit.com/tiaanduplessis/wenk/master/dist/wenk.css";
document.head.appendChild(link);

ALL_EMOJIS = {};
/**
 * Fires an emoji:ready event when the list of emojis has been loaded.
 *
 * @event emoji-ready
 */
(function () {
  var request = new XMLHttpRequest();
  request.open('GET', 'https://raw.githubusercontent.com/schollz/iconify/master/assets/emojis3.json', true);
  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      ALL_EMOJIS = JSON.parse(request.response);
      var event = document.createEvent('HTMLEvents');
      event.initEvent('emoji-ready', true, false);
      document.dispatchEvent(event);
    }
  };
  request.send();
})();
document.addEventListener("emoji-ready", function () {
  // Loop through all elements, and parse all text
  var all = document.getElementsByTagName("*");

  for (var i = 0, max = all.length; i < max; i++) {
    // Skip javascript and CSS
    try {
      if (all[i].localName == "script" || all[i].localName == "style") {
        continue
      }
    } catch (err) {
      continue
    }
    // Check if it is a leaf
    if (all[i].childNodes.length == 1) {
      // Get the text content of this leaf
      currentText = all[i].textContent;
      all[i].innerHTML = replacer(currentText);
    }
  }
});
/**
 * replaces all "words" in a text with emojis
 * @param {string} text
 * @returns {string} text with words replaced with things
 */
function replacer(text) {
  text = !!text ? text : '';
  return text.replace(/([a-zA-Z]+)/gi, function (Word) {
    if (Word.length < 3) {
      return Word;
    }
    var emoji = getEmojiForWord(Word.toLowerCase())
    if (emoji !== undefined) {
      return "<span class='emojione emojione-" + emoji + "'><span data-wenk='"+Word+"' data-wenk-pos='bottom'>&#x" + emoji + "</span></span>";
    }
    return Word;
  });
}

_cache = {}
/**
 * @param {string} word
 * @returns {string|undefined}
 */
function getEmojiForWord(word) {
  if (word in _cache) {
    return _cache[word];
  }
  var emoji = undefined;
  for (var key in ALL_EMOJIS) {
    if (key == word) {
      emoji = ALL_EMOJIS[key].char;
      break;
    }
    if (ALL_EMOJIS.hasOwnProperty(key)) {
      var value = ALL_EMOJIS[key];
      try {        
        if (value.keywords.indexOf(word) !== -1) {
          emoji = value.char;
          break;
        }
      }catch(err) {
        // skip
      }
    }
  }
  _cache[word] = emoji;
  return emoji;
}
