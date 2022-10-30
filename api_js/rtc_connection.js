var rtcTx = new RTCTx();
var socket = io.connect('http://ec2-34-195-204-189.compute-1.amazonaws.com:12345');

var userID = getStoredCredentials().Userid;
var messageReceived = false;

function rtcInit() {

    initStreams();
    initScreenStreams();   
}

socket.on('message', handleMessage);

function handleMessage(message) {

    var messageObject = JSON.parse(message);
    messageReceived = true;

    console.log(messageObject.operation);

    switch(messageObject.operation) {

        case "get-id":
            socket.emit('message', JSON.stringify({operation: "id", message: userID, invigilatorId: getInvigilatorId()}));
            break;

        case "get-offer":
           
            rtcTx.getOffer();
            break;

        case "set-answer":

            rtcTx.setAnswer(messageObject.message);
            socket.emit('message', JSON.stringify({operation: "answer-set", message: ""}));

            break;

        case "set-acception":

            rtcTx.setAnswer(messageObject.message);
            socket.emit('message', JSON.stringify({operation: "acception-set", message: ""}));
            break;


        case "ice-candidate":

            rtcTx.setICECandidate(messageObject.message);
            break;

        case "authenticated":

            authenticated(messageObject.message);
            break;

        case "rejected":

            console.log('rejected');
            rejected(messageObject.message);
            break;

        case "ended":

            examEnded(messageObject.message);
            break;

        case "message":

            receiveUserMessage(messageObject.message);
            break;

        case "switch-stream":

            rtcTx.switchStream(messageObject.message == 'camera');
            break;

        case "tx-failed":
            alert('Could not send message');
            break;
    }
}

rtcTx.offerGeneratedCallback = function(offer) {

    socket.emit('message', JSON.stringify({operation: "set-offer", message: offer}));
}

rtcTx.iceCandidateAddedCallback = function(candidate) {

    socket.emit('message', JSON.stringify({operation: "ice-candidate", message: candidate}));
};

function initStreams() {

    var constraints = {
        video: {
            optional: [{
                sourceId: getSelectedVideoSource()
            }]
        }, 
        audio:true
    };

    navigator.webkitGetUserMedia(constraints, 
        function(stream) {

            rtcTx.gotStream(stream);            
        },
        function(e) {

           showMessage('Permissions to access the camera were not granted, error: ' + e, 'Error');
        }
    );
}

function initScreenStreams() {

    var loaded = false;

    var gui = require('nw.gui'); 
    gui.Screen.Init();
    gui.Screen.DesktopCaptureMonitor.on("added", function (id, name, order, type) {
       //select first stream and shutdown

        var constraints = {
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: gui.Screen.DesktopCaptureMonitor.registerStream(id),
                }
            }
        };

        if(!loaded) {
      
            navigator.webkitGetUserMedia(constraints,
        
                function(stream) {
                    
                    rtcTx.gotScreenStream(stream);
                }, 
                function(e) {

                    //Unable to init screen sharing, notify invigilator
                    notifyInvigilator('screen-sharing-error');
                }
            );    

            loaded = true;
        }
    
        gui.Screen.DesktopCaptureMonitor.stop();
    });

    gui.Screen.DesktopCaptureMonitor.on("removed", function (id) { });
    gui.Screen.DesktopCaptureMonitor.on("orderchanged", function (id, new_order, old_order) { });
    gui.Screen.DesktopCaptureMonitor.on("namechanged", function (id, name) { });
    gui.Screen.DesktopCaptureMonitor.on("thumbnailchanged", function (id, thumbnail) { });
    gui.Screen.DesktopCaptureMonitor.start(true, true);
}

function sendUserMessage(message) {

    socket.emit('message', JSON.stringify({operation: "message", message: message}));
    
    postChatMessage(userID, message,
        function(data) {},
        function(error) {}
    );
}

function alreadyVerified() {

    socket.emit('message', JSON.stringify({operation: "already-verified", message: ""}));
}

function notifyInvigilator(message) {

    socket.emit('message', JSON.stringify({operation: "notify", message: message}));
}

function setVideoPreview(videoPreview) {

    rtcTx.setVideoView(document.getElementById(videoPreview));
}