# png-download-example

Simple example app that demonstrates downloading and transmitting a PNG image
from the web to Pebble. The image in question is a specially formatted version
of the HTML 5 logo. Efficient use of `AppMessage` callbacks is used to send the
image data in multiple chunks if required.

For another example more complex example, see 
[pebble-faces](https://github.com/pebble-examples/pebble-faces).