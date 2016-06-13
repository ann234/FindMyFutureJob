/**
 * Created by cuvit on 2016-05-10.
 */

function getProfession(data) {
    var $xml = $(data.responseText);
    xml_array.push($xml);

    $xml.find("content").each(function (i, it) {
        var _profession = $(it).find("profession").text();
        if(_profession != null) {
            job_families_set.add(_profession);
        }
    });

    var newDiv = "<div id='selJobFamBox'> <ul class='list_jobFam'>";
    job_families_set.forEach(function(item) {
        newDiv += '<li><input type="checkbox" class="chk_jobFam" value="' + item + '"> ' + item + "</li>";
    });
    newDiv += "</ul><button name='nextBtn_job' class='nextBtn' id='nextBtn_job'>Next</button></div>";

    //refresh accordion
    $("#selJobFamBox").remove();
    $("#jobFamContent fieldset").append(newDiv);
    $("#nextBtn_job").button()
        .click(downloadJob);
}

var downloadJobFam = function() {
    var pgubn_array = [];
    pgubn_array.splice(0, pgubn_array.length);
    $("#accordion_abil :checked").each(function(i, item) {
        var val = $(this).parent().children(".abil").val();
        pgubn_array.push(val)
    });

    //reset job_familes set and remove all accordion_jobFam
    job_families_set.clear();

    //가져온 특성들로 직군들을 가져온다.
    pgubn_array.forEach(function(item) {
        var queryParams = (authentication_key);
        queryParams += '&' + ('svcType') + '=' + ('api');
        queryParams += '&' + ('svcCode') + '=' + ('JOB');
        queryParams += '&' + ('contentType') + '=' + ('xml');
        queryParams += '&' + ('gubun') + '=' + ('job_apti_list');
        if(item != "") {
            queryParams += '&' + ('pgubn') + '=' + item;
        }
        queryParams += '&' + ('perPage=') + '454';

        $.ajax({
            type    :   "GET",
            url     :   end_point_url + queryParams,
            dataType    :   "XML",
            async   : false,
            success :   getProfession,
            error:function(request,status,error){
                _error = error;
                alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            }
        });
    });

    location.href="#jobFamContent";

    //새로고침 방지
    return false;
}

function appendJobLabel() {//delete number of pages
    for(i = 0; i < beforePageNum; i++) {
        $("#page" + i).remove();
    }

    var numOfPages = Math.ceil(curJobInfo.length / jobPerPage);
    beforePageNum = numOfPages;

    for(i = 0; i < numOfPages; i++) {
        var btn = '<button ' + 'class=' + 'ui-button' + "' id=page" + i + ' value=' + i + ' style="width":"120px">' + (i + 1) + ' Page</button>';
        $("#pageBtns").append(btn);
        $("#page" + i).button()
            .click(changePage);
    }

    $(".ul_jobs").remove().end();
    $("#jobs").append(curPageHtml[curPage]);
    $(".jobList").click(showDetails);
}

var getJob = function(data) {
    //get checked job families
    var job_array = [];
    job_array.splice(0, job_array.length);
    $("#selJobFamBox :checked").each(function(i, item) {
        var val = $(this).parent().children(".chk_jobFam").val();
        job_array.push(val);
    });

    var $xml = $(data.responseText);

    //initialize curSalery, curJobInfo and curItems value
    curSalery.under2000 = 0;  curSalery.over2000 = 0;
    curSalery.over3000 = 0;  curSalery.over4000 = 0;
    curJobInfo.splice(0, curJobInfo.length);
    curPageHtml.splice(0, curPageHtml.length);
    curItems = 0; curPage = 0;

    //make curJobInfo
    $xml.find("content").each(function (i, it) {
        var _profession = $(it).find("profession").text();
        //선택한 직군에 속하는 직업인지 검사
        job_array.some(function(item) { //break문을 위해 some으로 작성
           if(_profession == item) {
               var _job = $(it).find("job").text();
               var _equal = $(it).find("equalemployment").text();
               var _salery = $(it).find("salery").text();
               if(_salery == '2000 만원 미만') curSalery.under2000 += 1;
               else if(_salery == '2000 만원 이상') curSalery.over2000 += 1;
               else if(_salery == '3000 만원 이상') curSalery.over3000 += 1;
               else if(_salery == '4000 만원 이상') curSalery.over4000 += 1;
               var _prospect = $(it).find("prospect").text();
               var _summary =  $(it).find("summary").text();
               var _similarJob = $(it).find("similarJob").text();

               curJobInfo[ curItems ] = new jobInfo(_job, _equal, _profession,
                   _salery, _prospect, _summary, _similarJob);
               curItems += 1;
               return true;
           }
            return false;
        });
    });
    var howtoSort = $("#sort").val();
    sortJobNMakeLabel(howtoSort);

    appendJobLabel();
}

var downloadJob = function() {
    var queryParams = (authentication_key);
    queryParams += '&' + ('svcType') + '=' + ('api');
    queryParams += '&' + ('svcCode') + '=' + ('JOB');
    queryParams += '&' + ('contentType') + '=' + ('xml');
    queryParams += '&' + ('gubun') + '=' + ('job_apti_list');
    queryParams += '&' + ('perPage=') + '454';

    $.ajax({
        type    :   "GET",
        url     :   end_point_url + queryParams,
        dataType    :   "XML",
        async   : false,
        success :   getJob,
        error:function(request,status,error){
            _error = error;
            alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });

    location.href="#resultContent";

    //새로고침 방지
    return false;
}

function sortJobNMakeLabel(howtoSort) {
    if(howtoSort == "직업 이름") {
        curJobInfo.sort(function(a, b) {
            return a.job < b.job ? -1 : a.job > b.job ? 1 : 0;
        });
    }
    else if(howtoSort == "연봉") {
        curJobInfo.sort(function(a, b) {
            _a = salery2num[a.salery]; _b = salery2num[b.salery];
            return _a > _b ? -1 : _a < _b ? 1 : 0;
        });
    }
    else if(howtoSort == "전망") {
        curJobInfo.sort(function(a, b) {
            _a = prospEqual2num[a.prospect]; _b = prospEqual2num[b.prospect];
            return _a < _b ? 1 : _a > _b ? -1 : 0;
        });
    }
    else if(howtoSort == "고용평등률") {
        curJobInfo.sort(function(a, b) {
            _a = prospEqual2num[a.equal]; _b = prospEqual2num[b.equal];
            return _a < _b ? 1 : _a > _b ? -1 : 0;
        });
    }

    //devide job by page
    var numOfJob = 0; var page = 0;
    var jobDiv = "<div class='ul_jobs'><ul>";
    curJobInfo.forEach(function(item) {
        jobDiv += "<li class='jobList' value='" + item.job + "'>" + item.job + "</li>";
        numOfJob += 1;
        if( (numOfJob + jobPerPage)%jobPerPage == 0 ) {
            jobDiv += "</ul></div>";
            curPageHtml[page] = jobDiv;
            jobDiv = "<div class='ul_jobs'><ul>";
            page += 1;
        }
    });
    curPageHtml[page] = jobDiv; //insert rest jobs
    jobDiv += "</ul></div>"
}

function showDetails() {
    $("#dialog").remove();
    var selectedJob = $(this).attr("value");
    var dialogDiv = "<div id='dialog' title=" + selectedJob + ">";
    curJobInfo.forEach(function(item) {
        //alert( item.job + " " + $(this).attr("value") );
        if( item.job == selectedJob ) {
            dialogDiv += '<p>직업 설명</br>' + item.summary + '</p>'
            dialogDiv += '<p>전망 : ' + item.prospect +'</p>';
            dialogDiv += '<p>연봉 : ' + item.salery +'</p>';
            dialogDiv += '<p>고용평등률 : ' + item.equal +'</p>';
            dialogDiv += '<p>비슷한 직업 : ' + item.similarJob +'</p>';
            return true;
        }
        return false;
    });
    dialogDiv += "</div>"
    $('body').append(dialogDiv);
    $("#dialog").dialog({
        width: 900,
        height: 600,
        autoOpen: false,
        resizable: false,
        draggable: false,
        position:{my:"center", at:"center", of:$(this).parent()}
    });
    $("#dialog").dialog("open");
}

var changeSort = function() {
    var howtoSort = $("#sort").val();
    sortJobNMakeLabel(howtoSort);
    appendJobLabel();
}

function changePage() {
    curPage = $(this).val();
    appendJobLabel();
}

function changeAbilChk() {
    var val = $(this).val();
    if(this.checked) {
        $(this).parents().children("#abil_" + val).css("background", "#FF9100");
        $(this).parents().children("#abil_" + val).css("color", "yellow");
    }
    else {
        $(this).parents().children("#abil_" + val).css("background", "#f6f6f6");
        $(this).parents().children("#abil_" + val).css("color", "#1c94c4");
    }
}

function reset() {
    location.href="#abilityContent";

    //initialize curSalery, curJobInfo and curItems value
    curSalery.under2000 = 0;  curSalery.over2000 = 0;
    curSalery.over3000 = 0;  curSalery.over4000 = 0;
    curJobInfo.splice(0, curJobInfo.length);
    curPageHtml.splice(0, curPageHtml.length);
    curItems = 0; curPage = 0;

    $("#accordion_jobFam").find('h3').remove().end();
    $("#accordion_jobFam").find('div').remove().end();
    $("#accordion_jobFam").accordion("refresh");

    $("#accordion_job").find('h3').remove().end();
    $("#accordion_job").find('div').remove().end();
    $("#accordion_job").accordion("refresh");
}