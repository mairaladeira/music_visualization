/**
 * Created by Maira on 5/1/15.
 */
var square_size = 20;
var height = 503;
var histogram_square_height = 0;
function render_main_visualization(){
    //this function expects the songs array to be sorted from the oldest to the newest.
    var date = songs[0].timestamp;
    var n = date.getTimezoneOffset();
    console.log(n);
    var last_day = songs[songs.length - 1].timestamp;
    var amount_days =  Math.ceil((last_day-date)/(1000*60*60*24));
    if (amount_days > 100) {
        square_size = 10;
    }
    var histogram = $('#histogram');
    var visualization = $('#visualization');

    visualization.width((square_size+1)*amount_days);
    histogram.width((square_size+1)*amount_days);
    $('#canvas_overflow').width((square_size+1)*amount_days);
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
        var element_data = '<div class="square '+ v.gender+' tooltip" data-class="'+ format_music_name_for_html(v.name)+'" data-id="'+i+'">' +
                                '<span class="extra_info">' +
                                    '<div class="tooltip_arrow"></div>' +
                                    '<div class="info">' +
                                        '<div class="name"><strong>'+ v.name+'</strong></div>' +
                                        '<div class="artist"><strong>Artist: </strong>'+v.artist+'</div>' +
                                        '<div class="album"><strong>Album: </strong>'+v.album+'</div>' +
                                        '<div class="gender"><strong>Genre: </strong>'+get_gender_text(v.gender)+'</div>'+
                                        '<div class="list_frequency">Listened <strong>'+ v.frequency+'</strong> Times</div>'+
                                    '</div>'+
                                '</span>' +
                           '</div>';
        var histogram_element_data = '<div class="square '+ v.gender+' tooltip" style="width:'+square_size+'px;" data-id="'+i+'"></div>';
        $('#'+ song_date +'-'+ v.hour).append(element_data);
        $('#'+ song_date +'_histogram').append(histogram_element_data);
    });
    get_squares_size();
    get_histogram_size();
    bind_music_events();
    get_hours_histogram();
}

function get_hours_histogram() {
    var frequencies = [
        {total: 0, jazz_blues:0, pop:0, metal:0, rock:0, 'hip-hop_rap':0, dance_electronic:0, alternative_indie:0, reb_soul:0, other:0},
        {total: 0, jazz_blues:0, pop:0, metal:0, rock:0, 'hip-hop_rap':0, dance_electronic:0, alternative_indie:0, reb_soul:0, other:0},
        {total: 0, jazz_blues:0, pop:0, metal:0, rock:0, 'hip-hop_rap':0, dance_electronic:0, alternative_indie:0, reb_soul:0, other:0},
        {total: 0, jazz_blues:0, pop:0, metal:0, rock:0, 'hip-hop_rap':0, dance_electronic:0, alternative_indie:0, reb_soul:0, other:0},
        {total: 0, jazz_blues:0, pop:0, metal:0, rock:0, 'hip-hop_rap':0, dance_electronic:0, alternative_indie:0, reb_soul:0, other:0},
        {total: 0, jazz_blues:0, pop:0, metal:0, rock:0, 'hip-hop_rap':0, dance_electronic:0, alternative_indie:0, reb_soul:0, other:0},
        {total: 0, jazz_blues:0, pop:0, metal:0, rock:0, 'hip-hop_rap':0, dance_electronic:0, alternative_indie:0, reb_soul:0, other:0},
        {total: 0, jazz_blues:0, pop:0, metal:0, rock:0, 'hip-hop_rap':0, dance_electronic:0, alternative_indie:0, reb_soul:0, other:0},
        {total: 0, jazz_blues:0, pop:0, metal:0, rock:0, 'hip-hop_rap':0, dance_electronic:0, alternative_indie:0, reb_soul:0, other:0},
        {total: 0, jazz_blues:0, pop:0, metal:0, rock:0, 'hip-hop_rap':0, dance_electronic:0, alternative_indie:0, reb_soul:0, other:0},
        {total: 0, jazz_blues:0, pop:0, metal:0, rock:0, 'hip-hop_rap':0, dance_electronic:0, alternative_indie:0, reb_soul:0, other:0},
        {total: 0, jazz_blues:0, pop:0, metal:0, rock:0, 'hip-hop_rap':0, dance_electronic:0, alternative_indie:0, reb_soul:0, other:0},
        {total: 0, jazz_blues:0, pop:0, metal:0, rock:0, 'hip-hop_rap':0, dance_electronic:0, alternative_indie:0, reb_soul:0, other:0},
        {total: 0, jazz_blues:0, pop:0, metal:0, rock:0, 'hip-hop_rap':0, dance_electronic:0, alternative_indie:0, reb_soul:0, other:0},
        {total: 0, jazz_blues:0, pop:0, metal:0, rock:0, 'hip-hop_rap':0, dance_electronic:0, alternative_indie:0, reb_soul:0, other:0},
        {total: 0, jazz_blues:0, pop:0, metal:0, rock:0, 'hip-hop_rap':0, dance_electronic:0, alternative_indie:0, reb_soul:0, other:0},
        {total: 0, jazz_blues:0, pop:0, metal:0, rock:0, 'hip-hop_rap':0, dance_electronic:0, alternative_indie:0, reb_soul:0, other:0},
        {total: 0, jazz_blues:0, pop:0, metal:0, rock:0, 'hip-hop_rap':0, dance_electronic:0, alternative_indie:0, reb_soul:0, other:0},
        {total: 0, jazz_blues:0, pop:0, metal:0, rock:0, 'hip-hop_rap':0, dance_electronic:0, alternative_indie:0, reb_soul:0, other:0},
        {total: 0, jazz_blues:0, pop:0, metal:0, rock:0, 'hip-hop_rap':0, dance_electronic:0, alternative_indie:0, reb_soul:0, other:0},
        {total: 0, jazz_blues:0, pop:0, metal:0, rock:0, 'hip-hop_rap':0, dance_electronic:0, alternative_indie:0, reb_soul:0, other:0},
        {total: 0, jazz_blues:0, pop:0, metal:0, rock:0, 'hip-hop_rap':0, dance_electronic:0, alternative_indie:0, reb_soul:0, other:0},
        {total: 0, jazz_blues:0, pop:0, metal:0, rock:0, 'hip-hop_rap':0, dance_electronic:0, alternative_indie:0, reb_soul:0, other:0},
        {total: 0, jazz_blues:0, pop:0, metal:0, rock:0, 'hip-hop_rap':0, dance_electronic:0, alternative_indie:0, reb_soul:0, other:0}
    ];
    $.each(songs, function(i, v){
        frequencies[parseInt(v.hour)].total++;
        frequencies[parseInt(v.hour)][v.gender]++;
    });
    var max = 0;
    $.each(frequencies, function(i, v){
        if (v.total > max) {
            max = v.total;
        }
    });
    var hours_frequency_axis_html = '';
    var height = 500/max;
    var class_n = 'frequent';
    if(max < 200) {
        class_n = 'unfrequent';
    }
    for(var i = max; i >= 0; i --) {
        hours_frequency_axis_html += '<li style="height: '+height+'px;">'+i+'</li>'
    }
    var html = '';
    $.each(frequencies, function(i,v){
        var bottom = 0;
        html += '<div class="hour">';
        if(v.jazz_blues > 0)
            html += '<div class="square jazz_blues" style="height: '+(height*v.jazz_blues)+'px; bottom:'+bottom+'px;"></div>';
            bottom = bottom + height*v.jazz_blues;
        if(v.pop > 0)
            html += '<div class="square pop" style="height: '+(height*v.pop)+'px; bottom:'+bottom+'px;"></div>';
            bottom = bottom + height*v.pop;
        if(v.metal > 0)
            html += '<div class="square metal" style="height: '+(height*v.metal)+'px; bottom:'+bottom+'px;"></div>';
            bottom = bottom + height*v.metal;
        if(v.rock > 0)
            html += '<div class="square rock" style="height: '+(height*v.rock)+'px; bottom:'+bottom+'px;"></div>';
            bottom = bottom + height*v.rock;
        if(v['hip-hop_rap'] > 0)
            html += '<div class="square hip-hop_rap" style="height: '+(height*v['hip-hop_rap'])+'px; bottom:'+bottom+'px;"></div>';
            bottom = bottom + height*v['hip-hop_rap'];
        if(v.dance_electronic > 0)
            html += '<div class="square dance_electronic" style="height: '+(height*v.dance_electronic)+'px; bottom:'+bottom+'px;"></div>';
            bottom = bottom + height*v.dance_electronic;
        if(v.alternative_indie > 0)
            html += '<div class="square alternative_indie" style="height: '+(height*v.alternative_indie)+'px; bottom:'+bottom+'px;"></div>';
            bottom = bottom + height*v.alternative_indie;
        if(v.reb_soul > 0)
            html += '<div class="square reb_soul" style="height: '+(height*v.reb_soul)+'px; bottom:'+bottom+'px;"></div>';
            bottom = bottom + height*v.reb_soul;
        if(v.other > 0)
            html += '<div class="square other" style="height: '+(height*v.other)+'px; bottom:'+bottom+'px;"></div>';
        html += '</div>';
    });
    $('#hours_frequency_axis').addClass(class_n).append(hours_frequency_axis_html);
    $('#hours_histogram').append(html);
}

function format_music_name_for_html(name) {
    var format_name = replaceAll(' ', '_', name);
    format_name = replaceAll('(', '_', format_name);
    format_name = replaceAll(')', '_', format_name);
    format_name = replaceAll("&#39;", '', format_name);
    format_name = replaceAll(',', '_', format_name);
    format_name = replaceAll('.', '_', format_name);
    return format_name;
}
function replaceAll(find, replace, str) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function get_gender_text(gender) {
    switch (gender) {
        case 'jazz_blues':
            return 'Jazz/Blues';
        case 'pop':
            return 'Pop';
        case 'metal':
            return 'Metal';
        case 'rock':
            return 'Rock';
        case 'hip-hop_rap':
            return 'Hip-hop/Rap';
        case 'dance_electronic':
            return 'Dance/Electronic';
        case 'alternative_indie':
            return 'Alternative/Indie';
        case 'reb_soul':
            return 'R&B/Soul';
        case 'other':
            return 'Other';
    }
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
    histogram_square_height = Math.floor(503/max);
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
    var ctx = canvas.getContext('2d');
    canvas.width = (square_size+1)*dataPoints.length;
    canvas.height = height;
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

function bind_music_events(){
    var square = $('.hour .square.tooltip');
    square.bind('mouseover', function(){
        var music = $(this).attr('data-class');
        if (square.length < 2000) {
            square.addClass('unfocus');
        $('.hour .square.tooltip[data-class="'+music+'"]').removeClass('unfocus').css('background-color', '#000000');
        } else {
            $('.hour .square.tooltip[data-class="'+music+'"]').css('background-color', '#000000');
        }
    });

    square.bind('mouseout', function(){
        if (square.length < 2000) {
            $('.hour .square.tooltip').removeClass('unfocus').css('background-color', '');
        } else {
            $('.hour .square.tooltip').css('background-color', '');
        }
    });

    $('.square').bind('click', function(){
        var music_overflow = $('#music_overflow');
        var music = songs[$(this).data('id')];
        music_overflow.find('.name').html(music.name);
        music_overflow.find('.artist span').html(music.artist);
        music_overflow.find('.album span').html(music.album);
        music_overflow.find('.frequency strong').html(music.frequency);
        music_overflow.find('.play_time strong').html(music.day+' '+music.month+' '+music.year+' '+music.time);
        var music_frequency_axis = $('#music_frequency_axis');
        music_frequency_axis.html('');
        var music_days_axis = $('#music_days_axis');
        music_days_axis.html('');
        var days_html = '';
        var frequency_html = '';
        if(music.icon != '') {
            music_overflow.find('.music_icon img').removeClass('hide').attr('src', music.icon);
        } else {
            music_overflow.find('.music_icon img').addClass('hide');
        }
        music_overflow.addClass('show');
        var dataPoints = [];
        var i = 0;
        var colors = {
            jazz_blues:'#774306',
            pop:'#FE0000',
            metal:'#97253F',
            rock:'#016AAB',
            'hip-hop_rap':'#019F4C',
            dance_electronic: '#FE7314',
            alternative_indie: '#6869A9',
            reb_soul: '#FBDE06',
            other: '#F0C896'
        };
        var days = $('#visualization').find('.day');
        var x_size = days.length;
        var x_width = 400/x_size;
        var y_size = 0;
        days.each(function(){
            var amount = $(this).find('.square.tooltip[data-class="'+format_music_name_for_html(music.name)+'"]').length;
            dataPoints.push({x: i, y:amount});
            if (amount > y_size) {
                y_size = amount;
            }
            i++;
            days_html += '<li style="width: '+x_width+'px; height: '+x_width+'px;">'+$(this).attr('id')+'</li>';
        });
        var y_height = 300/(y_size+1);
        for(var j = y_size; j >= 0; j--) {
            frequency_html += '<li style="height: '+y_height+'px;"><span>'+j+'</span></li>';
        }
        music_days_axis.append(days_html);
        music_frequency_axis.append(frequency_html);
        get_music_canvas(dataPoints, colors[music.gender], x_size, y_size);
    });
}

function get_music_x_y(point, square_w, square_h) {
    return {x: Math.floor((point.x*(square_w+0.5))+(square_w/2)+1), y: Math.floor(300-(point.y*square_h))-1};
}

function get_music_canvas(dataPoints, color, x_size, y_size){
    var canvas = document.getElementById('music_canvas');
    canvas.width = 400;
    canvas.height = 300;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.lineWidth = 2;
    var square_w = Math.floor(400/(x_size));
    var square_h = Math.floor(300/(y_size+1));
    var point = get_music_x_y(dataPoints[0], square_w, square_h);
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    $.each(dataPoints, function(i, v){
        var point = get_music_x_y(v, square_w, square_h);
        //ctx.font="12px Georgia";
        //ctx.fillText(v.x+'-'+v.y,point.x - 10,point.y+10);
        ctx.fillRect(point.x-(square_w/2),point.y, 5, 5);
        console.log(point.x+'-'+point.y);
        if (i == dataPoints.length -2) {
            var point2 = get_music_x_y(dataPoints[i+1], square_w, square_h);
            ctx.lineTo(point.x, point.y);
            ctx.lineTo(point2.x, point2.y);
        } else if (i != dataPoints.length -1) {
            point2 = get_music_x_y(dataPoints[i+1], square_w, square_h);
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

$(document).ready(function(){
    $(window).bind('scroll', function(){
        var offset_left = $(this).scrollLeft();
        $('#hours_axis').css('left', offset_left - 10);
        $('#frequency').css('left', offset_left - 20);
        $('.buttons').css('left', offset_left +20);
        $('.histogram_title').css('left', offset_left +20);
        $('.right_box').removeClass('right_box');
        $('.hour').each(function(){
            var left = $(this).offset().left;
            if (left > offset_left+($(window).width()/2)) {
                $(this).addClass('right_box');
            }
        });
    });
    $('#hide_continuous_approximations').bind('click', function(){
        var canvas_overflow = $('#canvas_overflow');
        canvas_overflow.removeClass('show_approximation');
        $('canvas.show').removeClass('show');
        $('.button.getLine').removeClass('selected');
    });
    $('.button.getLine').bind('click', function(){
        var canvas = $(this).attr("data-id");
        var canvas_div = $('#'+canvas);
        var canvas_overflow = $('#canvas_overflow');
        if (canvas_div.hasClass('show')) {
            canvas_div.removeClass('show');
            $(this).removeClass('selected');
            if($('canvas.show').length == 0)
                canvas_overflow.removeClass('show_approximation');
        }
        else {
            canvas_div.addClass('show');
            $(this).addClass('selected');
            canvas_overflow.addClass('show_approximation');
        }
    });

    $('.close').bind('click', function(){
        $('#music_overflow').removeClass('show');
    });

    $('.change_data').bind('click', function(){
        var id = $(this).attr('id');
        square_size = 20;
        height = 503;
        histogram_square_height = 0;
        $('#visualization').html('');
        $('#histogram').html('');
        $('.days_axis').html('');
        $('.months_axis').html('');
        $('.years_axis').html('');
        $('#frequency').html('');
        $('#histogram_canvas').html('');
        $('#jazz_canvas').html('');
        $('#pop_canvas').html('');
        $('#metal_canvas').html('');
        $('#rock_canvas').html('');
        $('#hip-hop_canvas').html('');
        $('#dance_canvas').html('');
        $('#alternative_canvas').html('');
        $('#reb_canvas').html('');
        $('#others_canvas').html('');
        $('#hours_frequency_axis').html('');
        $('#hours_histogram').html('');
        $('#datasource').html(id);
        $('.change_data').removeClass('selected');
        $('#'+id).addClass('selected');
        songs = [];

        $.post('getData', {username:id}).done(function(data){
            data = JSON.parse(data);
            var months = ['January','February','March','April','May','June','July','August',
                          'September','October','November','December'];
            $.each(data, function(i,v){
                var date_ts = parseInt(v[4], 10);
                if (date_ts != 0) {
                    var date = new Date(date_ts*1000)
                    var minutes = "0" + date.getMinutes();
                    var s = {
                        name: v[0],
                        gender: v[1],
                        artist: v[2],
                        album: v[3],
                        day: date.getDate(),
                        month: months[date.getMonth()],
                        year: date.getFullYear(),
                        hour: date.getHours(),
                        time: date.getHours()+ ':' + minutes.substr(minutes.length-2),
                        timestamp: date,
                        icon:  v[5],
                        frequency: v[6]
                    };
                    songs.push(s);
                }
            });
            render_main_visualization(songs);
        });
    });
});