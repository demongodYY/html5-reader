;
var selObj,
    rangeObj,
    promptPosLeft,
    promptPosTop,
    userNote;


$(document).ready(function(){
    $("p").mouseup(function(e){
        e = e || window.event;
        getMouseCoord(e);

        if (getSelectionObject()) {
            promptObject($(".div_set"));
        }
    });

    $(".set_drawline").click(function(){

      if (!drawLine()) {
        console.log("highlight failed");
      };
      $(".div_set").css("display", "none");
      //document.getSelection().removeAllRanges();  
    });

    $(".set_addnote").click(function(){
        
        $(".div_set").css("display", "none");
        addNotes();
        // prompt note editer
        promptObject($(".div_note"));
    });

    $(".btn_submit").click(function() {
        userNote = $(".area_note").val();
        hideObject($(".div_note"));
        $(".area_note").val("");
    });

    $(".set_translate").click(function(){
      translateWords();
      $(".div_set").css("display", "none");
      document.getSelection().removeAllRanges();
    });

    $(".set_search").click(function(){
      searchWords();
      $(".div_set").css("display", "none");
      //document.getSelection().removeAllRanges();
    });

    $(document).mousedown(function(){
        
        if ($(".div_note").attr("display") !== "none") {

        };
    });


});


function getSelectionObject() {
    if (document.getSelection) {  
        selObj = document.getSelection();
        return !selObj.isCollapsed;
    }

    return false;
}

function drawLine() {
    // do not consider multi-selected areas
    if (selObj.rangeCount < 0) {
        return false;
    }
    
    // selected contexts will be replaced by underlined contexts
    rangeObj = selObj.getRangeAt(0);
    var newNode = document.createElement("span");
    newNode.appendChild(document.createTextNode(selObj.toString()));
    newNode.setAttribute("class", "high_light");

    selObj.deleteFromDocument();
    rangeObj.insertNode(newNode);
    return true;
}

function addNotes() {
    // do not consider multi-selected areas
    if (selObj.rangeCount < 0) {
        return false;
    }

    // selected contexts will be replaced by underlined contexts
    rangeObj = selObj.getRangeAt(0);
    var newNode = document.createElement("u");
    newNode.appendChild(document.createTextNode(selObj.toString()));
    
    selObj.deleteFromDocument();
    rangeObj.insertNode(newNode);
    
    // remove select
    //document.getSelection().removeAllRanges();

    $("u").click(function() {
        console.log(userNote);
    });
}




function jsonDump(key,value) {
    if(typeof(value) == 'function'){
         return Function.prototype.toString.call(value)
    }
    return value;
}

/*
// json cannot cross-origin-requests(CORS), so use jsonp to replace
// https://github.com/isoks/source/blob/master/_posts/Ajax%E8%B7%A8%E5%9F%9F%E8%AF%B7%E6%B1%82%E6%9C%89%E9%81%93%E7%BF%BB%E8%AF%91.md
// https://github.com/cloudcome/nodejs-ydr-translate/blob/master/youdao.md
*/

function translateWords() {
    var youdaoAPI = "http://fanyi.youdao.com/openapi.do?keyfrom=f2ec-org&key=1787962561&type=data&doctype=jsonp&callback=translate&version=1.1&q=",
        reqURL = youdaoAPI + selObj.toString(),
        i, item;

    $.ajax({
        type: "data",
        url: reqURL,
        async: false,
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback: "translate",
        contentType: 'application/x-www-form-urlencoded;charset=utf-8',
        success: function(data) {
            // console.log(JSON.stringify(data, jsonDump, 4));
            if (data.basic) {
                console.log("prononce");
                console.log("us-phonetic: ["+data.basic["us-phonetic"]+"]");
                console.log("uk-phonetic: ["+data.basic["uk-phonetic"]+"]");
                console.log("translation");
                $.each(data.basic.explains, function(i, item){
                        console.log((i+1)+". "+item);
                });
            }
            else {
                console.log("translation");
                $.each(data.translation, function(i, item){
                        console.log((i+1)+". "+item);
                });
            }
        }
    });
}

function searchWords() {
    var reqURL = "https://www.baidu.com/s?wd=" + selObj.toString();
    window.open(reqURL);
}

function getMouseCoord(event) {
    var coordX = event.clientX + document.body.scrollLeft;
    var coordY = event.clientY + document.body.scrollTop;
    promptPosLeft = (document.documentElement.scrollLeft+coordX+10)+"px";
    promptPosTop = (document.documentElement.scrollTop+coordY+10)+"px";
}

function promptObject(promptNode) {

    // promptNode is a jquery object
    promptNode.css({
        "left": promptPosLeft,
        "top": promptPosTop,
        "display": "inline",
    });
}

function hideObject(obj) {
    obj.css("display", "none");
}