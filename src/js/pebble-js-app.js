var IMG_URL = 'http://developer.getpebble.com.s3.amazonaws.com/assets/other/html5-logo-small.png';
var MAX_CHUNK_SIZE = 8000;  // From app_message_inbox_size_maximum()

function sendChunk(array, index, arrayLength) {
  // Determine the next chunk size
  var chunkSize;
  if(arrayLength - index < MAX_CHUNK_SIZE) {
    // Will only need one more chunk
    chunkSize = arrayLength - index;
  } else {
    // Will require multiple chunks for remaining data
    chunkSize = MAX_CHUNK_SIZE;
  }

  // Prepare the dictionary
  var dict = {
    'AppKeyDataChunk': array.slice(index, index + chunkSize),
    'AppKeyChunkSize': chunkSize,
    'AppKeyIndex': index
  };

  // Send the chunk
  Pebble.sendAppMessage(dict, function() {
    // Success
    index += chunkSize;

    if(index < arrayLength) {
      // Send the next chunk
      sendChunk(array, index, arrayLength);
    } else {
      // Complete!
      Pebble.sendAppMessage({'AppKeyComplete': 0});
    }
  }, function(e) {
    console.log('Failed to send chunk with index ' + index);
  });
}

function transmitImage(array) {
  var index = 0;
  var arrayLength = array.length;
  
  // Transmit the length for array allocation
  Pebble.sendAppMessage({'AppKeyDataLength': arrayLength}, function(e) {
    // Success, begin sending chunks
    sendChunk(array, index, arrayLength);
  }, function(e) {
    console.log('Failed to send data length to Pebble!');
  })
}

function processImage(responseData) {
  // Convert to a array
  var byteArray = new Uint8Array(responseData);
  var array = [];
  for(var i = 0; i < byteArray.byteLength; i++) {
    array.push(byteArray[i]);
  }

  // Send chunks to Pebble
  transmitImage(array);
}

function downloadImage() {
  var request = new XMLHttpRequest();
  request.onload = function() {
    processImage(this.response);
  };
  request.responseType = "arraybuffer";
  request.open("GET", IMG_URL);
  request.send();
}

Pebble.addEventListener('ready', function() {
  downloadImage();
});