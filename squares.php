<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="Pragma" content="no-cache" />
<title>Strictly Business - SQUARES</title>
<link type="text/css" rel="stylesheet" href="css/reset.css" />
<link type="text/css" rel="stylesheet" href="css/styles.css" />
<script type="text/javascript" src="js/jquery-1.4.2.min.js"></script>
<script type="text/javascript" src="js/jquery-ui-1.8.1.custom.min.js"></script>
<!--<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/jquery-ui.min.js"></script>-->
<script type="text/javascript" src="js/jquery.hoverIntent.js"></script>
<script type="text/javascript" src="js/jquery.squares.js"></script>
<script type="text/javascript">

theTime = 0;	
	
function isIdle() {
	theTime += 1000;
	
	if (theTime == 120000)
		window.location = "http://localhost/squares/";
}

$(document).ready(function() {					   						   
	
	$(document).bind('click dblclick mousemove keyup', function() {
		theTime=0;
	});
	
	setInterval("isIdle()",1000);
	
	$("#squares").squares({
		columns: 9,
		rows: 5,
		questionsFile: "questions.txt",
		answersFile: "answers.txt"
	});

});
</script>
</head>
<body>
<div id="title">
	<div style="margin:0 auto;position:relative;width:1000px;">
    	<div style="position:absolute;top:0;left:0;">
			<img src="images/title.png" style="float:left;" />
        </div>
		<div style="margin:0 auto;width:265px;">
        	<img src="images/logo.png" />
        </div>
        <div style="position:absolute;top:0;right:0;width:280px;">
            <span style="float:right;padding-top:15px;color:#a8cfeb;font-size:1.5em;">twitter.com/sbmonthly</span>
            <img src="images/twitter.png" style="float:right;padding-top:5px;"  />
        </div>
    </div>
</div>
<div id="squares">
</div>
<div id="footer">
&copy; 2010 Strictly Business<br />
Strictly Business is published by <span style="font-weight:bold;font-size:1em;">The Northeast Group</span>: www.thenortheastgroup.com
</div>
</body>
</html>