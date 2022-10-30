//var apiURL = "http://52.201.64.46";
var apiURL = "https://pecb.com";
var xAppKey = "1sf3434dfsdf8d87f8sfsfs8fjk3222d6f5b9c84ad270ed6c08fc4234kj23jHJ";

var cmonChild;

function postRequest(endpoint, postData, complete, failed) {

	$.ajax({
	  	type: "POST",
	  	url: apiURL + endpoint,
	  	headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"X-APP-KEY": xAppKey,
			"X-AUTH-TOKEN": getStoredCredentials().AuthToken
	  	},
		data: postData,
		success: complete,
		error: failed,
		dataType: "json"
	});
}

function getRequest(endpoint, complete, failed) {

	$.ajax({
	  	type: "GET",
	  	url: apiURL + endpoint,
	  	headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"X-APP-KEY": xAppKey,
			"X-AUTH-TOKEN": getStoredCredentials().AuthToken
	  	},
		success: complete,
		error: failed,
		dataType: "json"
	});
}


function login(username, password, complete, failed) {
	
	$.ajax({
	  	type: "POST",
	  	url: apiURL + "/proboApi/user/login",
	  	headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"X-APP-KEY": xAppKey
	  	},
		data: {
  	    	email: btoa(username), 
		  	password: btoa(password) 
		},
		success: function(data) {

			setStoredCredentials(data);

			if(typeof complete !== 'undefined' && complete != null)
				complete(data);
		},
		error: function(error) {

			if(typeof failed !== 'undefined' && failed != null) {

				if(error.responseJSON !== 'undefined')
					failed(error.responseJSON.message);
				else
					failed('Unknown error');
			}
		},
		dataType: "json"
	});
}

function getUserExamSession(page, count, complete, failed) {

	getRequest("/proboApi/examSession/getUserExamSession?page_count=" + page + "&page_size=" + count,
	  	
	  	function(data) {

			complete(data);
		},
		function(error) {

			if(error.responseJSON !== 'undefined')
				failed(error.responseJSON.code);
			else
				failed('503');
		}
	);
}

function checkExamineeProfileStatus(userScheduleId, userId, complete, failed) {

	getRequest("/proboApi/user/checkExamineeProfileStatus?user_schedule_id=" + userScheduleId + "&user_id=" + userId,
	  	
	  	function(data) {

			complete(data);
		},
		function(error) {

			if(error.responseJSON !== 'undefined')
				failed(error.responseJSON.code);
			else
				failed('503');
		}
	);
}

function checkExamineeExamStatus(userScheduleId, userId, complete, failed) {

	getRequest("/proboApi/user/checkExamineeExamStatus?user_schedule_id=" + userScheduleId + "&user_id=" + userId,
	  	
	  	function(data) {

			complete(data);
		},
		function(error) {

			if(error.responseJSON !== 'undefined')
				failed(error.responseJSON.code);
			else
				failed('503');
		}
	);
}

function getExamPolicy(complete, failed) {

	getRequest("/proboApi/examInfo/examPolicy",
	  	
	  	function(data) {

			complete(data);
		},
		function(error) {

			if(error.responseJSON !== 'undefined')
				failed(error.responseJSON.code);
			else
				failed('503');
		}
	);
}

function getExamFaq(complete, failed) {

	getRequest("/proboApi/examInfo/examFaq",
	  	
	  	function(data) {

			complete(data);
		},
		function(error) {

			if(error.responseJSON !== 'undefined')
				failed(error.responseJSON.code);
			else
				failed('503');
		}
	);
}

function checkTermsStatus(userScheduleId, complete, failed) {

	getRequest("/proboApi/user/checkTermsStatus?user_schedule_id=" + userScheduleId,
	  	
	  	function(data) {

			complete(data);
		},
		function(error) {

			if(error.responseJSON !== 'undefined')
				failed(error.responseJSON.code);
			else
				failed('503');
		}
	);
}

function postTermStatus(userScheduleId, termsAccepted, complete, failed) {

	postRequest("/proboApi/user/postTermStatus",
	
		{
			user_schedule_id: userScheduleId,
			term_status: termsAccepted ? 1 : 2
		},

	  	function(data) {

			complete(data);
		},
		function(error) {

			if(error.responseJSON !== 'undefined')
				failed(error.responseJSON.code);
			else
				failed('503');
		}
	);
}

function postSystemMonitoringStatus(userScheduleId, camOK, micOK, netOK, complete, failed) {

	var cameraMessage = camOK ? "Camera OK" : "Camera failed";
	var microphoneMessage = micOK ? "Microphone OK" : "Microphone failed";
	var networkMessage = netOK ? "Network OK" : "Network too slow";

	var cameraStatus = camOK ? 1 : 2;
	var microphoneStatus = micOK ? 1 : 2;
	var networkStatus = netOK ? 1 : 2;

	var finalStatus = (camOK && micOK && netOK) ? 1 : 2;

	postRequest("/proboApi/user/postSystemMonitoringStatus",
	
		{
			user_schedule_id: userScheduleId,
			message: "[" + cameraMessage + "," + microphoneMessage + "," + networkMessage + "]",
			status: "[" + cameraStatus + "," + microphoneStatus + "," + networkStatus + "]",
			FinalMonitoringStatus: finalStatus
		},

	  	function(data) {

			complete(data);
		},
		function(error) {

			if(typeof error.responseJSON !== 'undefined' && typeof error.responseJSON.code !== 'undefined')
				failed(error.responseJSON.code);
			else
				failed('503');
		}
	);
}

function userExamResponse(userScheduleId, complete, failed) {

	postRequest("/proboApi/userExamResponse/saveResponse",
	
		{
			user_schedule_id: userScheduleId
		},

	  	function(data) {

			complete(data);
		},
		function(error) {

			if(error.responseJSON !== 'undefined')
				failed(error.responseJSON.code);
			else
				failed('503');
		}
	);
}

function onlineExamHelpImages(complete, failed) {

	getRequest("/proboApi/examInfo/onlineExamHelpImages",
	  	
	  	function(data) {

			complete(data);
		},
		function(error) {

			if(error.responseJSON !== 'undefined')
				failed(error.responseJSON.code);
			else
				failed('503');
		}
	);
}

function customMessages(language, complete, failed) {

	getRequest("/proboApi/examInfo/customMessages?language=" + language,
	  	
	  	function(data) {

			complete(data);
		},
		function(error) {

			if(error.responseJSON !== 'undefined')
				failed(error.responseJSON.code);
			else
				failed('503');
		}
	);
}

function getItemSequence(userExamResponseId, complete, failed) {

	getRequest("/proboApi/examSession/getItemSequence?userExamResponseId=" + userExamResponseId,
	  	
	  	function(data) {

			complete(data);
		},
		function(error) {

			if(error.responseJSON !== 'undefined')
				failed(error.responseJSON.code);
			else
				failed('503');
		}
	);
}

function getItemData(userExamResponseId, itemUnderExamId, complete, failed) {

	getRequest("/proboApi/examInfo/getItemData?userExamResponseId=" + userExamResponseId + 
			   "&item_under_exam_id=" + itemUnderExamId,
	  	
	  	function(data) {

			complete(data);
		},
		function(error) {

			if(error.responseJSON !== 'undefined')
				failed(error.responseJSON.code);
			else
				failed('503');
		}
	);
}

function markUnmarkExamItemForReview(userExamResponseId, itemUnderExamId, answer, markStatus, itemType, timeLeft, complete, failed) {

	postRequest("/proboApi/userExamResponse/markUnmarkExamItemForReview",
	
		{
			item_under_exam_id: itemUnderExamId,
			answer: answer,
			examItemType: itemType,
			markStatus: (markStatus ? '1' : '2'),
			userExamResponseId: userExamResponseId,
			time_left_for_examination: timeLeft
		},

	  	function(data) {

			complete(data);
		},
		function(error) {

			if(error.responseJSON !== 'undefined')
				failed(error.responseJSON.code);
			else
				failed('503');
		}
	);
}

function saveItemResponse(userExamResponseId, itemUnderExamId, answer, itemType, timeLeft, complete, failed) {

	postRequest("/proboApi/userExamResponse/saveItemResponse",
	
		{
			userExamResponseId: userExamResponseId,
			item_under_exam_id: itemUnderExamId,
			answer: answer,
			itemTypeId: itemType,
			time_left_for_examination: timeLeft
		},

	  	function(data) {

			complete(data);
		},
		function(error) {

			if(error.responseJSON !== 'undefined')
				failed(error.responseJSON.code);
			else
				failed('503');
		}
	);
}

function deleteItemResponse(userExamResponseId, itemUnderExamId, complete, failed) {

	getRequest("/proboApi/userExamResponse/deleteItemResponse?userExamResponseId=" + userExamResponseId + 
			   "&item_under_exam_id=" + itemUnderExamId,
	  	
	  	function(data) {

			complete(data);
		},
		function(error) {

			if(error.responseJSON !== 'undefined')
				failed(error.responseJSON.code);
			else
				failed('503');
		}
	);
}

function getExamConfirmationPopupResponse(userExamResponseId, complete, failed) {

	getRequest("/proboApi/userExamResponse/getExamConfirmationPopupResponse?userExamResponseId=" + userExamResponseId,
	  	
	  	function(data) {

			complete(data);
		},
		function(error) {

			if(error.responseJSON !== 'undefined')
				failed(error.responseJSON.code);
			else
				failed('503');
		}
	);
}

function getExamResult(userExamResponseId, complete, failed) {

	getRequest("/proboApi/userExamResponse/getExamResult?userExamResponseId=" + userExamResponseId,
	  	
	  	function(data) {

			complete(data);
		},
		function(error) {

			if(error.responseJSON !== 'undefined')
				failed(error.responseJSON.code);
			else
				failed('503');
		}
	);
}

function submitExam(userExamResponseId, timeLeft, complete, failed) {

	postRequest("/proboApi/userExamResponse/submitExam",
	
		{
			userExamResponseId: userExamResponseId,
			time_left_for_examination: timeLeft
		},

	  	function(data) {

			complete(data);
		},
		function(error) {

			if(error.responseJSON !== 'undefined')
				failed(error.responseJSON.code);
			else
				failed('503');
		}
	);
}

function exitFromExam(userExamResponseId, complete, failed) {

	postRequest("/proboApi/userExamResponse/exitFromExam",
	
		{
			userExamResponseId: userExamResponseId
		},

	  	function(data) {

			complete(data);
		},
		function(error) {

			if(error.responseJSON !== 'undefined')
				failed(error.responseJSON.code);
			else
				failed('503');
		}
	);
}

function postChatMessage(userId, message, complete, failed) {

	postRequest("/proboApi/examSession/postChatMessage",
	
		{
			eventId: getEventId(),
			message: message,
			sentByUser: 1,
			sentTo: userId
		},

	  	function(data) {

			complete(data);
		},
		function(error) {

	  		alert(JSON.stringify(error));

			if(error.responseJSON !== 'undefined')
				failed(error.responseJSON.code);
			else
				failed('503');
		}
	);
}


/* Get/set credentials
 * 
 */
function isStoredCredentials() {

	var credentials = localStorage.credentials;
	
	return typeof credentials !== 'undefined';
}

function getStoredCredentials() {

	var credentials = localStorage.credentials;
	
	if(typeof credentials !== 'undefined')
		return JSON.parse(credentials);
	else
		return {};
}

function setStoredCredentials(credentials) {

	localStorage.credentials = JSON.stringify(credentials);
}

function loginOK() {

	//TODO: Validate access token

	return isStoredCredentials();
}

/* Get/set cached content
 * 
 */
function getStoredTermsContent() {

	var termsContent = localStorage.termsContent;
	
	if(typeof termsContent !== 'undefined')
		return JSON.parse(termsContent);
	else
		return null;
}

function setStoredTermsContent(termsContent) {

	localStorage.termsContent = JSON.stringify(termsContent);
}

function setSelectedExamId(examId) {

	localStorage.selectedExamId = examId;
} 

function getSelectedExamId() {

	return localStorage.selectedExamId;
}

function setEventId(eventId) {

	localStorage.eventId = eventId;
}

function getEventId() {

	return localStorage.eventId;
}

function setInvigilatorId(invigilatorId) {

	localStorage.invigilatorId = invigilatorId;
}

function getInvigilatorId() {

	return localStorage.invigilatorId;
}

function setUserExamResponseId(userExamResponseId) {

	localStorage.userExamResponseId = userExamResponseId;
}

function getUserExamResponseId() {

	return localStorage.userExamResponseId;
}

function setInitialTimerValue(value) {

	localStorage.initialTimerValue = value;
}

function getInitialTimerValue() {

	return parseInt(localStorage.initialTimerValue);
}

function setSelectedVideoSource(videoSource) {

    localStorage.videoSource = videoSource;
}

function getSelectedVideoSource() {

    return localStorage.videoSource;
}

function setTestTime(testTime) {

	localStorage.testTime = testTime;
}

function getTestTime() {

	return localStorage.testTime;
}

function setExamActive(value) {

	localStorage.examActive = value;
}

function getExamActive() {

	return localStorage.examActive;
}

function majorFailure() {

    alert("Something has gone horribly wrong");
    window.location.replace("Login.html");
}

function checkRtcServer(complete, failed) {

	$.ajax({
	  	type: "GET",
	  	url: 'http://ec2-34-195-204-189.compute-1.amazonaws.com:12346/socket.io/socket.io.js',
	  	headers: {
			"Content-Type": "text/html"
	  	},
		success: complete,
		error: failed
	});
}

function enableClosing() {
    
    var win = require('nw.gui').Window.get();

    win.on('close', function(){
        this.close(true);
    });

    win.on('closed', function(){
        this.close(true);
    });
}

function disableClosing() {

    var win = require('nw.gui').Window.get();

    win.on('close', function(){
        this.close(false);
    });

    win.on('closed', function(){
        this.close(false);
    });
}

function enableForcedStay() {

    var sys = require('sys')
    var exec = require('child_process').exec;

    cmonChild = exec("cmon.exe", 
    	function (error, stdout, stderr) {

    	}
    );
}

function runningOnVm(callback) {

    var sys = require('sys')
    var exec = require('child_process').exec;

	//The minimal number of tests needed to pass as Native OS
    var minTests = 5;

    cmonChild = exec("ScoopyNG.exe", 
    	function (error, stdout, stderr) {

    		if(!error)
    			callback((stdout.match(/Native OS/g) || []).length < minTests);	
    		else
    			callback(false);
    	}
    );
}

function quitApp() {

	enableClosing();
	
    var gui = require('nw.gui');
    gui.App.quit();
}