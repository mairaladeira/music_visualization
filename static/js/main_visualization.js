/**
 * Created by Maira on 5/1/15.
 */
var square_size = 20;
var height = 0;
var histogram_square_height = 0;
function render_main_visualization(songs){
    //this function expects the songs array to be sorted from the oldest to the newest.
    var date = songs[0].timestamp;
    var last_day = songs[songs.length - 1].timestamp;
    var amount_days =  Math.ceil((last_day-date)/(1000*60*60*24));
    if (amount_days > 100) {
        square_size = 10;
    }
    var histogram = $('#histogram');
    var visualization = $('#visualization');

    visualization.width((square_size+1)*amount_days);
    histogram.width((square_size+1)*amount_days);
    //$('#histogram_canvas').width((square_size+1)*amount_days);
    $('body').width(((square_size+1)*amount_days)+40);
    var html = '';
    var day_axis_html = '';
    var weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var month_size = 0;
    var year_size = 0;
    var last_month = date.getMonth();
    var last_year = date.getFullYear();
    var month_html = '';
    var year_html = '';
    var histogram_html = '';
    while (date.getTime() < last_day.getTime()) {
        var weekday = weekdays[date.getDay()];
        html += '<div class="day day_'+date.getDate()+' '+weekday+'" id="'+date.getDate()+'-'+date.getMonth()+'-'+date.getFullYear()+'">';
        html += create_hours_divs(date.getDate()+'-'+date.getMonth()+'-'+date.getFullYear());
        html += '</div>';
        histogram_html += '<div class="day day_'+date.getDate()+' '+weekday+'" id="'+date.getDate()+'-'+date.getMonth()+'-'+date.getFullYear()+'_histogram" style="width:'+square_size+'px;"></div>';
        day_axis_html += '<li class="day_entrance" style="width:'+(square_size+1)+'px;">'+date.getDate()+'</li>';
        if(last_month != date.getMonth()) {
            month_html += '<li class="month_entrance" style="width:'+month_size+'px;">'+months[last_month]+'</li>';
            last_month = date.getMonth();
            month_size = square_size + 1;
        } else {
            month_size = month_size + square_size + 1;
        }
        if(last_year != date.getFullYear()) {
            year_html += '<li class="year_entrance" style="width:'+year_size+'px;">'+last_year+'</li>';
            last_year = date.getFullYear();
            year_size = square_size + 1;
        } else {
            year_size = year_size + square_size + 1;
        }
        date.setTime(date.getTime() + 86400000);
    }
    month_html += '<li class="month_entrance" style="width:'+month_size+'px;">'+months[last_month]+'</li>';
    year_html += '<li class="year_entrance" style="width:'+year_size+'px;">'+last_year+'</li>';
    visualization.append(html);
    histogram.append(histogram_html);
    $('.days_axis').append(day_axis_html);
    $('.months_axis').append(month_html);
    $('.years_axis').append(year_html);

    $.each(songs, function(i,v){
        var song_date = v.timestamp.getDate()+'-'+v.timestamp.getMonth()+'-'+v.timestamp.getFullYear();
        var element_data = '<div class="square '+ v.gender+' tooltip">' +
                                '<span class="extra_info">' +
                                    '<div class="tooltip_arrow"></div>' +
                                    '<div class="info">' +
                                        '<div class="name"><strong>'+ v.name+'</strong></div>' +
                                        '<div class="artist"><strong>Artist: </strong>'+v.artist+'</div>' +
                                        '<div class="album"><strong>Album: </strong>'+v.album+'</div>' +
                                    '</div>'+
                                '</span>' +
                           '</div>';
        var histogram_element_data = '<div class="square '+ v.gender+' tooltip" style="width:'+square_size+'px;"></div>';
        $('#'+ song_date +'-'+ v.hour).append(element_data);
        $('#'+ song_date +'_histogram').append(histogram_element_data);
    });
    get_squares_size();
    get_histogram_size();
}

function create_hours_divs(date) {
    var html = '';
    for (var i=0; i < 24; i++) {
        var extra_class = '';
        if (i < 4) {
            extra_class = 'top_hours';
        }
        if (i > 20) {
            extra_class = 'bottom_hours';
        }
        html += '<div class="hour hour_'+i+' '+extra_class+'" id="'+date+'-'+i+'" style="width: '+square_size+'px;"></div>';
    }
    return html;
}

function get_squares_size(){
    $('.hour').each(function(){
        var squares = $(this).find('.square');
        var amount = squares.length;
        if (amount > 0) {
            var size = 20/amount;
            squares.height(size);
        }
    })
}

function get_histogram_size() {
    var max = 0;
    var histogram = $('#histogram');
    var histogram_days = histogram.find('.day');
    var i = 0;
    var dataPoints = [];
    histogram_days.each(function(){
        var amount_children = $(this).find('.square').length;
        dataPoints.push({x: i, y:amount_children});
        i ++;
        if (amount_children > max)
            max = amount_children;
    });
    histogram_square_height = Math.floor(histogram.height()/max);
    height = histogram_square_height*max;
    histogram.height(height);
    histogram_days.find('.square').height(histogram_square_height);
    histogram_days.each(function(){
        var square = $(this).find('.square');
        var bottom = 0;
        square.each(function(){
            $(this).css('bottom', bottom+'px');
            bottom = bottom + histogram_square_height;
        });
    });
    var frequency_html = '';
    var frequency_div = $('#frequency');
    if (max > 100) {
        frequency_div.addClass('frequent');
    } else {
        frequency_div.addClass('unfrequent');
    }
    for (var j = max; j > 0; j--) {
        frequency_html += '<li style="height:'+(histogram_square_height)+'px;">'+j+'</li>';
    }
    frequency_div.append(frequency_html);
    get_canvas(dataPoints, 'histogram_canvas', '#CCCCCC');
    get_gender_canvas();
}

function get_canvas(dataPoints, canvas_id, color){
    var canvas = document.getElementById(canvas_id);
    canvas.width = (square_size+1)*dataPoints.length;
    canvas.height = height;
    var ctx = canvas.getContext('2d');
    ctx.lineWidth = 3;
    var point = get_histogram_x_y(dataPoints[0]);
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    $.each(dataPoints, function(i, v){
        var point = get_histogram_x_y(v);
        //ctx.fillRect(point.x-2,point.y, 5, 5);
        if (i == dataPoints.length -2) {
            var point2 = get_histogram_x_y(dataPoints[i+1]);
            ctx.lineTo(point.x, point.y);
            ctx.lineTo(point2.x, point2.y);
        } else if (i != dataPoints.length -1) {
            point2 = get_histogram_x_y(dataPoints[i+1]);
            var xc = (point.x + point2.x)/2;
            var yc = (point.y + point2.y)/2;
            xc = (xc + point.x)/2;
            yc = (yc + point.y)/2;
            xc = (xc + point.x)/2;
            yc = (yc + point.y)/2;
            xc = (xc + point.x)/2;
            yc = (yc + point.y)/2;
            xc = (xc + point.x)/2;
            yc = (yc + point.y)/2;
            xc = (xc + point.x)/2;
            yc = (yc + point.y)/2;
            xc = (xc + point.x)/2;
            yc = (yc + point.y)/2;
            xc = (xc + point.x)/2;
            yc = (yc + point.y)/2;
            ctx.bezierCurveTo(point.x, point.y,point.x, point.y, xc, yc);
        }
    });
    ctx.strokeStyle = color;
    ctx.stroke();
}

function get_gender_canvas(){
    var histogram = $('#histogram');
    var histogram_days = histogram.find('.day');
    var i = 0;
    var genders = ['jazz_blues', 'pop', 'metal', 'rock', 'hip-hop_rap','dance_electronic', 'alternative_indie', 'reb_soul', 'other'];
    var canvas_ids = ['jazz_canvas', 'pop_canvas', 'metal_canvas', 'rock_canvas','hip-hop_canvas', 'dance_canvas', 'alternative_canvas', 'reb_canvas', 'others_canvas'];
    var colors = ['#774306', '#FE0000', '#97253F', '#016AAB', '#019F4C', '#FE7314', '#6869A9', '#FBDE06', '#F0C896'];
    var dataPoints = {
        jazz:[],
        pop: [],
        metal: [],
        rock: [],
        hip_hop:[],
        dance:[],
        alternative: [],
        reb: [],
        others: []
    };
    histogram_days.each(function(){
        var amount_jazz = $(this).find('.square.'+genders[0]).length;
        dataPoints.jazz.push({x: i, y:amount_jazz});
        var amount_pop = $(this).find('.square.'+genders[1]).length;
        dataPoints.pop.push({x: i, y:amount_pop});
        var amount_metal = $(this).find('.square.'+genders[2]).length;
        dataPoints.metal.push({x: i, y:amount_metal});
        var amount_rock = $(this).find('.square.'+genders[3]).length;
        dataPoints.rock.push({x: i, y:amount_rock});
        var amount_hip_hop = $(this).find('.square.'+genders[4]).length;
        dataPoints.hip_hop.push({x: i, y:amount_hip_hop});
        var amount_dance = $(this).find('.square.'+genders[5]).length;
        dataPoints.dance.push({x: i, y:amount_dance});
        var amount_alternative = $(this).find('.square.'+genders[6]).length;
        dataPoints.alternative.push({x: i, y:amount_alternative});
        var amount_reb = $(this).find('.square.'+genders[7]).length;
        dataPoints.reb.push({x: i, y:amount_reb});
        var amount_others = $(this).find('.square.'+genders[8]).length;
        dataPoints.others.push({x: i, y:amount_others});
        i ++;
    });
    get_canvas(dataPoints.jazz, canvas_ids[0], colors[0]);
    get_canvas(dataPoints.pop, canvas_ids[1], colors[1]);
    get_canvas(dataPoints.metal, canvas_ids[2], colors[2]);
    get_canvas(dataPoints.rock, canvas_ids[3], colors[3]);
    get_canvas(dataPoints.hip_hop, canvas_ids[4], colors[4]);
    get_canvas(dataPoints.dance, canvas_ids[5], colors[5]);
    get_canvas(dataPoints.alternative, canvas_ids[6], colors[6]);
    get_canvas(dataPoints.reb, canvas_ids[7], colors[7]);
    get_canvas(dataPoints.others, canvas_ids[8], colors[8]);
}


function get_histogram_x_y(point) {
    return {x: Math.floor((point.x*(square_size+1))+(square_size/2)-1), y: Math.floor(height-point.y*histogram_square_height)-2};
}

$(document).ready(function(){
    $(window).bind('scroll', function(){
        $('#hours_axis').css('left', $(this).scrollLeft()-10);
        $('#frequency').css('left', $(this).scrollLeft()-10);
        $('#continuous_approximation').css('left', $(this).scrollLeft()+20);
        $('#histogram_title').css('left', $(this).scrollLeft()+20);
    });
    $('#hide_continuous_approximations').bind('click', function(){
        var histogram = $('#histogram');
        histogram.removeClass('show_approximation');
        $('canvas.show').removeClass('show');
    });
    $('.button.getLine').bind('click', function(){
        var canvas = $(this).attr("data-id");
        var canvas_div = $('#'+canvas);
        var histogram = $('#histogram');
        if (canvas_div.hasClass('show')) {
            canvas_div.removeClass('show');
            if($('canvas.show').length == 0)
                histogram.removeClass('show_approximation');
        }
        else {
            canvas_div.addClass('show');
            histogram.addClass('show_approximation');
        }
    });
});