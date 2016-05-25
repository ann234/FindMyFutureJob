/**
 * Created by cuvit on 2016-04-29.
 */

/*function info() {
    var job = "";
    var prospect = "";
    var salery = "";
    var similarJob = "";
    var profession = "";
    var equalemployment = "";
}*/

var end_point_url =
    "https://www.career.go.kr/cnet/openapi/getOpenApi.xml?apiKey=";

var authentication_key =
    "965557ae6f6cdce16015471a76ae6991";

var _error;

var xml, xmlDoc;

job_families_set = new Set();

// select menu's item's dictionary
var pgubnDic = {
    "신체운동능력" : "100019",
    "손재능" : "100020",
    "공간지각능력" : "100021",
    "음악능력" : "100022",
    "창의력" : "100023",
    "언어능력" : "100024"
}

/*var categoryDic = {
    "관리직" : "100041",
    "경영•회계•사무 관련직" : "100042",
    "금융•보험 관련직" : "100043",
    "교육 및 자연과학, 사회과학 연구관련직" : "100044",
    "법률•경찰•소방•교도 관련직" : "100045",
    "보건•의료 관련직" : "100046",
    "사회복지 및 종교 관련직" : "100047",
    "영업 및 판매 관련직" : "100050",
    "경비 및 청소 관련직" : "100051"
}*/

var curPgubn;
var curCategory;

function response_parse(data) {
    xml = data.responseText;

    var box2html = "";

    var $xml = $(xml);

    var totalCount = $xml.find("totalCount").text();
    //$("#box01").text(totalCount);

    //reset job_familes set
    job_families_set.clear();

    $xml.find("content").each(function (i, it) {
        box2html += "직업 : " + $(it).find("job").text() + "</br>";
        var _profession = $(it).find("profession").text();
        if(_profession != null) {
            job_families_set.add(_profession);
            box2html += "직업 분야 : " + _profession + "</br>";
        }
        box2html += "연봉 : " + $(it).find("salery").text() + "</br>";
        var _prospect = $(it).find("prospect").text();
        if (_prospect != "null") {
            box2html += "일자리전망 : " + _prospect + "</br>";
        }
        box2html += "직업 설명 : " + "</br>" + $(it).find("summary").text() + "</br>";
        box2html += "비슷한 직업 : " + $(it).find("similarJob").text() + "</br></br>";
    });

    $("#profession").find('option').remove().end();
    $("#profession").selectmenu('destroy').selectmenu({style:'dropdown'});
    //add profession to profession selectmenu
    job_families_set.forEach(function(item) {
        d3.select("#profession").append("option").text(item);
    });

    $("#box02").html(box2html);
}

var getProfession = function() {
    var $xml = $(xml);

    var box2html = "";

    var getProfession = $("#profession").val();
    $xml.find("content").each(function (i, it) {
        var _profession = $(it).find("profession").text();
        if(_profession == getProfession) {
            box2html += "직업 : " + $(it).find("job").text() + "</br>";
            var _profession = $(it).find("profession").text();
            if(_profession != null) {
                job_families_set.add(_profession);
                box2html += "직업 분야 : " + _profession + "</br>";
            }
            box2html += "연봉 : " + $(it).find("salery").text() + "</br>";
            var _prospect = $(it).find("prospect").text();
            if (_prospect != "null") {
                box2html += "일자리전망 : " + _prospect + "</br>";
            }
            box2html += "직업 설명 : " + "</br>" + $(it).find("summary").text() + "</br>";
            box2html += "비슷한 직업 : " + $(it).find("similarJob").text() + "</br></br>";
        }
    });

    $("#box02").html(box2html);

    return false;
}

var download = function () {
    var queryParams = (authentication_key);
    queryParams += '&' + ('svcType') + '=' + ('api');
    queryParams += '&' + ('svcCode') + '=' + ('JOB');
    queryParams += '&' + ('contentType') + '=' + ('xml');
    queryParams += '&' + ('gubun') + '=' + ('job_apti_list');
    var _pgubn = $("#pgubn").val();
    if(_pgubn != "전체") {
        queryParams += '&' + ('pgubn') + '=' + pgubnDic[_pgubn];
    }
    /*var _category = $("#category").val();
    if(_category != "전체") {
        queryParams += '&' + ('category') + '=' + categoryDic[_category];
    }*/

    window.dd = (end_point_url + queryParams);

    $.ajax({
        type    :   "GET",
        url     :   end_point_url + queryParams,
        dataType    :   "XML",
        cache	 : false,
        async   :   true,
        success :   response_parse,
        error:function(request,status,error){
            _error = error;
            alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });

    return false;
}

$(function () {
    $("#pgubn").selectmenu();
    $("#profession").selectmenu();
    $("#category").selectmenu();
    $("#btnAbil").button()
        .click(download);
    $("#btnJobFam").button()
        .click(getProfession);
});

/*
$(document).ajaxError(function(e, jqxhr, settings, exception) {
    if(jqxhr.reaedyState == 0 || jqxhr.status == 0) {
        return;
    }
})*/
