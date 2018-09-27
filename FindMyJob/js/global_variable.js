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
    var unknown = 0;
    var under2000 = 0;
    var over2000 = 0;
    var over3000 = 0;
    var over4000 = 0;
}
function jobProsp() {
    var unknown = 0;
    var underUsual = 0;
    var overUsual = 0;
    var good = 0;
    var best = 0;
}
function jobEqual() {
    var unknown = 0;
    var underUsual = 0;
    var overUsual = 0;
    var good = 0;
    var best = 0;
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

/*Spinning progress*/
var spinner = null;
function startSpinner() {
    //var opts = defaults;
    var opts = {
        lines: 12,
        length: 7,
        width: 5,
        radius: 10,
        scale: 1.0,
        corners: 1,
        color: '#000',
        fadeColor: 'transparent',
        opacity: 0.25,
        rotate: 0,
        direction: 1,
        speed: 1,
        trail: 100,
        fps: 20,
        zIndex: 2e9,
        className: 'spinner',
        top: '50%',
        left: '50%',
        shadow: 'none',
        position: 'absolute',
    };

    var target = document.getElementById('pt-main');
    if (spinner == null) {
        //spinner = new Spinner(opts).spin(target);
    }
}

function stopSpinner() {
    if (spinner != null) {
        spinner.stop();
        spinner = null;
    }
}

var curSalery = new jobSalery();
var curProsp = new jobProsp();
var curEqual = new jobEqual();

var curJobInfo = [];
var jobInfoForSearch = [];
var isSearchMode = false;
var curPageHtml = [];
var curItems = 0;
var curPage = 0;
var beforePageNum = 0;

var jobPerPage = 4 * 4;