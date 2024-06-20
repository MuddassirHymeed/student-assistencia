// for search Engine
let Search = []
let URL = "www.example.com"
Search.getProgramFigures = function() {
    var text = $('#searchText').val() ? $('#searchText').val() : 'null';
    var category = $('#category').find(":selected").val();
    // var city = $('#city').find(":selected").val();
    var university = $('#university').find(":selected").val();

    $.ajax({
        type: "GET",
        url: 'https://stud-assistence.herokuapp.com/getProgramFigures/'+text+'/'+category+'/'+university,
        success: function(response) {
            $('.total-program').text(response.totalProgram)
        }
    })
    $.ajax({
        type: "GET",
        url: 'https://stud-assistence.herokuapp.com/getDegreeCategory/'+text,
        success: function(response) {
            response.programs.forEach( data => {
                var degreeId = data.degree._id;
               var degree = data.degree.name;
                $('#category').html("<option value='"+degreeId+"' selected>"+ degree +"</option>");
            })
        }
    })
}
Search.searchProgram = function() {
    var text = $('#searchText').val() ? $('#searchText').val() : 'null';
    var category = $('#category').find(":selected").val();
    var city = $('#city').find(":selected").val();
    var university = $('#university').find(":selected").val();
    $('article').remove();
    $.ajax({
        type: "GET",
        url: 'https://stud-assistence.herokuapp.com/searchProgram/'+text+'/'+category+'/'+city+'/'+university,
        success: function(response) {
           response.programs.forEach(data => {
               var id = data._id;
               $('.total-program').text(response.totalProgram)
               var universityName = (data.universityId == null) ?  "No University Found" : data.universityId.universityName;
               var imageName = (data.thumbnail == null) ? "/home/images/blog/post-1.jpg" : "/uploads/images/programs/"+data.thumbnail
               var html = '<article class="col-lg-6 ">' +
                   '<div class="card rounded-0 border-bottom border-primary border-top-0 border-left-0 border-right-0 hover-shadow">' +
                   '<img class="card-img-top rounded-0" src="'+ imageName +'" alt="No Image Available">' +
                           '<div class="card-body">' +
                               '<ul class="list-inline mb-3">' +
                                   '<li class="list-inline-item mr-3 ml-0"><h4>Deadline</h4></li>' +

                                   '<li class="list-inline-item mr-3 ml-0">' + data.applicationDeadline + '</li>' +
                               '</ul>' +
                               '<a href="/program/' + id + '">' +
                                   '<h4 class="card-title">' + data.programName + '</h4>' +
                               '</a>' +
                               '<p class="card-text">' + universityName  + '</p>' +
                               '<a href="/program/' + id + '" class="btn btn-primary btn-sm">Read More</a>' +
                           '</div>' +
                   '</div>' +
               '</article>';
               $('#search-data').append(html)
           })
        }
    })
}
$(function(){
    $('#searchText').autocomplete({
        source: function(req, res) {
            $.ajax({
                url: "https://stud-assistence.herokuapp.com/autoCompleteCourseName/",
                dataType: "jsonp",
                type: "GET",
                data: req,
                success: function(data) {
                    res(data)
                },
                error: function(err) {
                }
            })
        },
        minLength: 1,
        select: function(event, ui) {
            if(ui.item) {
                $('#searchText').text(ui.item.label);
            }
        }

    })
})
