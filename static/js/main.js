$(document).ready(function(){

    /*********************
    ***** Concept Lists */

    concepts_to_care_about = ["Thought","Concept","Language","Color vision","Martial arts","Craft","Friendship","Shape","Skill","Hand strength","Critical thinking","Puzzle","Musical notation","Tool","Learning","Special needs","Tools","Occupational therapy","Motor skill","Therapy","Down syndrome","Child development","Motor control","Creativity","Emotion"];
    for(i = 0; i < concepts_to_care_about.length; ++i) {
        $(".concept_list").append("<a class='concept_btn btn btn-default' href='#by_concept'>"+concepts_to_care_about[i]+"</a>");
    }

    /*
        * Add all of the ASIN buttons to the page
        ["B002YIRKKY",
        "B005DX7TFI",
        "B00SIMS2R0",
        "B00V9YYD86",
        "B0044SA6JE",
        "B001FVGM6O",
        "B0080AHHGC",
        "B00IWCQR3M",
        "B0030F67N6"]
    */
    asin_list   = [ "B002YIRKKY",
                    "B005DX7TFI",
                    "B00SIMS2R0",
                    "B00V9YYD86",
                    "B0044SA6JE",
                    "B001FVGM6O",
                    "B0080AHHGC",
                    "B00IWCQR3M",
                    "B0030F67N6"];

    var lookup = {  'B002YIRKKY': "B. Pop Arty! (500 pcs)",
                    'B005DX7TFI': "B. Snug Bugs",
                    'B00SIMS2R0': "Battat Take-A-Part Toy Vehicles Airplane Green",
                    'B00V9YYD86': "Battat Beauty Pops (275 Piece)",
                    'B0044SA6JE': "Battat Farm Bath Buddies",
                    'B001FVGM6O': "Battat Sound Puzzle Box",
                    'B0080AHHGC': "B. Doctor",
                    'B00IWCQR3M': "B. LucKeys",
                    'B0030F67N6': "B. Toys B. One Two Squeeze Blocks"};

    for(i = 0; i < asin_list.length; ++i) {
        $(".asin_list").append("<a class='asin_btn btn btn-default' href='#"+asin_list[i]+"' data-asin='"+asin_list[i]+"'>"+lookup[asin_list[i]]+"</a>");
    }

    $(".request_input,.product_input,.sentiment_input").on("change", function(){
        
        $.ajax({
            url: "return_top_results",
            method: "POST",
            data: {
                'request_input': $(".product_input").val(),
                'limit': $('.request_input').val(),
                'sentiment': $(".sentiment_input").val()
            },
            success: function(response){
                $("#concepts").html("<ul class='list-group-item list-group-item-info text-center'>Concepts</ul>");
                $("#keywords").html("<ul class='list-group-item list-group-item-info text-center'>Keywords</ul>");
                $("#entities").html("<ul class='list-group-item list-group-item-info text-center'>Entities</ul>");

                if ("concepts" in response && response["concepts"].length > 0) {
                    // Concepts exist
                    response["concepts"].forEach(function(e, i){
                        $("#concepts").append("<li class='list-group-item'>"+(i+1)+". "+e[0]+"</li>");
                    });
                }
                if ("keywords" in response && response["keywords"].length > 0) {
                    // Keywords exist
                    response["keywords"].forEach(function(e, i){
                        $("#keywords").append("<li class='list-group-item'>"+(i+1)+". "+e[0]+"</li>");
                    });
                }
                if ("entities" in response && response["entities"].length > 0) {
                    // entities exist
                    response["entities"].forEach(function(e, i){
                        $("#entities").append("<li class='list-group-item'>"+(i+1)+". "+e[0]+"</li>");
                    });
                }
            }
        });

    });

    $("body").on("click", ".concept_btn", function(){
        var concept_space = $(this).text();
        
        $.get("json_output/by_concept").success(function(data){
            var concept = concept_space.replace(new RegExp(" ", 'g'), "_"),
                data = JSON.parse(data)[concept];
                
            $(".comments").html("<h2>Showing Reviews for "+concept_space+"</h2>");
            $(".comments").append("<p><strong>"+data.length+" total comments</strong></p>");
            $(".comments").append('<hr>');
            $.each(data, function(i, rev){
                var append_string = "";
                append_string += "<div class='row'>";
                append_string += "<div class='comment col-md-4'><span class='author'>"+rev['author']+"</span>"+
                                "<span class='rating'>"+rev['numerical']+"/5</span>"+
                                "<h2>"+lookup[rev['asin']]+"</h2>"+
                                rev['text']+
                                "</div>";
                append_string += "<div class='col-md-8'>";

                // Document Sentiment
                append_string += "<div class='row'><div class='col-md-7'>"
                append_string += "<p><strong>Comment Sentiment:</strong> "+
                                    rev['response_object']['sentiment']['document']['label']+
                                    " ("+rev['response_object']['sentiment']['document']['score']+")"+
                                "</p>";

                // Document Emotional Contnet
                append_string +=    "<div class='progress'>"+
                                    "<div class='progress-bar progress-bar-primary' role='progressbar'"+
                                        "aria-valuenow='"+rev['response_object']['emotion']['document']['emotion']['sadness']*100+"'"+
                                        "aria-valuemin='0' aria-valuemax='100'"+
                                        "style='width: "+rev['response_object']['emotion']['document']['emotion']['sadness']*100+"%;'"+
                                        ">Sadness"+
                                    "</div></div>";
                append_string +=    "<div class='progress'>"+
                                    "<div class='progress-bar progress-bar-success' role='progressbar'"+
                                        "aria-valuenow='"+rev['response_object']['emotion']['document']['emotion']['joy']*100+"'"+
                                        "aria-valuemin='0' aria-valuemax='100'"+
                                        "style='width: "+rev['response_object']['emotion']['document']['emotion']['joy']*100+"%;'"+
                                        ">Joy"+
                                    "</div></div>";
                append_string +=    "<div class='progress'>"+
                                    "<div class='progress-bar progress-bar-warning' role='progressbar'"+
                                        "aria-valuenow='"+rev['response_object']['emotion']['document']['emotion']['fear']*100+"'"+
                                        "aria-valuemin='0' aria-valuemax='100'"+
                                        "style='width: "+rev['response_object']['emotion']['document']['emotion']['fear']*100+"%;'"+
                                        ">Fear"+
                                    "</div></div>";
                append_string +=    "<div class='progress'>"+
                                    "<div class='progress-bar progress-bar-danger' role='progressbar'"+
                                        "aria-valuenow='"+rev['response_object']['emotion']['document']['emotion']['anger']*100+"'"+
                                        "aria-valuemin='0' aria-valuemax='100'"+
                                        "style='width: "+rev['response_object']['emotion']['document']['emotion']['anger']*100+"%;'"+
                                        ">Anger"+
                                    "</div></div>";
                append_string +=    "<div class='progress'>"+
                                    "<div class='progress-bar progress-bar-info' role='progressbar'"+
                                        "aria-valuenow='"+rev['response_object']['emotion']['document']['emotion']['disgust']*100+"'"+
                                        "aria-valuemin='0' aria-valuemax='100'"+
                                        "style='width: "+rev['response_object']['emotion']['document']['emotion']['disgust']*100+"%;'"+
                                        ">Disgust"+
                                    "</div></div>";
                 append_string += "<hr >";
                // Filter through some concepts here
                append_string += "<p><strong> Concepts:</strong></p>";
                $.each(rev['response_object']['concepts'], function(j, c){
                    append_string += "<a class='btn btn-default'>"+c['text']+" <span class='badge'>"+c['relevance']+"</span></a>";
                });
                append_string += "<hr >";
                // Filter through some entities here
                append_string += "<p><strong>Entities: </strong></p>";
                $.each(rev['response_object']['entities'], function(j, c){
                    append_string += "<a class='btn btn-info'>"+c['type']+" - "+ c['text'] +"("+c['count']+") <span class='badge'>"+c['relevance']+"</span></a>";
                });
                append_string += "<hr >";
                append_string += "<div class='list-group'><p class='list-group-group-item active'><strong>Categories: </strong></p>";
                $.each(rev['response_object']['categories'], function(j, c){
                    append_string += "<p class='list-group-group-item'>"+c['label']+" <span class='badge'>"+c['score']+"</span></p>";
                });
                append_string += "</div>";

                append_string += "</div>";
                append_string += "<div class='col-md-5'>";

                    // Filter through some keywords here
                    append_string += "<div class='list-group'>";
                    append_string += "<p class='list-group-group-item active'>Keywords</p>";
                    $.each(rev['response_object']['keywords'], function(j, c){
                        append_string += "<p class='list-group-group-item'>"+c['text']+" <span class='badge'>"+c['relevance']+"</span></p>";
                    });
                    append_string += "</div>";
                    
                append_string += "</div></div>";

                append_string += "</div></div><hr>";
                $(".comments").append(append_string);
            });
        });
    });

    $("body").on("click", '.asin_btn', function(){
        var hash = $(this).data("asin");
        $.get("json_output/"+hash).success(function(data){
            var data = JSON.parse(data);
            $('.comments').html("<h2>Showing Reviews for <a href='https://www.amazon.com/dp/"+hash+"' target='_BLANK'>'"+lookup[hash]+"'</a></h2>");
            $(".comments").append("<p><strong>"+data.length+" total comments</strong></p>");
            $(".comments").append('<hr>');
            $.each(data, function(i, rev){
                var append_string = "";
                append_string += "<div class='row'>";
                append_string += "<div class='comment col-md-4'><span class='author'>"+rev['author']+"</span>"+
                                "<span class='rating'>"+rev['numerical']+"/5</span>"+rev['text']+"</div>";
                append_string += "<div class='col-md-8'>";

                // Document Sentiment
                append_string += "<div class='row'><div class='col-md-7'>"
                append_string += "<p><strong>Comment Sentiment:</strong> "+
                                    rev['response_object']['sentiment']['document']['label']+
                                    " ("+rev['response_object']['sentiment']['document']['score']+")"+
                                "</p>";

                // Document Emotional Contnet
                append_string +=    "<div class='progress'>"+
                                    "<div class='progress-bar progress-bar-primary' role='progressbar'"+
                                        "aria-valuenow='"+rev['response_object']['emotion']['document']['emotion']['sadness']*100+"'"+
                                        "aria-valuemin='0' aria-valuemax='100'"+
                                        "style='width: "+rev['response_object']['emotion']['document']['emotion']['sadness']*100+"%;'"+
                                        ">Sadness"+
                                    "</div></div>";
                append_string +=    "<div class='progress'>"+
                                    "<div class='progress-bar progress-bar-success' role='progressbar'"+
                                        "aria-valuenow='"+rev['response_object']['emotion']['document']['emotion']['joy']*100+"'"+
                                        "aria-valuemin='0' aria-valuemax='100'"+
                                        "style='width: "+rev['response_object']['emotion']['document']['emotion']['joy']*100+"%;'"+
                                        ">Joy"+
                                    "</div></div>";
                append_string +=    "<div class='progress'>"+
                                    "<div class='progress-bar progress-bar-warning' role='progressbar'"+
                                        "aria-valuenow='"+rev['response_object']['emotion']['document']['emotion']['fear']*100+"'"+
                                        "aria-valuemin='0' aria-valuemax='100'"+
                                        "style='width: "+rev['response_object']['emotion']['document']['emotion']['fear']*100+"%;'"+
                                        ">Fear"+
                                    "</div></div>";
                append_string +=    "<div class='progress'>"+
                                    "<div class='progress-bar progress-bar-danger' role='progressbar'"+
                                        "aria-valuenow='"+rev['response_object']['emotion']['document']['emotion']['anger']*100+"'"+
                                        "aria-valuemin='0' aria-valuemax='100'"+
                                        "style='width: "+rev['response_object']['emotion']['document']['emotion']['anger']*100+"%;'"+
                                        ">Anger"+
                                    "</div></div>";
                append_string +=    "<div class='progress'>"+
                                    "<div class='progress-bar progress-bar-info' role='progressbar'"+
                                        "aria-valuenow='"+rev['response_object']['emotion']['document']['emotion']['disgust']*100+"'"+
                                        "aria-valuemin='0' aria-valuemax='100'"+
                                        "style='width: "+rev['response_object']['emotion']['document']['emotion']['disgust']*100+"%;'"+
                                        ">Disgust"+
                                    "</div></div>";
                 append_string += "<hr >";
                // Filter through some concepts here
                append_string += "<p><strong> Concepts:</strong></p>";
                $.each(rev['response_object']['concepts'], function(j, c){
                    append_string += "<a class='btn btn-default'>"+c['text']+" <span class='badge'>"+c['relevance']+"</span></a>";
                });
                append_string += "<hr >";
                // Filter through some entities here
                append_string += "<p><strong>Entities: </strong></p>";
                $.each(rev['response_object']['entities'], function(j, c){
                    append_string += "<a class='btn btn-info'>"+c['type']+" - "+ c['text'] +"("+c['count']+") <span class='badge'>"+c['relevance']+"</span></a>";
                });
                append_string += "<hr >";
                append_string += "<div class='list-group'><p class='list-group-group-item active'><strong>Categories: </strong></p>";
                $.each(rev['response_object']['categories'], function(j, c){
                    append_string += "<p class='list-group-group-item'>"+c['label']+" <span class='badge'>"+c['score']+"</span></p>";
                });
                append_string += "</div>";

                append_string += "</div>";
                append_string += "<div class='col-md-5'>";

                    // Filter through some keywords here
                    append_string += "<div class='list-group'>";
                    append_string += "<p class='list-group-group-item active'>Keywords</p>";
                    $.each(rev['response_object']['keywords'], function(j, c){
                        append_string += "<p class='list-group-group-item'>"+c['text']+" <span class='badge'>"+c['relevance']+"</span></p>";
                    });
                    append_string += "</div>";
                    
                append_string += "</div></div>";

                append_string += "</div></div><hr>";
                $(".comments").append(append_string);
            });
        });
    });
});

$(".request_input").ready(function(){
    $(".request_input").trigger("change");
});