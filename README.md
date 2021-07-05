# rsc-client
a port of the
[runescape classic](https://classic.runescape.wiki/w/RuneScape_Classic) client
([*mudclient revision 204*](https://github.com/2003scape/mudclient204))
from java to javascript.

this client is designed to work with
[rsc-server](https://github.com/2003scape/rsc-server) and
[RSCGo](https://github.com/spkaeros/RSCGo).

![](./screenshot.png?raw=true)

## install

    $ npm install @2003scape/rsc-client

## usage
after making modifications to `./src/`, run `$ npm install` to install developer
dependencies, then `$ npm run build-dev` to create a new bundle in `./dist/`.

the `./dist/` directory contains everything you need to use the client.
run `$ npm start` to start a simple HTTP server at http://localhost:1337.
you may put optional arguments into the hash of the URL:

    http://localhost:1337/index.html#members,127.0.0.1,43595

alternatively, you can manually invoke `mudclient` on your own canvas:

```javascript
const mudclient = require('@2003scape/rsc-client');

const mc = new mudclient(document.getElementById('mudclient-canvas'));
mc.members = false;
mc.threadSleep = 10;

(async () => {
    await mc.startApplication(512, 346, 'Runescape by Andrew Gower');
})();
```

if you don't want to host a separate websockets server, you can
pass a [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker)
instance of rsc-server into the `.server` property instead.

see https://github.com/2003scape/rsc-server#browser-usage

## options
features from earlier mudclients and/or inspired by modern third-party clients
with their default values:

```javascript
// hold down middle click and move the mouse to rotate the camera (only when
// camera is type manual)
mc.options.middleClickCamera = true;

// scroll panel lists and chatbox with the mouse wheel (and camera if zoom
// enabled)
mc.options.mouseWheel = true;

// click the compas to face north
mc.options.resetCompass = true;

// show roofs unless inside buildings
mc.options.showRoofs = false;

// use arrow keys (and mouse wheel if enabled) to zoom in and out
mc.options.zoomCamera = true;

// show the remaining experience until next level in skills tab
mc.options.remainingExperience = false;

// show your total experience in the skills tab
mc.options.totalExperience = false;

// censor chat and private messages
mc.options.wordFilter = true;

// support account registration, password changes and recovery within the
// client using jagex's older UIs
mc.options.accountManagement = true;

// display an "Fps: X" counter at the bottom right of the screen
mc.options.fpsCounter = false;

// retry logins when the server disconnects
mc.options.retryLoginOnDisconnect = true;

// experimental mobile support
mc.options.mobile = false;
```

## assets
make sure that wherever you host it, it's able to access
`./data204/` via
[XHR](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
for its cache files.

## faq
* what is the purpose of `| 0`? why not use `Math.floor()`?

  `number | 0` is an
  [asm.js](https://github.com/zbjornson/human-asmjs#11-type-declaration)
  declaration for declaring a number as a 32-bit integer. the original
  java client used integer overflow techniques often, and this is the most
  performant method to declare them and accomplish the correct
  behaviour (javascript's
  [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)
  is an [IEEE 754](https://en.wikipedia.org/wiki/IEEE_754); a
  [java double](https://docs.oracle.com/javase/7/docs/api/java/lang/Double.html)).

## license
Copyright 2021  2003Scape Team

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU Affero General Public License as published by the
Free Software Foundation, either version 3 of the License, or (at your option)
any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see http://www.gnu.org/licenses/.
