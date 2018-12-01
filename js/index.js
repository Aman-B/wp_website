var index =(function ($)
{
	//alert('works!')

	// Initialize Firebase
	 var firebase = require("firebase/app");
	 require('firebase/database');

	  // Testing Firebase
	  var config = {
	    apiKey: "AIzaSyBl5Calb9Zh-r2uBQnPjLTmDPrL_wNv5cc",
	    authDomain: "writingprompts-82151.firebaseapp.com",
	    databaseURL: "https://writingprompts-82151.firebaseio.com",
	    projectId: "writingprompts-82151",
	    storageBucket: "writingprompts-82151.appspot.com",
	    messagingSenderId: "123353236119"
	  };
	  firebase.initializeApp(config);


	  var monthsArray = ["Jan", "Feb", "March", "April",
	  				"May", "June","July", "Aug",
	  				"Sep","Oct","Nov","Dec"]
		

	  var lastPostTimeStamp;


	  var pageNumber=1;

	  var previousOrNext=0;

	  const MAX_NUMBER_OF_PAGES =1000;

	  var timeStampForPrevious = new Array(MAX_NUMBER_OF_PAGES);



	  $('.master').load('promptCard.html');
	  hideNextAndPrevButtons();
	  getFirstPrompts();


	  	function getFirstPrompts() {
		
			firebase.database().ref('Online_WP').child("Prompts").orderByChild('time/time').limitToFirst(25).once('value',function(snapshot) {

			
				var arr=snapshotToArray(snapshot);
				

				var promptCard= $('#promptCard');
				updateInUI(arr[0],promptCard);

				//save if prev is clicked.
				timeStampForPrevious[pageNumber]=arr[0].time.time;
				console.log('tt' +timeStampForPrevious);

				console.log(arr[0]);

				for (var i = 1; i <=arr.length - 1; i++) {
					console.log(arr[i]);
					
					
					var promptCard = $('#promptCard').clone().prop('id','promptCard'+i);
  					$('.master').append(promptCard);
  					updateInUI(arr[i],promptCard);

					
				};
	  			
	  			showContainer();
				showPrevAndNextButtons();
	  			hideLoadingBar();

			  
			 
			}).catch(error =>{
				console.log(error);
			});
			 
		};

		/*Adding data to UI*/
		function updateInUI (dataFromFirebase,parentDiv) {
			var date = new Date((-1)*(dataFromFirebase.time.time));
			// body...
			parentDiv.find('#userName').html(dataFromFirebase.userName);
			if(dataFromFirebase.userImageURL == '')
			{
				parentDiv.find("#userImage").attr('src', 'images/ic_launcher.png');

			}
			else
			{
				parentDiv.find("#userImage").attr('src', dataFromFirebase.userImageURL);

			}
			parentDiv.find('#prompt-content').html(dataFromFirebase.userPrompt);
			parentDiv.find('#prompt-date').html(date.getDate()+" "+monthsArray[date.getMonth()]+" "+date.getFullYear());

			/*console.log(dataFromFirebase.time.time);
			
			console.log(date);
			console.log(date.getDate());
			console.log(date.getMonth());
			console.log(date.getDate()+monthsArray[date.getMonth()]+date.getFullYear());*/
		}




		/* Converting snapshot to array*/

	   function snapshotToArray(snapshot) 
	    {
		    var returnArr = [];

		    snapshot.forEach(function(childSnapshot) {
		        var item = childSnapshot.val();
		        item.key = childSnapshot.key;

		        if(!(item.isPending))
		        {
		        	console.log(item.time.time);
		        	lastPostTimeStamp=item.time.time;
			        returnArr.push(item);
		        }	
		    });

		    return returnArr;
		};

		 function getListOfPrompts(timeStampToLoad,previousOrNext) 
		 {

		
			firebase.database().ref('Online_WP').child("Prompts").orderByChild('time/time').startAt(timeStampToLoad).limitToFirst(25).once('value',function(snapshot) {

			
				var arr=snapshotToArray(snapshot);
				


				//save only if next is clicked.
				if(previousOrNext ==1)
				{
					if(pageNumber >1)
					{
						timeStampForPrevious[pageNumber]=arr[0].time.time;
						console.log('tt' +timeStampForPrevious);

					}
				}
				
				console.log(arr[0]);

				var promptCard= $('#promptCard');
				updateInUI(arr[0],promptCard);

				for (var i = 1; i <=arr.length - 1; i++) {
					console.log(arr[i]);
					
					
					var promptCard = $('#promptCard').clone().prop('id','promptCard'+i);
  					$('.master').append(promptCard);
  					updateInUI(arr[i],promptCard);

					
				};

				showContainer();
				showPrevAndNextButtons();
				hideLoadingBar();
	  			
			  
			 
			}).catch(error =>{
				console.log(error);
			});
			 
		};

		$('#prevBtn').click(function (){
			if(timeStampForPrevious != null)
			{
				
				
				if(pageNumber>1)
				{
					console.log("pg prev "+ pageNumber +"tt "+timeStampForPrevious[pageNumber-1]);

					hideNextAndPrevButtons();
					showLoadingBar();
					hideContainer();
					emptyContainerAndLoadPromptCard();
					
					previousOrNext=0;
					getListOfPrompts(timeStampForPrevious[pageNumber-1],previousOrNext);
					pageNumber--;
					console.log("pg prev "+ pageNumber);


				}
			}
			else
			{
				alert('null');
			}
		});

		$('#nextBtn').click(function (){
			if(lastPostTimeStamp != null)
			{
				


				if(pageNumber <MAX_NUMBER_OF_PAGES)
				{
					console.log("pg next "+ pageNumber);

					hideNextAndPrevButtons();
					showLoadingBar();
					hideContainer();
					emptyContainerAndLoadPromptCard();

					previousOrNext=1;
					getListOfPrompts(lastPostTimeStamp,previousOrNext);
					pageNumber++;
					console.log("pg next "+ pageNumber);


				}
			}

			
		});

	function showLoadingBar () {
		// body...
		$('.overlay').show();
	}

	function hideLoadingBar () {
		// body...
		$('.overlay').hide();
	}

	function showContainer () {
		// body...
		$('.master').css('visibility','visible');

	}

	function hideContainer () {
		// body...
		$('.master').css('visibility','hidden');

	}

	function emptyContainerAndLoadPromptCard () {
		// body...
		$('.master').empty();
		$('.master').load('promptCard.html');
	}

	function showPrevAndNextButtons () {
		// body...
		$('#prevBtn').css('visibility','visible');
		$('#nextBtn').css('visibility','visible');
	}

	function hideNextAndPrevButtons () {
		// body...
		$('#prevBtn').css('visibility','hidden');
		$('#nextBtn').css('visibility','hidden');
	}


	/*$('#submitPrompt-btn').click(function (){
		alert('submit man!');
	});

	$('#login-btn').click(function (){
		alert('login man!');
	});
	$('#signup-btn').click(function (){
		alert('signup man!');
	});*/



})(jQuery); //IIFE end.