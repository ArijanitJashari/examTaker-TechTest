function userMediaAvailable(callback) {

    navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then(function(stream) {

        var audioTracks = stream.getAudioTracks();
        var videoTracks = stream.getVideoTracks();

        var audioTrackCout = audioTracks.length;
		var videoTrackCout = videoTracks.length;
        
        for(i=0;i<audioTracks.length;i++)
        	audioTracks[i].stop();

		for(i=0;i<videoTracks.length;i++)
        	videoTracks[i].stop();
        
        callback(audioTrackCout > 0, videoTrackCout > 0);
    })
    .catch(function(e) {
       
       callback(false, false);
    });
}