// JavaScript Document

(function($){ //Using $ as alias can cause plugin to conflict with other libraries...Throwing in jquery at the bottom fixes this
	
	var screenImagePath = "images/screen.png";
	var hoverImagePath = "images/hover.png";
	var questionBG = "images/questionbg.png";
	var key = "images/key.png";
	var correct = "images/correct.gif";
	var wrong = "images/wrong.gif";
	var videoIMG = "images/video.png";
	var cameraIMG = "images/camera.png";
	
	
	var screenWidth = 125;
	var screenHeight = 100;
	
	var width; //Total screen width
	var height; //Total screen height
	var columns; //Number of columns
	var rows; //Number of rows
	var topics; //Array of category topics
	var questions; //Questions file
	var answers; //Answers file
	var media; //Associated media to questions
	
	var clone; //Cloned screen
	var number; //ID of clicked screen
	var guess; //What the user guessed

	imageObj = new Image();
	
	images = new Array();
	images[0] = screenImagePath;
	images[1] = hoverImagePath;
	images[2] = questionBG;
	images[3] = key;
	images[4] = correct;
	images[5] = wrong;
	images[6] = videoIMG;
	images[7] = cameraIMG;

	
	for(i=0; i<images.length; i++) {
	  imageObj.src=images[i];
	}
	
	
	$.fn.extend({
		
				
		
		
		createQuestions: function() {
			for (x=1;x<=rows;x++) {				
				for (y=1;y<=columns;y++) {
					this.append('<div id="'+x+y+'" class="question real" style="float:left;position:relative;width:'+screenWidth+'px;height:'+screenHeight+'px;z-index:1000;background-image:url('+screenImagePath+');cursor:pointer;border:1px solid black;"></div>');	
					$("div[id='"+x+y+"']").bind({click: function(){$(this).showQuestion();}})
					
					$("div[id='"+x+y+"']").hoverIntent({
						sensitivity: 1000,
						interval: 50,
						timeout: 0,
						over: function() {
							$(this).css({"backgroundImage":"url("+hoverImagePath+")"});
						},
						out: function() {
							$(this).css({"backgroundImage":"url("+screenImagePath+")"});
						}
					});
					
				}	
			}		
		},
		
		
			
		
		showQuestion: function() {
			$(clone).remove();
			number = $(this).attr("id"); //Unqiue ID to find question in .txt
			clone = $(this).clone();
			clone = clone.removeClass("real");
			
			//Position where screen will start growing
			p = $(this).position();

			//Adjust format of cloned screed for question mode
			clone.css({"position" : "absolute", "left" : p.left+"px", "top" : p.top+"px", "width" : "127px", "height" : "102px", "zIndex" : "2000", "overflow" : "hidden", "backgroundImage" : "url("+questionBG+")", "color" : "white", "border" : "none", "textAlign" : "left"}).insertBefore(this);
			
			//Adjust dimensions to accomodate padding from border when growing full size
			
			if (!isNaN(window.innerHeight)) { //Non-IE
				height = window.innerHeight;
				width = window.innerWidth;
			}
			else { //IE 6+
				height = document.documentElement.clientHeight;
				width = document.documentElement.clientWidth;				
			}
		
			var header;
			var headerTitle = '<span style="float:left;margin:11px 0px 0px 10px;">Answer the following question!</span>';			
			var q;
			
			var aArray;
			var a1;
			var a2;
			var a3;
			var a4;
			
			
		
			//Grab the question and answers and assign them to the above variables
			findQuestion(clone,questions,answers);
			
			//Animate the question screen to full size
			clone.animate({'height' : height+'px', 'width' : width+'px', 'left' : '0', 'top' : '0'},500).html(header).append(q+a1+a2+a3+a4);
			
			$("#theQuestion").delay(1000).fadeIn("slow");
			$("#a1").delay(2000).fadeIn("slow");
			$("#a2").delay(2200).fadeIn("slow");
			$("#a3").delay(2400).fadeIn("slow");
			$("#a4").delay(2600).fadeIn("slow");
			
			$(document).bind({
				keydown: function(event) {
					guess = event.keyCode.toString();
					
					switch(guess) {
						case "49":
							guess = "a1";
							break;
						case "50":
							guess = "a2";
							break;						
						case "51":
							guess = "a3";
							break;
						case "52":
							guess = "a4";
							break;						
					}
					$(this).findAnswer();
				}
			}); 					
			
			clone.find(".close").bind("mousedown",function() {
				clone.remove();
			});
			
			function findQuestion(clone,questions,answers) {
				x = 0;
				fileArray = new Array(questions,answers);
				
				while (x < fileArray.length) {
					var filling;
					
					$.ajax({
						async: false,
						type: "get",
						url: "ajax/",
						cache: false,
						data: "file="+fileArray[x]+"&number="+number,
						success: function(html) {
							filling = html;
						},
						complete: function() {
							if (fileArray[x] == questions) {
								if (!filling.match(/^(<object )|(<img )/)) {
									header = '<div class="header">'+headerTitle+'<div class="close">X</div></div>';
									q = '<div id="theQuestion" class="theQuestion">'+filling+'</div>';
								}							
							}
							else if (fileArray[x] == answers) {
								if (!filling.match(/^(<object )|(<img )/)) {
									aArray = filling.split(":");
									
									for (i=0;i<aArray.length;i++) {
										if (aArray[i].match(/^(\*)/)) {
											theResponse = "correct";
											answer = aArray[i].replace("*","");
										}
										else {
											theResponse = "";
											answer = aArray[i];
										}
										
										switch (i) {
											case 0:
												a1 = '<div id="a1" class="answer"><div class="key">1</div>'+answer+'<div class="response '+theResponse+'"></div></div>';
												break;
											case 1:
												a2 = '<div id="a2" class="answer"><div class="key">2</div>'+answer+'<div class="response '+theResponse+'"></div></div>';
												break;
											case 2:
												a3 = '<div id="a3" class="answer"><div class="key">3</div>'+answer+'<div class="response '+theResponse+'"></div></div>';
												break;
											case 3:
												a4 = '<div id="a4" class="answer"><div class="key">4</div>'+answer+'<div class="response '+theResponse+'"></div></div>';
												break;
										}
									}
								}								
							}
						}
					});			
					x++;
				}
			}
		
		},
	
	
	
	
		findAnswer: function(options) {
			$(document).unbind("keydown");
		
			$(clone).children().each(function() {
				if (guess == $(this).attr("id")) {
					if ($(this).children(".response").hasClass("correct")) {
						$(this).children(".response").html('<img src="'+correct+'" />')
							options = {};
							$(clone).delay(1500).fadeOut("slow");
							$("div[id="+number+"][class='question real']").delay(1600).effect("pulsate",options,300,function(){});
							
							$.ajax({
								type: "get",
								url: "ajax/",
								cache: false,
								data: "rewrite=true&number="+number,
								success: function(html) {
								}			
							});
					}
					else {
						$(this).children(".response").html('<img src="'+wrong+'" />');
							$(clone).delay(1500).fadeOut("slow");						
					}
				}
			});		
		},
	
	
		
		squares: function(options) {
			debug(this);

		
			if (!isNaN(window.innerWidth)) { //Non-IE
				c = Math.floor(window.innerWidth/(screenWidth+6));
				r = Math.floor((window.innerHeight-screenHeight)/(screenHeight+6));
			}
			else { //IE 6+
				c = Math.floor(document.documentElement.clientWidth/(screenWidth+6));
				r = Math.floor((document.documentElement.clientHeight-screenHeight)/(screenHeight+6));
			}
			
			var defaults = {                
				columns: c,
				rows: r
			};
			
			var o = $.extend(defaults, options); //Extend allows us to include default settings for the plugin
			

					
			
			this.each(function() { 
				var obj = $(this);
				
				columns = o.columns;
				rows = o.rows;
				topics = o.topics;
				questions = o.questionsFile;
				answers = o.answersFile;
				
				width = (columns*screenWidth)+(2*columns); //Account for borders
				height = (rows*screenHeight)+(2*rows); //Account for borders
				borderWidth = width;				
				borderHeight = ((rows)*screenHeight);
				
				if (!isNaN(window.innerHeight)) { //Non-IE
					gamePlacement = (window.innerHeight-height)/2;
				}
				else { //IE 6+
					gamePlacement = (document.documentElement.clientHeight-height)/2;
				}
				
				
				obj.css({"clear" : "both", "margin" : "0 auto", "width" : borderWidth+"px", "zIndex" : "0", "overflow" : "hidden", "background" : "black", "border" : "3px outset #AAA"});			
				
				obj.createQuestions(rows);
				debug(obj);
			});			
				
			return this;
			
			function debug(obj) {
			  if (window.console && window.console.log)
				window.console.log('hilight selection count: ' + obj.size());
			}	
		}
	});
})(jQuery);