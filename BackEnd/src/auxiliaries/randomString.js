function createRandomString (lunghezzaStringa){
    var sChrs = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string = '';
    for (var i = 0; i < lunghezzaStringa; i++) {
      var randomPoz = Math.floor(Math.random() * (sChrs.length-1));
      string += sChrs.charAt(randomPoz);
    }
    return string;
}

module.exports = createRandomString;