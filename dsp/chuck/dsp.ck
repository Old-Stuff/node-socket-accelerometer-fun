// (launch with s.ck)

// the patch

SinOsc s[5];
JCRev r[5];
ADSR adsr[5];
Chorus c;
Step st1=> Envelope modFreqEnv => blackhole;
Step st2=> Envelope modDepthEnv => blackhole;
Step fingerstep[5];
Envelope fingerEnv[5];
200::ms => modFreqEnv.duration;
200::ms => modDepthEnv.duration;

0 => c.modFreq;
0 => c.modDepth;
0.5 => c.mix;

for(int i ; i < 5; 1 +=> i ) {
    fingerstep[i] => fingerEnv[i] => blackhole;
    100::ms => fingerEnv[i].duration;
    s[i] => r[i] => adsr[i] => c => dac;
    .8 => s[i].gain;
    .1 => r[i].mix;
    adsr[i].set( 50::ms, 8::ms, .5, 500::ms );
    adsr[i].keyOff();
}


// create our OSC receiver
OscRecv recv;
// use port 6449 (or whatever)
3333 => recv.port;
// start listening (launch thread)
recv.listen();

// create an address in the receiver, store in new variable
recv.event( "/one/position, i i" ) @=> OscEvent @ onePosition;
recv.event( "/one/state i") @=> OscEvent @ oneState;
recv.event( "/two/position, i i" ) @=> OscEvent @ twoPosition;
recv.event( "/two/state i") @=> OscEvent @ twoState;
recv.event( "/three/position, i i" ) @=> OscEvent @ threePosition;
recv.event( "/three/state i") @=> OscEvent @ threeState;
recv.event( "/four/position, i i" ) @=> OscEvent @ fourPosition;
recv.event( "/four/state i") @=> OscEvent @ fourState;
recv.event( "/five/position, i i" ) @=> OscEvent @ fivePosition;
recv.event( "/five/state i") @=> OscEvent @ fiveState;
recv.event( "/alpha f") @=> OscEvent @ alpha;
recv.event( "/beta f") @=> OscEvent @ beta;
recv.event( "/gamma f") @=> OscEvent @ gamma;

fun void enveloper(){
    while(true)
    {
        c.modFreq(modFreqEnv.last());
        c.modDepth(modDepthEnv.last());
        for(int i ; i < 5; 1 +=> i ) {
            s[i].freq(fingerEnv[i].last());
        }
        1::samp=>now;
    }
}

fun void tiltAlpha(){
  float al;
  while( true )
  {
    alpha => now;
    
    while( alpha.nextMsg() ) {
      alpha.getFloat() => al;
      modFreqEnv.target(al);
    }
  }
}

fun void tiltBeta(){
  float bt;
  while( true )
  {
    beta => now;
    
    while( beta.nextMsg() ) {
      beta.getFloat() => bt;
      Math.fabs(bt) / 400 => bt;
      modDepthEnv.target(bt);
    }
  }
}

fun void tiltGamma(){
  float gm;
  while( true )
  {
    gamma => now;
    
    while( gamma.nextMsg() ) {
      gamma.getFloat() => gm;
      Math.fabs(gm) / 400 => gm;
      gm => c.mix;
    }
  }
}

fun void receivePosition( OscEvent event, int finger){
  // infinite event loop
  while( true )
  {
      // wait for event to arrive
      event => now;

      // grab the next message from the queue. 
      while( event.nextMsg() )
      { 
          int x;
          int y;

          // getFloat fetches the expected float (as indicated by "i f")
          event.getInt() => x;
          fingerEnv[finger].target(Math.pow(x, 2) / 300);
          // Math.pow(x, 2) / 300 => s[finger].freq;
          event.getInt() => y;
          y / 450 => r[finger].mix;

      }
  }
}

fun void onPress( OscEvent event, int finger){
  // infinite event loop
  while( true )
  {
      // wait for event to arrive
      event => now;

      // grab the next message from the queue. 
      while( event.nextMsg() )
      { 
          float i;
          float gain;

          event.getInt() => i;
          if (i == 1){
            adsr[finger].keyOn();
          }
          else {
            adsr[finger].keyOff();
          }

      }
  }
}

spork ~ enveloper();
spork ~ receivePosition(onePosition, 0);
spork ~ onPress(oneState, 0);
spork ~ receivePosition(twoPosition, 1);
spork ~ onPress(twoState, 1);
spork ~ receivePosition(threePosition, 2);
spork ~ onPress(threeState, 2);
spork ~ receivePosition(fourPosition, 3);
spork ~ onPress(fourState, 3);
spork ~ receivePosition(fivePosition, 4);
spork ~ onPress(fiveState, 4);
spork ~ tiltAlpha();
spork ~ tiltBeta();
// spork ~ tiltGamma();

1::day => now;