/**
 * Created by cuvit on 2016-06-13.
 */

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
    $("#resetBtn").button()
        .click(reset);

    $(".prevBtn").button()
        .click(function() {
            pageTransition.prevPage();
        });

    $(".abil").change(changeAbilChk);

    //hide error message
    $(".chkWarning").hide();

    jobSalery();
    pageTransition = new PageTransitions();
    pageTransition.init();
});