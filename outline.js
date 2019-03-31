$(document).ready(function(){

//read file
var file, settingfile, settinglines, reader, lines; //declare global variables
var textColor;
var highlightBGColor;
var highlightTxtColor;
var bgColor; //global variables for colors
document.getElementById('myFile').onchange = function(){

  file = this.files[0];

  reader = new FileReader();
  reader.onload = function(progressEvent){
    // By lines
    lines = this.result.split('\n');
    for (i = 0; i < lines.length; i++) {
        console.log(lines[i] + '111');
    }
    addleft(lines);
    $(".sublist").hide();
    $(".detaillist").hide();
    highlightswitch();
    play();
  };
  reader.readAsText(file);
};

document.getElementById('settingFile').onchange = function() {
    settingfile = this.files[0];
    reader = new FileReader();
    reader.onload = function(progressEvent) {
        //By lines
        settinglines = this.result.split('\n');
        changeFonts(settinglines);
        changeColors(settinglines);
        changePanelProportion(settinglines, "1");
    };
    reader.readAsText(settingfile);
};

//This is the version of the 3-layer document read input
//first add all the content to the left panel, and collapse them later on
function addleft(lines){
    //alert(lines.length);
        var count = 0;

        //1st layer: while loop
        var isFirstTopic = true;
        while (count < lines.length && lines[count].includes("/t")) {
            //add anything after /t as a new topic
            var idx = lines[count].indexOf("/e");
            var newTopic = lines[count].substr(2,idx-2)+"\n";
            $("<li class = 'maintopics' id = 'newTopic' data-layer = '1'></li>").appendTo(".mainlist");
            $("#newTopic").append(newTopic);
            $("#newTopic").append("<span>&nbsp</span>");
            $("#newTopic").append("<ul class = 'sublist' id = 'newSubList'></ul>");
            count++;

            //2nd layer: while loop
            var isFirstPoint = true;
            var hasPoint = false;
            while (count < lines.length && lines[count].includes("/p")) {
                hasPoint = true;
                var pointIdx = lines[count].indexOf("/e");
                var newPoint = lines[count].substr(2, pointIdx-2)+"\n";            
                $("#newSubList").append("<li class = 'subpoints' id = 'newPoint' data-layer = '2'></li>");
                $("#newPoint").append(newPoint);
                $("#newPoint").append("<span>&nbsp</span>");
                $("#newPoint").append("<ul class = 'detaillist' id = 'newDetailList'></ul>");
                count++;

                //3rd layer: while loop
                var isFirstDetail = true;
                var hasDetail = false;
                while (count < lines.length && lines[count].includes("/d")) {
                    hasDetail = true;
                    var detailIdx = lines[count].indexOf("/e");
                    var newDetail = lines[count].substr(2, detailIdx-2) + "\n";
                    $("#newDetailList").append("<li class = 'details' id = 'newDetail' data-layer = '3'></li>");
                    $("#newDetail").append(newDetail);
                    count++;

                    //3rd layer: checking first and last detail
                    if (isFirstDetail) {
                        $("#newDetail").attr("class", "details firstDetail");
                        isFirstDetail = false;
                    }
                    //else {
                        var isLastDetail = true;
                        if (count < lines.length && lines[count].includes("/d")) {
                            isLastDetail = false;
                        }
                        if (isLastDetail) {
                            $("#newDetail").addClass("lastDetail");
                        }
                    //}
                    $("#newDetail").removeAttr("id");
                }
                $("#newDetailList").removeAttr("id");
                $("#newPoint").attr("data-hasDetail", hasDetail);

                //2nd layer: checking first and last point
                if (isFirstPoint) {
                    $("#newPoint").attr("class", "subpoints firstPoint");
                    isFirstPoint = false;
                }
                //else {
                    var isLastPoint = true;
                    for (j = count; j < lines.length; j++) {
                        if (lines[j].includes("/p")) {
                            isLastPoint = false;
                            break;
                        }
                        if (lines[j].includes("/t")) {
                            break;
                        }
                    }
                    if (isLastPoint) {
                        $("#newPoint").addClass("lastPoint");
                    }
                //}
                $("#newPoint").removeAttr("id");
                //separate();
            }
            $("#newTopic").attr("data-hasPoint", hasPoint);

            //1st layer: checking first and last topic
            if (isFirstTopic) {
                $("#newTopic").attr("class", "maintopics firstTopic");
                isFirstTopic = false;
            }
            //else {
                var isLastTopic = true;
                for (i = count; i < lines.length; i++) {
                    if (lines[i].includes("/t")) {
                        isLastTopic = false;
                        break;
                    }
                }
                if (isLastTopic) {
                    $("#newTopic").addClass("lastTopic");
                    $("#newTopic").removeAttr("id");
                    $("#newSubList").removeAttr("id");
                }
                else {
                    $("#newTopic").removeAttr("id");
                    $("#newSubList").removeAttr("id");
                }
            //}
        }
    }

//obselete expand method
//expand the points of the highlighted topic
function expand() {
    var layerNum = $(".currentHighlight").attr("data-layer");

    //expand the points of the highlighted topic
    if (layerNum == "1") {
        var curtopic = $(".currentHighlight");
        var cursub = curtopic.find(".sublist");
                
        if(!($(".midexpand").is(":empty"))) {
            $(".midexpand").empty();
        }
        cursub.show();
        cursub.clone(true, true).appendTo(".midexpand");
        cursub.hide();
    }
    //expand the details of the highlighted points
    else if (layNum == "2") {
        var cursub = $(".currentHighlight");
        var curdetail =  cursub.find(".detaillist");
        if(!($(".rightexpand").is(":empty"))) {
            $(".rightexpand").empty();
        }
        curdetail.show();
        curdetail.clone(true, true).appendTo(".rightexpand");
        curdetail.hide();
    }
}

//this is the version of the three-layer highlight switch
//key press function for up, down, left, right, to swicth between topics and points 
//with the switch of highlight associated with that
function highlightswitch() {
    $(".firstTopic").css("background-color", highlightBGColor);
    $(".firstTopic").css("color", highlightTxtColor);
    $(".firstTopic").addClass("currentHighlight");
    //expand();

	$(document).keydown(function(keyPressed) {
    	//press up
    	if (keyPressed.keyCode == 38) {
            var classname = $(".currentHighlight").attr("class");
               
            //for topics
            if(classname.includes("maintopics") && !classname.includes("firstTopic")) {
                $(".currentHighlight").css("background-color", bgColor);
                $(".currentHighlight").css("color", textColor);
            	var nxtItem = $(".currentHighlight").prev();
                nxtItem.css("background-color", highlightBGColor);
                nxtItem.css("color", highlightTxtColor);
                $(".currentHighlight").removeClass("currentHighlight");
                nxtItem.addClass("currentHighlight");
                //expand();
            } 
            //for points 
            else if (classname.includes("subpoints") && !classname.includes("firstPoint")) {
            	$(".midexpand").empty();
                var curtopic = $(".lastTopicGet");
                var cursub = curtopic.find(".sublist").first();
            	cursub.show();
                $(".currentHighlight").css("background-color", bgColor);
                $(".currentHighlight").css("color", textColor);
            	var nxtItem = $(".currentHighlight").prev();
                nxtItem.css("background-color", highlightBGColor);
                nxtItem.css("color", highlightTxtColor);
                $(".currentHighlight").removeClass("currentHighlight");
                nxtItem.addClass("currentHighlight");
                cursub.clone(true, true).appendTo(".midexpand");
                cursub.hide(); 	
                //expand();
            }
            //for details
            else if (classname.includes("details") && !classname.includes("firstDetail")) {
                $(".rightexpand").empty();
                var curpoint = $(".lastPointGet");
                var curdetaillist = curpoint.find(".detaillist").first();
                curdetaillist.show();
                $(".currentHighlight").css("background-color", bgColor);
                $(".currentHighlight").css("color", textColor);
                var nxtItem = $(".currentHighlight").prev();
                nxtItem.css("background-color", highlightBGColor);
                nxtItem.css("color", highlightTxtColor);
                $(".currentHighlight").removeClass("currentHighlight");
                nxtItem.addClass("currentHighlight");
                curdetaillist.clone(true, true).appendTo(".rightexpand");
    			curdetaillist.hide(); 	
            }
    	}
        
        //press down
        else if (keyPressed.keyCode == 40) {
            var classname = $(".currentHighlight").attr("class");
            
            //for topics
            if(classname.includes("maintopics") && !classname.includes("lastTopic")) {
                $(".currentHighlight").css("background-color", bgColor);
                $(".currentHighlight").css("color", textColor);
            	var nxtItem = $(".currentHighlight").next();
                nxtItem.css("background-color", highlightBGColor);
                nxtItem.css("color", highlightTxtColor);
                $(".currentHighlight").removeClass("currentHighlight");
                nxtItem.addClass("currentHighlight");
                //expand();
            }
            //for points
            else if (classname.includes("subpoints") && !classname.includes("lastPoint")) {
            	$(".midexpand").empty();
                var curtopic = $(".lastTopicGet");
                var cursub = curtopic.find(".sublist").first();
            	cursub.show();
                $(".currentHighlight").css("background-color", bgColor);
                $(".currentHighlight").css("color", textColor);
            	var nxtItem = $(".currentHighlight").next();
                nxtItem.css("background-color", highlightBGColor);
                nxtItem.css("color", highlightTxtColor);
                $(".currentHighlight").removeClass("currentHighlight");
                nxtItem.addClass("currentHighlight");
                cursub.clone(true, true).appendTo(".midexpand");
                cursub.hide(); 	
                //expand();
            }
            //for details
            else if (classname.includes("details") && !classname.includes("lastDetail")) {
                $(".rightexpand").empty();
                var curpoint = $(".lastPointGet");
                var curdetaillist = curpoint.find(".detaillist").first();
                curdetaillist.show();
                $(".currentHighlight").css("background-color", bgColor);
                $(".currentHighlight").css("color", textColor);
                var nxtItem = $(".currentHighlight").next();
                nxtItem.css("background-color", highlightBGColor);
                nxtItem.css("color", highlightTxtColor);
                $(".currentHighlight").removeClass("currentHighlight");
                nxtItem.addClass("currentHighlight");
                curdetaillist.clone(true, true).appendTo(".rightexpand");
    			curdetaillist.hide(); 	
            }

        }
        
        //press left
        else if (keyPressed.keyCode == 37) {
            var layerNum = $(".currentHighlight").attr("data-layer");
            
            //if this is the case to move from the 2nd-layer to the 1st-layer
        	if (layerNum == "2") {
                $(".leftPanel").show();
                $(".midPanel").show();
                $(".rightPanel").show();
                $(".lastTopicGet").css("background-color", highlightBGColor);
                $(".lastTopicGet").css("color", highlightTxtColor);
                $(".currentHighlight").css("background-color", bgColor);
                $(".currentHighlight").css("color", textColor);
                $(".currentHighlight").removeClass("currentHighlight");
                $(".lastTopicGet").addClass("currentHighlight");
                $(".lastTopicGet").removeClass("lastTopicGet");
                $(".midexpand").empty();
                $(".leftPanel").show();
                $(".midPanel").show();
                $(".rightPanel").hide();
                changePanelProportion(settinglines, "1");
            }

            //if this is the case to move from the 3rd-layer to the 2nd-layer
            else if (layerNum == "3") {
                $(".leftPanel").show();
                $(".midPanel").show();
                $(".rightPanel").show();
                $(".lastPointGet").css("background-color", highlightBGColor);
                $(".lastPointGet").css("color", highlightTxtColor);
                $(".currentHighlight").css("background-color", bgColor);
                $(".currentHighlight").css("color", textColor);
                $(".currentHighlight").removeClass("currentHighlight");
                $(".lastPointGet").addClass("currentHighlight");
                $(".lastPointGet").removeClass("lastPointGet");
                $(".rightexpand").empty();
                $(".leftPanel").show();
                $(".midPanel").show();
                $(".rightPanel").hide();
                changePanelProportion(settinglines, "1")
            }
        }
        
        //press right
        else if (keyPressed.keyCode == 39) {
            var layerNum = $(".currentHighlight").attr("data-layer");

            //if this is the case to move from the 1st-layer to the 2nd-layer
            if ((layerNum == "1") && ($(".currentHighlight").attr("data-hasPoint") == "true")) {
                $(".leftPanel").show();
                $(".midPanel").show();
                $(".rightPanel").show();
            	$(".midexpand").empty();
            	var cursub = $(".currentHighlight").find(".sublist").first();
                cursub.show();
                var curpoint = cursub.find("li");
                curpoint.first().css("background-color", highlightBGColor);
                curpoint.first().css("color", highlightTxtColor);
                $(".currentHighlight").css("background-color", bgColor);
                $(".currentHighlight").css("color", textColor);
                //$(".currentHighlight").attr("id","lastTopic");
                $(".currentHighlight").addClass("lastTopicGet");

                $(".currentHighlight").removeClass("currentHighlight");
                curpoint.first().addClass("currentHighlight");
				cursub.clone(true, true).appendTo(".midexpand");
                cursub.hide();
                $(".leftPanel").show();
                $(".midPanel").show();
                $(".rightPanel").hide();
                changePanelProportion(settinglines, "1")
            }

            //if this is the case to move from the 2nd-layer to the 3rd-layer
            else if ((layerNum == "2") && ($(".currentHighlight").attr("data-hasDetail") == "true")) {
                $(".leftPanel").show();
                $(".midPanel").show();
                $(".rightPanel").show();
                $(".rightexpand").empty();
                var curdetaillist = $(".currentHighlight").find(".detaillist").first();
                curdetaillist.show();
                var curdetail = curdetaillist.find("li");
                curdetail.first().css("background-color", highlightBGColor);
                curdetail.first().css("color", highlightTxtColor);
                $(".currentHighlight").css("background-color", bgColor);
                $(".currentHighlight").css("color", textColor);

                $(".currentHighlight").addClass("lastPointGet");

                //$(".currentHighlight").attr("id","lastPointGet");
                $(".currentHighlight").removeClass("currentHighlight");
                curdetail.first().addClass("currentHighlight");
				curdetaillist.clone(true, true).appendTo(".rightexpand");
                curdetaillist.hide();
                $(".leftPanel").hide();
                $(".midPanel").show();
                $(".rightPanel").show();
                changePanelProportion(settinglines, "2")
            }
        }
    });
    
}

//text-to-speech when pressing the shift key
function play() {
	$(document).keydown(function(keyPressed) {
    	if (keyPressed.keyCode == 16) {
        	//alert("here");
            //alert($("#currentHighlight").text());
            
            var toReadlines = $(".currentHighlight").text().split('\n');
        	var msg = new SpeechSynthesisUtterance(toReadlines[0]);
			window.speechSynthesis.speak(msg);
        }
    });
}

//adjust by user customized font sizes
function changeFonts(settinglines){
    var fontInfo = settinglines[0];
    var idx;
    if (!(fontInfo == "")){
    	//extract the first number as font size for topics
    	if(fontInfo.substr(0,1) === "#") {
        	fontInfo = fontInfo.substr(1);
            idx = fontInfo.indexOf("#");
            var topicFont = fontInfo.substr(0,idx);
            $(".mainlist").css("font-size", topicFont);
            fontInfo = fontInfo.substr(idx);
            //extract the second number as font size for points
            if(fontInfo.substr(0,1) === "#") {
                fontInfo = fontInfo.substr(1);
                idx = fontInfo.indexOf("#");
                var pointFont = fontInfo.substr(0,idx);
                $(".sublist").css("font-size", pointFont);
                fontInfo = fontInfo.substr(idx);
                //extract the third number as font size for details
                if(fontInfo.substr(0,1) === "#"){
                    fontInfo = fontInfo.substr(1);
                    var detailFont = fontInfo;
                    $(".detaillist").css("font-size", detailFont);
                }

            }
        }  
    }
    else{
    	//There's no information about font sizes, so use the defualt ones
        $(".mainlist").css("font-size", "20px");
        $(".sublist").css("font-size", "15px");
        $(".detaillist").css("font-size", "10px");
    }

}

//adjust user customized colors including text color, highlight background color, 
//highlight text color, and general background color
function changeColors(settinglines){
    var colorInfo = settinglines[1];
    var hash = "#";
    if (!(colorInfo == "")){
        //extract the first number as text color rgb value
        colorInfo = colorInfo.substr(1);
        var idx = colorInfo.indexOf("#");
        textColor = hash.concat(colorInfo.substr(0,idx));
        colorInfo = colorInfo.substr(idx);
        //extract the second number as the highlight background color
        if (colorInfo.substr(0,1) === "#") {
            colorInfo = colorInfo.substr(1);
            idx = colorInfo.indexOf("#");
            highlightBGColor = hash.concat(colorInfo.substr(0,idx));
            colorInfo = colorInfo.substr(idx);
            if (colorInfo.substr(0,1) === "#") {
                colorInfo = colorInfo.substr(1);
                idx = colorInfo.indexOf("#");
                highlightTxtColor = hash.concat(colorInfo.substr(0,idx));
                colorInfo = colorInfo.substr(idx);
                if (colorInfo.substr(0,1) === "#") {
                    colorInfo = hash.concat(colorInfo.substr(1));
                    bgColor = colorInfo;
                }
            }
        }
        //test whether we have the four information for colors
        if (textColor == null || highlightBGColor == null || highlightTxtColor == null || bgColor == null) {
            alert("color customized info lacked, we assign the default colors");
            textColor = "#000000";
            highlightBGColor = "#ffffe0";
            highlightTxtColor = "#000000";
            bgColor = "#ffffff";
        }
        //after we get the four valid values of the colors, assign them
        //$("#content").css("color", textColor);
        //$("#content").css("background-color", bgColor);
        $("body").css("color", textColor);
        $("body").css("background-color", bgColor);
    }
    $(".firstTopic").css("background-color", highlightBGColor);
    $(".firstTopic").css("color", highlightTxtColor);
    $(".firstTopic").addClass("currentHighlight");
}

//adjust user customized left and right panel proportion
function changePanelProportion(settinglines, layerNum) {
    var proportionInfo = settinglines[2];
    var leftProportion, rightProportion;
    if (!(proportionInfo == "")) {
        leftProportion = parseInt(proportionInfo.substr(1)).toFixed(0) + "%";
        rightProportion = (100 - parseInt(proportionInfo.substr(1)).toFixed(0)) + "%";
    }
    else {
        alert("panel proportion info lacked, we assign the default proportion");
        leftProportion = "30%";
        rightProportion = "70%";
    }

    if(layerNum == "1") {
        $(".leftPanel").css("width", leftProportion);
        $(".midPanel").css("width", rightProportion);
    }
    else if (layerNum == "2") {
        $(".midPanel").css("width", leftProportion);
        $(".rightPanel").css("width", rightProportion);
    }

}

})