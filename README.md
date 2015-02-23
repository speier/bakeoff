# bakeoff [![Build Status](https://travis-ci.org/speier/bakeoff.svg?branch=master)](https://travis-ci.org/speier/bakeoff) [![Dependencies Status](https://david-dm.org/speier/bakeoff.svg)](https://david-dm.org/speier/bakeoff)

Simple exponential bakeoff function. Allows wrapping existing functions and trying whilst not succeeded or max retires count reached. Supports callbacks and promises (ES6).

# install

```
$ npm install bakeoff
```

# example

```
var bakeoff = require('bakeoff');

bakeoff.options.max = 5; // number of max retries

var params = {
  Bucket: 'mybucket',
  Key: 'myfile',
  Body: 'hello world!'
};

bakeoff(s3.putObject, params).then(function(res) {
  console.log(res);
});
```

# license

MIT
