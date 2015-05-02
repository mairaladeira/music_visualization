/**
 * Created by Maira on 5/1/15.
 */
var square_size = 20;
function render_main_visualization(songs){
    //this function expects the songs array to be sorted from the oldest to the newest.
    var date = songs[0].timestamp;
    var last_day = songs[songs.length - 1].timestamp;
    var amount_days =  Math.ceil((last_day-date)/(1000*60*60*24));
    var visualization_div = $('#visualization');
    var histogram_div = $('#histogram');
    if (amount_days > 100) {
        square_size = 10;
    }
    visualization_div.width((square_size+1)*amount_days);
    histogram_div.width((square_size+1)*amount_days);
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
        html += create_hours_divs(date.getDate()+'-'+date.getMonth()+'-'+date.getFullYear(), square_size);
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
    visualization_div.append(html);
    histogram_div.append(histogram_html);
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

function create_hours_divs(date, size) {
    var html = '';
    for (var i=0; i < 24; i++) {
        var extra_class = '';
        if (i < 4) {
            extra_class = 'top_hours';
        }
        if (i > 20) {
            extra_class = 'bottom_hours';
        }
        html += '<div class="hour hour_'+i+' '+extra_class+'" id="'+date+'-'+i+'" style="width: '+size+'px;"></div>';
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

function get_histogram_size(data) {
    var max = 0;
    var histogram = $('#histogram');
    var histogram_days = histogram.find('.day');
    histogram_days.each(function(){
        var amount_children = $(this).find('.square').length;
        if (amount_children > max)
            max = amount_children;
    });
    var size = Math.floor(histogram.height()/max);
    histogram.height(size*max);
    histogram_days.find('.square').height(size);
    histogram_days.each(function(){
        var square = $(this).find('.square');
        var bottom = 0;
        square.each(function(){
            $(this).css('bottom', bottom+'px');
            bottom = bottom + size;
        });
    });
}

$(document).ready(function(){
    $(window).bind('scroll', function(){
        $('#hours_axis').css('left', $(this).scrollLeft()-10);
    })
})