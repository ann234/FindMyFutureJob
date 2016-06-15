/**
 * Created by cuvit on 2016-06-13.
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
    "알 수 없음" : 0,
    "2000 만원 미만" : 1,
    "2000 만원 이상" : 2,
    "3000 만원 이상" : 3,
    "4000 만원 이상" : 4
}

var prospEqual2num =  { //전망과 고용평등률의 비교기준이 같으므로 같이 쓴다.
    "알 수 없음" : 0,
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
    if(_equal == 'null') this.equal = "알 수 없음";
    else this.equal = _equal;
    if(_salery == 'null') this.salery = "알 수 없음";
    else this.salery = _salery;
    if(_prospect == 'null') this.prospect = "알 수 없음";
    else this.prospect = _prospect;

    var arrStr = _summary.split('-');
    var arrangeSumm = "";
    for(i = 1; i < arrStr.length; i++) {
        arrangeSumm += "<p class='p_remark'>▶ " + arrStr[i] + '</p>';
    }
    this.summary = arrangeSumm;

    if(_similarJob == 'null') this.similarJob = "알 수 없음"
    else this.similarJob = _similarJob;
}

var curSalery = new jobSalery();
var curJobInfo = [];
var curPageHtml = [];
var curItems = 0;
var curPage = 0;
var beforePageNum = 0;

var jobPerPage = 30;