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
var xml_array = [];
job_families_set = new Set();

//for job sorting
var salery2num = {
    "2000 만원 미만" : 0,
    "2000 만원 이상" : 1,
    "3000 만원 이상" : 2,
    "4000 만원 이상" : 3
}

var prospEqual2num =  { //전망과 고용평등률의 비교기준이 같으므로 같이 쓴다.
    "null" : 0,
    "보통미만" : 1,
    "보통이상" : 2,
    "좋음" : 3,
    "매우좋음" : 4
}

function jobSalery() {
    var under2000 = 0;
    var over2000 = 0;
    var over3000 = 0;
    var over4000 = 0;
}

function jobInfo(_job, _equal, _profession, _salery, _prospect, _summary, _similarJob) {
    this.job = _job;
    this.equal = _equal;
    this.salery = _salery;
    this.prospect = _prospect;
    this.summary = _summary;
    this.similarJob = _similarJob;
}

var curSalery = new jobSalery();
var curJobInfo = [];
var curPageHtml = [];
var curItems = 0;
var curPage = 0;
var beforePageNum = 0;

function makeJobAccordion() {//delete number of pages
    for(i = 0; i < beforePageNum; i++) {
        $("#page" + i).remove();
    }

    var numOfPages = Math.ceil(curJobInfo.length / 20);
    beforePageNum = numOfPages;

    for(i = 0; i < numOfPages; i++) {
        var btn = '<button ' + 'class=' + 'ui-button' + "' id=page" + i + ' value=' + i + ' style="width":"120px">' + (i + 1) + ' Page</button>';
        $("#pageBtns").append(btn);
        $("#page" + i).button()
            .click(changePage);
    }

    $("#accordion_job").find('h3').remove().end();
    $("#accordion_job").find('div').remove().end();
    $("#accordion_job").accordion("refresh");
    $("#accordion_job").append(curPageHtml[curPage]);
    $("#accordion_job").accordion("refresh");
}

function getProfession(data) {
    var $xml = $(data.responseText);
    xml_array.push($xml);

    $xml.find("content").each(function (i, it) {
        var _profession = $(it).find("profession").text();
        if(_profession != null) {
            job_families_set.add(_profession);
        }
    });

    var newDiv = "";
    job_families_set.forEach(function(item) {
        newDiv += '<h3>' + item + '</h3><div>' + '<input type="checkbox" class="jobFam" value="' + item + '">check</div>';
    });

    //refresh accordion
    $("#accordion_jobFam").find('h3').remove().end();
    $("#accordion_jobFam").find('div').remove().end();
    $("#accordion_jobFam").accordion("refresh");
    $("#accordion_jobFam").append(newDiv);
    $("#accordion_jobFam").accordion("refresh");
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
    $("#accordion_jobFam").find('h3').remove().end();
    $("#accordion_jobFam").find('div').remove().end();

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

    //새로고침 방지
    return false;
}

var getJob = function(data) {
    //get checked job families
    var job_array = [];
    job_array.splice(0, job_array.length);
    $("#accordion_jobFam :checked").each(function(i, item) {
        var val = $(this).parent().children(".jobFam").val();
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
    sortJob(howtoSort);

    //devide job by page
    var numOfJob = 0; var page = 0;
    var jobDiv = "";    //accordion div
    curJobInfo.forEach(function(item) {
        jobDiv += '<h3>' + item.job + '</h3><div>' + '<p>' + item.summary + '</p>';
        jobDiv +=  '<p>' + item.prospect +'</p></div>';
        numOfJob += 1;
        if( (numOfJob + 20)%20 == 0 ) {
            curPageHtml[page] = jobDiv;
            alert(jobDiv);
            jobDiv = "";
            page += 1;
        }
    });
    curPageHtml[page] = jobDiv; //insert last accordion

    makeJobAccordion();

    //for salery graph
    var dataset = [];
    dataset.push(curSalery.under2000); dataset.push(curSalery.over2000);
    dataset.push(curSalery.over3000); dataset.push(curSalery.over4000);
    d3.select("#graphSalery").selectAll("div")
        .data(dataset)
        .enter()
        .append("div")
        .attr("class", "bar")
        .style("height", function(d) {
            return d + "px";
        });
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

    //새로고침 방지
    return false;
}

function sortJob(howtoSort) {
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
            return _a < _b ? -1 : _a > _b ? 1 : 0;
        });
    }
    else if(howtoSort == "고용평등률") {
        curJobInfo.sort(function(a, b) {
            _a = prospEqual2num[a.equal]; _b = prospEqual2num[b.equal];
            return _a < _b ? -1 : _a > _b ? 1 : 0;
        });
    }
}

var changeSort = function() {
    var howtoSort = $("#sort").val();
    sortJob(howtoSort);
    makeJobAccordion();
}

function changePage() {
    curPage = $(this).val();
    makeJobAccordion();
}

$(function() {
    $(".accordion").accordion();
    $("#nextBtn_abil").button()
        .click(downloadJobFam);
    $("#nextBtn_job").button()
        .click(downloadJob);

    $("#selectAll").button();
    $("#selectAllChk").button();

    $("#sort").selectmenu({
        change: changeSort
    });
    $("#jobSortBtn").button();
    $("#salerySortBtn").button();
    $(".pageButton").button();

    jobSalery();
});