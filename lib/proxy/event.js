/*
 * proxy/event.js - Local proxy for a remote event
 *
 * Copyright (c) 2014-2015 Loren West
 * Licensed under the MIT license.
 */
var Cylon = require('cylon');
var EventSource = require('eventsource');
var sources = {};  // robotName:deviceName:eventName -> eventSource

// Maybe one day this will be a real class.  For now, all methods are static.
var Event = module.exports = function Event() {};

// Called on first listener to an event
Event.proxyEvent = function(my, discoNode, robotName, deviceName, eventName) {

  // Build the url to the event source
  var mcp = discoNode.advertisement;
  url = mcp.protocol + '://' + discoNode.address + ':' + mcp.port + '/api';
  url += robotName ? '/robots/' + encodeURIComponent(robotName) : '';
  url += deviceName ? '/devices/' + encodeURIComponent(deviceName) : '';
  url += '/events/' + encodeURIComponent(eventName);

  // Build and save the EventSource, proxying the event to the 'my' object passed in
  var sourceKey = robotName + ':' + deviceName + ':' + eventName;
  eventSource = new EventSource(url);
  eventSource.onmessage = function(e) {
    var data = e.data;
    try {
      data = JSON.parse(e.data);
    }
    catch (e) {
      Cylon.Logger.error("Cannot parse remote event data: '" + e.data + "'");
    }
    my.emit(eventName, data);
  };
  eventSource.onerror = function(e) {
    Cylon.Logger.error('Event ' + sourceKey + ': ', e);
  };
  sources[sourceKey] = eventSource;
console.log("ADDED EVENT LISTENING FOR " + sourceKey);
}

// Called when last listener is removed from an event
Event.removeProxiedEvent = function(robotName, deviceName, eventName) {
  var sourceKey = robotName + ':' + deviceName + ':' + eventName;
  sources[sourceKey].close();
  delete sources[sourceKey];
console.log("REMOVED EVENT LISTENING FOR " + sourceKey);
}

