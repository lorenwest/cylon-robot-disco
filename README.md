# Cylon Robot Discovery

[![NPM](https://nodei.co/npm/cylon-robot-disco.svg?downloads=true&downloadRank=true)](https://nodei.co/npm/cylon-robot-disco/)&nbsp;&nbsp;
[![Build Status](https://secure.travis-ci.org/lorenwest/cylon-robot-disco.svg?branch=master)](https://travis-ci.org/lorenwest/cylon-robot-disco)&nbsp;&nbsp;
[release notes](https://github.com/lorenwest/cylon-robot-disco/blob/master/History.md)

# Cylon Robot Discovery

This package discovers other robots in a local network running RobotDisco.

Once discovered, it attaches the remote robot as a proxy robot into the `Cylon.robots` in this process. This lets you easily interact with all robots in the disco.

To invoke a command on a remote robot, just invoke their command directly.  It will return a [promise](https://www.promisejs.org/):

```
var Jane = Cylon.robots.Jane;
Jane.getMood()
  .then(function(mood) {
    Cylon.logger("Jane's mood is: " + mood);
  });
```

To listen for events on a remote robot, just start listening.  Robot Disco takes care of connecting with and forwarding events to you:

```
var Jane = Cylon.robots.Jane;
Jane.on('mood_change', function(mood) {
  Cylon.logger("Jane's mood has changed to: " + mood);
});

var Florist = Cylon.robots.Florist;
Florist.sendRoseTo('Jane');
```

When running the [Cylon API](http://cylonjs.com/documentation/core/api/), all robots in the network are represented in your process.

This allows API clients such as the [Robeaux UI](https://github.com/hybridgroup/robeaux) to interact with all robots by connecting with any robot running Robot Disco.

For more information about Cylon, check out the repo at
https://github.com/hybridgroup/cylon

## Getting Started

Install the module with: `npm install cylon-robot-disco`

## Getting Discovered

To join the club, just add robot-disco to your connections:

```javascript

Cylon.robot({
  connections: {
    ...
    disco: {adaptor: 'robot-disco' }
  },
  ...
}).start();
```

## License

Copyright (c) 2015 Loren West and other contributors.
See `LICENSE` for more details
