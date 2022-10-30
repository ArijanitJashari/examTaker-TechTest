var helpImages;
var currentHelpImage;

var totalSeconds;
var imageChangeIntervalRef;
var timerIntervalRef = null;
var switchedToExam;

function initTimer() {

    helpImages;
    currentHelpImage = 0;
    switchedToExam = false;
	
    totalSeconds = getInitialTimerValue();

    refreshTimer();

    if(timerIntervalRef == null)
    	timerIntervalRef = setInterval(refreshTimer, 1000);

    onlineExamHelpImages(

        function (data) {

            helpImages = data.image;

			$('#help_image').attr({'src': helpImages[0]});
            
            //Uncomment the line below to activate switching between help images
            //imageChangeIntervalRef = setInterval(changeHelpImage, 5000);
        },
        function (error) {}
    );
}

function stopWaitingTimer() {

    if(timerIntervalRef != null) 
        clearInterval(timerIntervalRef);
}

function stopAutoImageChange() {
    
    clearInterval(imageChangeIntervalRef);
}

function changeHelpImage() {

    $('#help_image').attr({'src': helpImages[currentHelpImage]});
    currentHelpImage++;

    if(currentHelpImage == helpImages.length)
        currentHelpImage = 0;
}

function refreshTimer() {

    if (totalSeconds == 0) {

		if(!switchedToExam) {
		
			loadPage('exam_body.html', 'Exam page', initExam);
			switchedToExam = true;
        }
		
		clearInterval(timerIntervalRef);
    }
	else {
	
		totalSeconds--;
	}
	
	
	var currentSeconds = totalSeconds % 60;
	var currentMinutes = Math.floor(totalSeconds / 60) % 60;
	var currentHours = Math.floor(totalSeconds / 60 / 60);
	
	if (currentSeconds <= 9) 
		currentSeconds = "0" + currentSeconds;

	if (currentMinutes <= 9) 
		currentMinutes = "0" + currentMinutes;

	if (currentHours <= 9) 
		currentHours = "0" + currentHours;

	if(document.getElementById("timerText") != null)
		document.getElementById("timerText").innerHTML = currentHours+ ":" + currentMinutes + ":" + currentSeconds;		
}