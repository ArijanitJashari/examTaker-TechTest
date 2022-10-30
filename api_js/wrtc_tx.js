'use strict';

function RTCTx() {

  this.videoView = null;
  
  this.offerGeneratedCallback = function(offer) {};
  this.iceCandidateAddedCallback = function(candidate) {};

  this.peerConnection = null;
  this.localstream = null;
  this.screenStream = null;
  this.currentStream = null;

  this.offerOptions = {offerToReceiveAudio: 1, offerToReceiveVideo: 1};
}

RTCTx.prototype.stopCall = function() {

  if(this.videoView != null)
    this.videoView.srcObject = null;

  this.videoView = null;
  this.peerConnection = null;
  this.localstream = null;
  this.screenStream = null;

  this.offerOptions = {offerToReceiveAudio: 1, offerToReceiveVideo: 1};

  this.answerCallback = function(answer) {};
  this.finalAnswerCallback = function(answer) {};

  this.iceCandidateAddedCallback = function(candidate) {};
}

RTCTx.prototype.gotStream = function(stream) {
  
  if(this.videoView != null)
    this.videoView.srcObject = stream;

  this.localstream = stream;
  this.currentStream = this.localstream;
}

RTCTx.prototype.gotScreenStream = function(stream) {

  this.screenStream = stream;
}

RTCTx.prototype.switchStream = function(toCamera) {

  if(toCamera)
    this.currentStream = this.localstream;
  else
    this.currentStream = this.screenStream;

  this.getOffer();
}

RTCTx.prototype.mediaReady = function() {

  var videoTracks = this.localstream.getVideoTracks();
  var audioTracks = this.localstream.getAudioTracks();

  return videoTracks.length > 0 && audioTracks.length > 0;
}

RTCTx.prototype.getOffer = function() {

  var servers = {"iceServers":[{"urls":["turn:ec2-34-195-204-189.compute-1.amazonaws.com:3478"],"username":"pecb","credential":"q*N^M@xyv&X62-4x"}],
                 "iceTransportPolicy":"relay",
                 "rtcpMuxPolicy":"negotiate"};

  if(this.peerConnection != null)
    this.peerConnection.close();

  this.peerConnection = new RTCPeerConnection(servers);

  this.peerConnection.onicecandidate = (event) => this.iceCallback(event);
  this.peerConnection.addStream(this.currentStream);

  this.peerConnection.createOffer(this.offerOptions)
  .then(
    (desc) => this.gotDescription(desc),
    () => this.errorMessage
  );
}

RTCTx.prototype.gotDescription = function(desc) {

  this.peerConnection.setLocalDescription(desc)
  .then(
    () => this.successMessage,
    () => this.errorMessage
  );
  
  this.offerGeneratedCallback(JSON.stringify(desc));
}

RTCTx.prototype.setAnswer = function(answer) {
  
  var desc = JSON.parse(answer);
  this.peerConnection.setRemoteDescription(desc);
}

RTCTx.prototype.iceCallback = function(event) {

  if (event.candidate)
    this.iceCandidateAddedCallback(JSON.stringify(event.candidate));
}

RTCTx.prototype.setICECandidate = function(remoteICE) {

  var candidate = JSON.parse(remoteICE);

  this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
  .then(
    () => this.successMessage,
    () => this.errorMessage
  );
}

RTCTx.prototype.setVideoView = function(videoElement) {

  this.videoView = videoElement;

  if(this.localstream != null)
    this.videoView.srcObject = this.localstream;
}

RTCTx.prototype.removeVideoView = function() {

  if(this.videoView != null)
    this.videoView.srcObject = null;

  ths.videoView = null;
}


RTCTx.prototype.errorMessage = function(error) {
  
  console.log('Error: ' + error);
  this.stopCall();
}

RTCTx.prototype.successMessage = function(error) {
  
  console.log('Completed: ' + error);
}