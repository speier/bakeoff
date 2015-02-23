module.exports = {
  failThenSucceed: function(fails) {
    var c = 0;
    return function(cb) {
      c++;
      if (c <= fails) {
        cb(new Error());
      } else {
        cb(null);
      }
    };
  }
};