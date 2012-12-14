#interface.js

###About

Node, Sockets, OSC, Inclusive Design, Code Generation...  Cool!

Soooo... this is the start of a much larger idea for json based generative osc interfaces. That being said I would really like to develop this code to be modular, allowing for parts to be taken from it to be used in other projects.  To accomplish this I will most likely use Fluid Infusion.

Things are going to be super rough for now... I am primarily building this as a test for a school project, and it is going to look absolutely nothing like what I am envisioning... but I have been iterating around this idea for a while, so it may as well exist as a single package.

In its current state the application will serve a responsive canvas based web application.  The web app will track the placement of up to 5 fingers as well as the accelerometer data of a mobile device, send those to node with socket.io, and then send it out over localhost using node-osc.

###OSC Api

The api is pretty simple.  It will send osc messages over local host to port 3333.  The messages you can receive are as follow

####Finger
/[fingernumber]/state i  ~ state of finger... 1 for on and 0 for off

/[fingernumber]/position f f ~ x and y co-ordinates of the finger

finger number can be "one", "two", "three", "four", "five

####Tilt
/alpha f ~ value for accelerometer alpha

/beta f ~ value for accelerometer beta

/gamma f ~ value for accelerometer gamma

###Examples
This project comes with a dsp example written in chuck, it can be found at dsp/chuck/dsp.ck
If you would like to launch both chuck and the node server at once you can run start.sh

$ ./start.sh

###Licensing

Interface.js is distributed under the terms the MIT or GPL2 Licenses. Choose the license that best suits your project. The text of the MIT and GPL licenses are at the root directory. 