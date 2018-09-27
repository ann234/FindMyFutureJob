/**
 * Created by cuvit on 2016-05-10.
 */

function initGlobalVal() {
    curSalery.under2000 = 0;  curSalery.over2000 = 0;
    curSalery.over3000 = 0;  curSalery.over4000 = 0;
    curJobInfo.splice(0, curJobInfo.length);
    jobInfoForSearch.splice(0, jobInfoForSearch.length);
    curPageHtml.splice(0, curPageHtml.length);
    curItems = 0; curPage = 0;
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

    var newDiv = "<div id='selJobFamBox'> <ul class='list_jobFam'>";
    job_families_set.forEach(function(item) {
        newDiv += '<li><input type="checkbox" class="chk_jobFam" value="' + item + '"> ' + item + "</li>";
    });
    newDiv += "</ul></div>";

    //refresh job family checkbox
    $("#selJobFamBox").remove();
    $("#jobFamContent fieldset").append(newDiv);
    stopSpinner();
}

var downloadJobFam = function() {
    var pgubn_array = [];
    pgubn_array.splice(0, pgubn_array.length);

    var checked = false;  //check whether at least one checkbox is checked or not
    $("#accordion_abil :checked").each(function(i, item) {
        var val = $(this).parent().children(".abil").val();
        pgubn_array.push(val);
        checked = true;
    });
    if(!checked) { //if checkbox is not checked, alert to user
        $("#chkAbilWarning").show();
        return false;
    }
    else {
        $("#chkAbilWarning").hide();
        pageTransition.nextPage();
        startSpinner();
    }

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

    //새로고침 방지
    return false;
}

function appendJobLabel(jobInfos) {
    for(i = 0; i < beforePageNum; i++) { //delete number of pages
        $("#page" + i).remove();
    }

    var numOfPages = Math.ceil(jobInfos.length / jobPerPage);
    beforePageNum = numOfPages;

    for(i = 0; i < numOfPages; i++) {
        var btn = '<button ' + 'class=' + 'ui-button' + "' id=page" + i + ' value=' + i + ' style="width: 70px; font-size: 13px">' + (i + 1) + ' Page</button>';
        $("#pageBtns").append(btn);
        $("#page" + i).button()
            .click(changePage);
    }

    $(".ul_jobs").remove().end();
    $("#jobs").append(curPageHtml[curPage]);
    $(".jobList").click(showDetails);
}

var getJob = function(data) { //get checked job families
    var job_array = [];
    job_array.splice(0, job_array.length);
    $("#selJobFamBox :checked").each(function(i, item) {
        var val = $(this).parent().children(".chk_jobFam").val();
        job_array.push(val);
    });

    var $xml = $(data.responseText);

    //initialize curSalery, curJobInfo and curItems value
    initGlobalVal();

    //make curJobInfo
    $xml.find("content").each(function (i, it) {
        var _profession = $(it).find("profession").text();
        //선택한 직군에 속하는 직업인지 검사
        job_array.some(function(item) { //break문을 위해 some으로 작성
           if(_profession == item) {
               var _job = $(it).find("job").text();

               var _equal = $(it).find("equalemployment").text();
               if(_equal == 'null') curEqual.unknown += 1;
               else if(_equal == '보통 미만') curEqual.underUsual += 1;
               else if(_equal == '보통 이상') curEqual.overUsual += 1;
               else if(_equal == '좋음') curEqual.good += 1;
               else if(_equal == '매우 좋음') curEqual.best += 1;

               var _salery = $(it).find("salery").text();
               if(_salery == 'null') curSalery.unknown += 1;
               else if(_salery == '2000 만원 미만') curSalery.under2000 += 1;
               else if(_salery == '2000 만원 이상') curSalery.over2000 += 1;
               else if(_salery == '3000 만원 이상') curSalery.over3000 += 1;
               else if(_salery == '4000 만원 이상') curSalery.over4000 += 1;

               var _prospect = $(it).find("prospect").text();
               if(_prospect == 'null') curProsp.unknown += 1;
               else if(_prospect == '보통 미만') curProsp.underUsual += 1;
               else if(_prospect == '보통 이상') curProsp.overUsual += 1;
               else if(_prospect == '좋음') curProsp.good += 1;
               else if(_prospect == '매우 좋음') curProsp.best += 1;

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
    sortJobNMakeLabel(howtoSort, curJobInfo);

    appendJobLabel(curJobInfo);
    pageTransition.nextPage();
    stopSpinner();
}

var downloadJob = function() {
    var checked = false;
    $("#selJobFamBox :checked").each(function(i, item) {
        checked = true;
    });
    if(!checked) {
        $("#chkJobFamWarning").show();
        return false;
    }

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

    if(checked) {
        $("#chkJobFamWarning").hide();
        startSpinner();
    }

    //새로고침 방지
    return false;
}

function getColorBySortNRating(howtoSort, job) {
    if(howtoSort == "직업 이름") {
        return "#848484";
    }
    else if(howtoSort == "연봉") {
        if(salery2num[job.salery] == 0) return "#848484";
        else if(salery2num[job.salery] == 1) return "#000069";
        else if(salery2num[job.salery] == 2) return "#0000CD";
        else if(salery2num[job.salery] == 3) return "#0A82FF";
        else if(salery2num[job.salery] == 4) return "#2ECCFA";
    }
    else if(howtoSort == "전망") {
        if (prospEqual2num[job.prospect] == 0) return "#848484";
        else if(prospEqual2num[job.prospect] == 1) return "#000069";
        else if(prospEqual2num[job.prospect] == 2) return "#0000CD";
        else if(prospEqual2num[job.prospect] == 3) return "#0A82FF";
        else if(prospEqual2num[job.prospect] == 4) return "#2ECCFA";
    }
    else if( howtoSort == "고용평등률") {
        if (prospEqual2num[job.equal] == 0) return "#848484";
        else if(prospEqual2num[job.equal] == 1) return "#000069";
        else if(prospEqual2num[job.equal] == 2) return "#0000CD";
        else if(prospEqual2num[job.equal] == 3) return "#0A82FF";
        else if(prospEqual2num[job.equal] == 4) return "#2ECCFA";
    }
}

function sortJobNMakeLabel(howtoSort, jobInfos) {
    if(howtoSort == "직업 이름") {
        jobInfos.sort(function(a, b) {
            return a.job < b.job ? -1 : a.job > b.job ? 1 : 0;
        });
    }
    else if(howtoSort == "연봉") {
        jobInfos.sort(function(a, b) {
            _a = salery2num[a.salery]; _b = salery2num[b.salery];
            return _a > _b ? -1 : _a < _b ? 1 : 0;
        });
    }
    else if(howtoSort == "전망") {
        jobInfos.sort(function(a, b) {
            _a = prospEqual2num[a.prospect]; _b = prospEqual2num[b.prospect];
            return _a < _b ? 1 : _a > _b ? -1 : 0;
        });
    }
    else if(howtoSort == "고용평등률") {
        jobInfos.sort(function(a, b) {
            _a = prospEqual2num[a.equal]; _b = prospEqual2num[b.equal];
            return _a < _b ? 1 : _a > _b ? -1 : 0;
        });
    }

    //devide job by page
    var numOfJob = 0; var page = 0;
    var jobDiv = "<div class='ul_jobs'><ul>";
    jobInfos.forEach(function(item) {
        var color = getColorBySortNRating(howtoSort, item);
        jobDiv += "<li class='jobList' value='" + item.job + "' style='background: " + color + "'>" + item.job + "</li>";
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
    var jobInfos;
    if(isSearchMode) jobInfos = jobInfoForSearch;
    else jobInfos = curJobInfo;
    jobInfos.forEach(function(item) {
        if( item.job == selectedJob ) {
            //d3 graph
            //var margin = {top: 80, right: 80, bottom: 80, left: 80},
            //    width = 600 - margin.left - margin.right,
            //    height = 400 - margin.top - margin.bottom;
            //var x = d3.scale.ordinal()
            //    .rangeRoundBands([0, width], .1);
            //var y0 = d3.scale.linear().domain([300, 1100]).range([height, 0]),
            //    y1 = d3.scale.linear().domain([20, 80]).range([height, 0]);
            //var xAxis = d3.svg.axis()
            //    .scale(x)
            //    .orient("bottom");
            //// create left yAxis
            //var yAxisLeft = d3.svg.axis().scale(y0).ticks(4).orient("left");
            //// create right yAxis
            //var yAxisRight = d3.svg.axis().scale(y1).ticks(6).orient("right");
            //var svg = d3.select("#dialog").append("svg")
            //    .attr("width", width + margin.left + margin.right)
            //    .attr("height", height + margin.top + margin.bottom)
            //    .append("g")
            //    .attr("class", "graph")
            //    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            //
            //var arrTmp = [curSalery.under2000, curSalery.over2000, curSalery.over3000, curSalery.over4000];
            //x.domain([0, 4]);
            //y0.domain([0, Math.max.apply(null, arrTmp)]);
            //
            //svg.append("g")
            //    .attr("class", "x axis")
            //    .attr("transform", "translate(0," + height + ")")
            //    .call(xAxis);
            //svg.append("g")
            //    .attr("class", "y axis axisLeft")
            //    .attr("transform", "translate(0,0)")
            //    .call(yAxisLeft)
            //    .append("text")
            //    .attr("y", 6)
            //    .attr("dy", "-2em")
            //    .style("text-anchor", "end")
            //    .style("text-anchor", "end")
            //    .text("Dollars");
            //
            //svg.append("g")
            //    .attr("class", "y axis axisRight")
            //    .attr("transform", "translate(" + (width) + ",0)")
            //    .call(yAxisRight)
            //    .append("text")
            //    .attr("y", 6)
            //    .attr("dy", "-2em")
            //    .attr("dx", "2em")
            //    .style("text-anchor", "end")
            //    .text("#");
            //bars = svg.selectAll(".bar").data(data).enter();
            //bars.append("rect")
            //    .attr("class", "bar1")
            //    .attr("x", function(d) { return x(d.year); })
            //    .attr("width", x.rangeBand()/2)
            //    .attr("y", function(d) { return y0(d.money); })
            //    .attr("height", function(d,i,j) { return height - y0(d.money); });
            //bars.append("rect")
            //    .attr("class", "bar2")
            //    .attr("x", function(d) { return x(d.year) + x.rangeBand()/2; })
            //    .attr("width", x.rangeBand() / 2)
            //    .attr("y", function(d) { return y1(d.number); })
            //    .attr("height", function(d,i,j) { return height - y1(d.number); });
            //

            dialogDiv += '<p class="p_remark"><big>직업 설명</big></p>' + item.summary;
            dialogDiv += '<p class="p_remark"><big>전망 : ' + item.prospect +'</big></p>';
            dialogDiv += '<p class="p_remark"><big>연봉 : ' + item.salery +'</big></p>';
            dialogDiv += '<p class="p_remark"><big>고용평등률 : ' + item.equal +'</big></p>';
            dialogDiv += '<p class="p_remark"><big>비슷한 직업 : </big>' + item.similarJob +'</p>';
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
    if(isSearchMode) {
        sortJobNMakeLabel(howtoSort, jobInfoForSearch);
        appendJobLabel(jobInfoForSearch);
    }
    else {
        sortJobNMakeLabel(howtoSort, curJobInfo);
        appendJobLabel(curJobInfo);
    }
}

function changePage() {
    curPage = $(this).val();
    if(isSearchMode) appendJobLabel(jobInfoForSearch);
    else appendJobLabel(curJobInfo);
}

function changeAbilChk() {
    var val = $(this).val();
    if(this.checked) {
        $(this).parents().children("#abil_" + val).css("background", "#F4FA58");
    }
    else {
        $(this).parents().children("#abil_" + val).css("background", "#f6f6f6");
    }
}

function reset() {
    //initialize curSalery, curJobInfo and curItems value
    initGlobalVal();

    //refresh ability accordion
    $(".abilTab").css("background", "#f6f6f6");
    $("#accordion_abil :checked").each(function(i, item) {
        this.checked = false;
    });

    $("#selJobFamBox").remove(); //refresh job family checkbox
    $(".ul_jobs").remove().end(); //refresh job

    pageTransition.nextPage();
}

function search() {
    var txt = $("#search").val();
    if(txt == "" | txt.length == 1) {
        alert("최소 두 자 이상 입력해주십시오.");
        return false;
    }

    jobInfoForSearch.splice(0, jobInfoForSearch.length);
    curJobInfo.forEach(function(item) {
        var ret1 = item.job.indexOf(txt);
        var ret2 = item.summary.indexOf(txt);
        if(ret1 > -1 | ret2 > -1) {
            var _jobInfo = new jobInfo(item.job, item.equal, item.profession,
                item.salery, item.prospect, "", item.similarJob);
            _jobInfo.summary = item.summary;
            jobInfoForSearch.push(_jobInfo);
        }
    });

    isSearchMode = true;

    $("#dialog").remove();
    $("#searchBtn span").text('검색 끄기');
    $("#searchBtn").off('click')
        .click(closeSearch);

    var howtoSort = $("#sort").val();
    curPage = 0;
    sortJobNMakeLabel(howtoSort, jobInfoForSearch);
    appendJobLabel(jobInfoForSearch);
    changePage();
}
function closeSearch() {
    isSearchMode = false;
    $("#searchBtn span").text('검색');
    $("#searchBtn").off('click')
        .click(openSearch);

    var howtoSort = $("#sort").val();
    sortJobNMakeLabel(howtoSort, curJobInfo);
    appendJobLabel(curJobInfo);
}

function openSearch() {
    $("#dialog").remove();
    var dialogDiv = "<div id='dialog' title='검색하기'>";
    dialogDiv += "<p class='p_remark'>검색 : <input type='text' id='search'>";
    dialogDiv += "<button id='inputBtn'>찾기</button>";

    dialogDiv += "</p></div>";
    $('body').append(dialogDiv);
    $("#dialog").dialog({
        width: 500,
        height: 300,
        autoOpen: false,
        resizable: false,
        draggable: false,
        position:{my:"center", at:"center", of:$(this).parent()}
    });
    $("#dialog").dialog("open");
    $("#inputBtn").button()
        .off('click')
        .click(search);
}