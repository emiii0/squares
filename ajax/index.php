<?php

header("Cache-Control: no-cache, must-revalidate");
header("Content-Type:text/html; charset=UTF-8");

/*
$file = (isset($_POST["file"])) ? $_POST["file"] : false;
$number = (isset($_POST["number"])) ? $_POST["number"] : false;
$rewrite = (isset($_POST["rewrite"])) ? $_POST["rewrite"] : false;
*/

$file = (isset($_GET["file"])) ? $_GET["file"] : false;
$number = (isset($_GET["number"])) ? $_GET["number"] : false;
$rewrite = (isset($_GET["rewrite"])) ? $_GET["rewrite"] : false;


$answersText = trim(file_get_contents("answers.txt"));
$questionsText = trim(file_get_contents("questions.txt"));

$extraAnswersText = trim(file_get_contents("extra answers.txt"));
$extraQuestionsText = trim(file_get_contents("extra questions.txt"));

/***If the question was guessed correctly, remove it and add a new one****/

if ($rewrite) {
	
	//Grab the new question/answers/media
	
	$getNextQ = fopen("extra questions.txt",'rb');
	list($junk,$eQ) = preg_split("/[|]/",trim(fgets($getNextQ)));
	fclose($getNextQ);
	
	$getNextA = fopen("extra answers.txt",'rb');
	list($junk,$eA) = preg_split("/[|]/",trim(fgets($getNextA)));
	fclose($getNextA);	

	//Remove the new question/answers/media from extra files
	
	$newExtraQuestions = str_replace("|".$eQ,"",$extraQuestionsText);

	//Replaced this with preg_replace because preg_replace can limit replacements

	$newExtraAnswers = preg_replace('/'.preg_quote("|".$eA, '/').'/',"",$extraAnswersText,1,$x);
	
	echo $eQ."<Br>".$eA."<Br><br><br>".$newExtraQuestions."<br>".$newExtraAnswers;
	
	$rwQ = fopen("questions.txt",'rb');

	while (!feof($rwQ)) {
		list($c,$q) = preg_split("/[|]/",trim(fgets($rwQ)));
		
		if ($c == $number) {
			$qToReplace = $q;
			
			fclose($rwQ);
			$write = str_replace($c."|".$qToReplace,$c."|".$eQ,$questionsText);
		
			file_put_contents("questions.txt",$write);
			
			$tmp = trim($newExtraQuestions)."\r\n|".trim($qToReplace);			
			
			file_put_contents("extra questions.txt",$tmp);
		
			break;
		}		
	}

	$rwA = fopen("answers.txt",'rb');
	
	while (!feof($rwA)) {
		list($c,$a) = preg_split("/[|]/",trim(fgets($rwA)));
		
		if ($c == $number) {
			$aToReplace = $a;
			fclose($rwA);
			$write = str_replace($c."|".$aToReplace,$c."|".$eA,$answersText);

			file_put_contents("answers.txt",$write);
			
			$tmp = trim($newExtraAnswers)."\r\n|".trim($aToReplace);
			
			file_put_contents("extra answers.txt",$tmp);		

			break;
		}
	}
}

/***Pull the selected question****/

else if (is_file($file) && !$rewrite) {
	$fh = fopen($file,'rb');
	$r = 1;
	$y = 1;

	while (!feof($fh)) {
		if ($file === "answers.txt") {
			list($c,$a) = preg_split("/[|]/",fgets($fh));
		
			if ($c==$number) {
				echo $a;
				break;
			}
			else {
				$y++;
			}			
		}
		else if ($file === "questions.txt") {
			list($c,$q) = preg_split("/[|]/",fgets($fh));

			if ($c==$number) {
				echo $q;
				break;
			}
			else {
				$y++;
			}
		}
	}
	fclose($fh);
}
else {
	echo "Error opening file";
}

?>