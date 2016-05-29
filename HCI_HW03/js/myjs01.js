/**
 * Created by cuvit on 2016-05-10.
 */

//get xml list
var end_point_url =
    "https://www.career.go.kr/cnet/openapi/getOpenApi.xml?apiKey=";

var authentication_key =
    "965557ae6f6cdce16015471a76ae6991";
var xml;

//restore current job_families list
var pgubn_array = [];
job_families_set = new Set();

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

function response_parse(data) {
    xml = data.responseText;

    var $xml = $(xml);

    //reset job_familes set
    job_families_set.clear();

    $xml.find("content").each(function (i, it) {
        var _profession = $(it).find("profession").text();
        if(_profession != null) {
            job_families_set.add(_profession);
        }
    });

    //remove prior profession list
    $("#profession").find('option').remove().end();
    $("#profession").selectmenu('destroy').selectmenu({style:'dropdown'});
    //add profession to profession selectmenu
    job_families_set.forEach(function(item) {
        d3.select("#profession").append("option").text(item);
    });
}

var download = function() {
    var size = $(".accordion :checked").size();
    var html = "number of checked : ";
    html += size;

    var params = "</br>";
    pgubn_array.splice(0, pgubn_array.length);
    $("#accordion_abil :checked").each(function(i, item) {
        var val = $(this).parent().children(".abil").val();
        pgubn_array.push(val)
        params += val + '</br>';
    });
    html += params;

    $("#showResult").html(html);

    pgubn_array.forEach(function(item, i) {
        var queryParams = (authentication_key);
        queryParams += '&' + ('svcType') + '=' + ('api');
        queryParams += '&' + ('svcCode') + '=' + ('JOB');
        queryParams += '&' + ('contentType') + '=' + ('xml');
        queryParams += '&' + ('gubun') + '=' + ('job_apti_list');
        var _pgubn = item;
        if(_pgubn != "전체") {
            queryParams += '&' + ('pgubn') + '=' + pgubnDic[_pgubn];
        }
        queryParams += '&' + ('perPage=') + '454'

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
    });

    alert("success");

    //새로고침 방지
    return false;
}

$(function() {
    $(".accordion").accordion();
    $("#nextBtn_abil").button()
        .click(download);
    $("#nextBtn_job").button();

    $("#selectAll").button();
    $("#selectAllChk").button();

    $(".pageButton").button();
});