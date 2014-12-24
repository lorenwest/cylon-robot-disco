# Cylon Robot Discovery

[![NPM](https://nodei.co/npm/cylon-robot-disco.svg?downloads=true&downloadRank=true)](https://nodei.co/npm/cylon-robot-disco/)&nbsp;&nbsp;
[![Build Status](https://secure.travis-ci.org/lorenwest/cylon-robot-disco.svg?branch=master)](https://travis-ci.org/lorenwest/cylon-robot-disco)&nbsp;&nbsp;
[release notes](https://github.com/lorenwest/cylon-robot-disco/blob/master/History.md)

...needs more readme...

For more information about Cylon, check out the repo at
https://github.com/hybridgroup/cylon

## Getting Started

Install the module with: `npm install cylon-robot-disco`

## Examples

## Connecting

Take your robot to the club by adding the robot-disco connection:

```javascript
var Cylon = require('cylon');

Cylon.robot({
  connections: {
    beaglebone: {adaptor: 'beaglebone' },
    disco: {adaptor: 'robot-disco' }
  },
  devices: {
    pump_motor_on: {
      driver: 'direct-pin',
      pin: 'P9_11',
      connection: 'beaglebone'
    }
  }

  work: function(my) {
    my.pump_motor_on.digitalWrite(1);
  }
}).start();
```

## License

Copyright (c) 2014-2015 Loren West and other contributors.
See `LICENSE` for more details
