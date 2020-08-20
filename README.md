# rsc-client
a port of the
[runescape classic](https://en.wikipedia.org/wiki/RuneScape#History_and_development)
client ([*mudclient revision 204*](https://github.com/2003scape/mudclient204))
from java to javascript.

this client is designed to work with
[rsc-server](https://github.com/2003scape/rsc-server).

![](./screenshot.png?raw=true)

## install

    npm install @2003scape/rsc-client

## usage
the `dist/` directory contains everything you need to use the client.
run `npm start` to start a simple HTTP server http://localhost:1337.
you may put optional arguments into the hash of the URL as such:

    http://localhost:1337/index.html#members,127.0.0.1,43595

alternatively, you can manually invoke `mudclient` on your own canvas as such:

```javascript
const mudclient = require('rsc-client');

const mc = new mudclient(document.getElementById('mudclient-canvas'));
mc.members = false;
mc.threadSleep = 10;

(async () => {
    await mc.startApplication(512, 346, 'Runescape by Andrew Gower', false);
})();
```

## options
present are features from earlier mudclients and/or inspired by modern
third-party clients:

```javascript
// hold down middle click and move the mouse to rotate the camera
mc.options.middleClickCamera = true;
// scroll panel lists and chatbox with the mouse wheel
mc.options.mouseWheel = true;
// click the compas to face north
mc.options.resetCompass = true;
// use arrow keys (and mouse wheel if enabled) to zoom in and out
mc.options.zoomCamera = true;
```

## assets
make sure that wherever you host it, it's able to access
`./data204/` via XHR for its cache files.

## license
Copyright 2020  2003Scape Team

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU Affero General Public License as published by the
Free Software Foundation, either version 3 of the License, or (at your option)
any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see http://www.gnu.org/licenses/.
