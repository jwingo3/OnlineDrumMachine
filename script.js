  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();
  var timeoutID;
  var tempo=60;
  var beatNumber = -1 ;//set to -1 so that the first increment starts at 0 
    		playing = false;	


  //drumset object 
  var drumset = {}

  drumset.hihat = [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0];
  drumset.snare = [0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0];
  drumset.bass  = [1,0,1,1,0,0,0,0,1,0,1,1,0,0,0,0];
  drumset.tom1 =  [0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0];
  drumset.tom2  = [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1];
  drumset.tom3 =  [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0];
  drumset.effect = [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0];

$(document).ready(function() {

        //get tempo
        $('#tempo').val(tempo);

        $( "#tempo" ).change(function() {
        	if($('#tempo').val() >30){
             tempo = $('#tempo').val();
        	}else {
            $('#tempo').val(tempo)
          }
        });

		   $('.insideSquare').click(function() {
          var logOutput;

          var currentClass = $(this).attr('class').split(/\s+/)[1];
          var currentElement = $(this).attr('id').slice(-2);



		   		if(	($(this).width()) == 20 ){
		   				console.log('eq  20 ')
          				drumset[currentClass][Number(currentElement)] = 0.3;

					   $(this).animate({
	           			width: '-=10px',
	           			height: '-=10px',
			           padding: '+=5px'

			       }); 	  
				}else if(($(this).width()) == 10 ){
							   				console.log('equal 10  ')
					drumset[currentClass][Number(currentElement)] = 0.0;


					$(this).animate({
	           			width: '-=10px',
	           			height: '-=10px',
	           			padding:'+=5px'

             
			       }); 	  
				}
				else{
							console.log('else  ')

     						drumset[currentClass][Number(currentElement)] = 1;

	           			$(this).animate({
	           			width: '20px',
	           			height: '20px',
	           			padding: '0px'

              		
			       }); 	  
				}

		    }); 


       //set up all elements to 0 with some pizzaz 
       for (var i = 0; i < 16; i++) {
          var stringAdd;

          if (i<10) stringAdd = '0'+ i; else stringAdd = i;


            if(drumset.hihat[i] == 0) 
            {
                $('#hihat_'+ stringAdd ).delay( 200*i ).animate({
                      width: '0px',
                    height: '0px',
                    padding: '10px'
                });
            }
            if(drumset.snare[i] == 0) {
              $('#snare_'+ stringAdd ).delay( 200*i ).animate({
                        width: '0px',
                      height: '0px',
                      padding: '10px'
              });
            }
            if(drumset.bass[i] == 0) {

                $('#bass_'+ stringAdd ).delay( 200*i ).animate({
                      width: '0px',
                      height: '0px',
                     padding: '10px'
                });
            
            }

            if(drumset.tom1[i] == 0) {

                $('#tom1_'+ stringAdd ).delay( 200*i ).animate({
                          width: '0px',
                        height: '0px',
                        padding: '10px'
                });          
            }if(drumset.tom2[i] == 0) {
              $('#tom2_'+ stringAdd ).delay( 200*i ).animate({
                        width: '0px',
                      height: '0px',
                      padding: '10px'
              });
            }if(drumset.tom3[i] == 0) {
              $('#tom3_'+ stringAdd ).delay( 200*i ).animate({
                        width: '0px',
                      height: '0px',
                      padding: '10px'
              });     
            }            
            if(drumset.effect[i] == 0) {
              $('#effect_'+ stringAdd ).delay( 200*i ).animate({
                        width: '0px',
                      height: '0px',
                      padding: '10px'
              });
            }

       }

       //playListeer
        $("#playImg" ).click(function() {
        	if(playing == false){
          		context = new AudioContext();
          		playing = true;
          		init();
          	}
        });

        //pauselistener
        $("#pauseImg" ).click(function() {
          context.close()
          clearTimeout(timeoutID);
          beatNumber =-1;
          playing = false; 
        });








});




//copy pasta for playing bufferd sounds

//bufferloader funtion
function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
    this.loadBuffer(this.urlList[i], i);
}





//playsound function //////
function playSound(buffer, time , gain) {
    var gainNode = context.createGain();
    var source = context.createBufferSource();
    source.buffer = buffer;

    source.connect(gainNode);
    gainNode.connect(context.destination);

    gainNode.gain.value = gain;


    if (!source.start)
      source.start = source.noteOn;
    source.start(time);
  }


//INIT FUNCTION///
function init() {
     // Fix up prefixing

  bufferLoader = new BufferLoader(
    context,
    [
      'sounds/siameseSnare.wav',
      'sounds/siameseBass.wav',
      'sounds/DominionHiHat.wav',
      'sounds/SiameseTom1.wav',
      'sounds/SiameseTom2.wav',
      'sounds/SiameseTom3.wav',
      'sounds/siameseEffect.wav'

    ],
    finishedLoading
    );

  bufferLoader.load();

  //do a little math for temop control here

   var callFrequecny = 1000/(tempo/16);

   console.log(callFrequecny)

  timeoutID = setTimeout('init()',callFrequecny)
  beatNumber += 1;
  //animate metronome///
  var stringAdd;
  
  if ((beatNumber%16)<10) stringAdd = '0'+ (beatNumber%16); else stringAdd = (beatNumber%16);
    
  $('#metronome_' + stringAdd).css("background-color","#EAC117");
  if (((beatNumber-1)%16)<10) stringAdd = '0'+ ((beatNumber-1)%16); else stringAdd = ((beatNumber-1)%16);

  $('#metronome_' + stringAdd).css("background-color","#000000");





}



function finishedLoading(bufferList) {

  var snare = bufferList[0];
  var kick = bufferList[1];
  var hihat = bufferList[2];
  var tom1 = bufferList[3];
  var tom2 = bufferList[4];
  var tom3 = bufferList[5];
  var effect = bufferList[6];


  var startTime = context.currentTime + 0.100;
   
  if(drumset.bass[beatNumber%16]) playSound(kick, startTime, drumset.bass[beatNumber%16]);
  if(drumset.snare[beatNumber%16]) playSound(snare, startTime, drumset.snare[beatNumber%16]);
  if(drumset.hihat[beatNumber%16]) playSound(hihat, startTime, drumset.hihat[beatNumber%16]);
  if(drumset.tom1[beatNumber%16]) playSound(tom1, startTime, drumset.tom1[beatNumber%16]);
  if(drumset.tom2[beatNumber%16]) playSound(tom2, startTime, drumset.tom2[beatNumber%16]);
  if(drumset.tom3[beatNumber%16]) playSound(tom3, startTime, drumset.tom3[beatNumber%16]);
  if(drumset.effect[beatNumber%16]) playSound(effect, startTime, drumset.effect[beatNumber%16]);


}



//rythem section
var RhythmSample = {
};


RhythmSample.play = function() {
  



 
};


///function calls
//window.onload = init;// calls init immdediately


