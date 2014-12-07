(function($, undefined){

var articles = [];
var Provider = [
  {'name': 'Microsoft', 'abbr': 'ms'},
  {'name': 'Google', 'abbr': 'gl'},
  {'name': 'Auburn', 'abbr': 'zh'}
];
var Code = ['ms', 'gl', 'zh'];
var evil = '';

function UrlParam(url) {

  "use strict";

  var rNull = /^\s*$/,
      rBool = /^(true|false)$/i;

  function conv(val) {
    if (rNull.test(val)) return null;
    if (rBool.test(val)) return val.toLowerCase() === "true";
    if (isFinite(val)) return parseFloat(val);
    if (isFinite(Date.parse(val))) return new Date(val);
    return val;
  }

  if (!url) return null;

  return url.split("?")[1].split("&")
    .reduce(function(acc, cur) {
      var pair = cur.split("=");
      acc[unescape(pair[0])] = pair.length > 1
        ? conv(unescape(pair[1]))
        : null;
      return acc;
    }, {});
}

function mkcontent(page, i) {
  var j;

  var $ul = $('<ul/>', {'class': 'nav nav-tabs', 'role': 'tablist'});
  for (j = 0; j < Provider.length; ++j) {
    $ul.append(
      $('<li/>', {'role': 'presentation'})
        .append($('<a/>', {
          'href': '#zh-' + Provider[j]['abbr'],
          'aria-controls': 'zh-' + Provider[j]['abbr'],
          'role': 'tab',
          'data-toggle': 'tab'
        }).text(Provider[j]['name']))
    );
  }
  $('li', $ul).first().addClass('active');

  var $cont = $('<div/>', {'class': 'tab-content'});
  for (j = 0; j < Provider.length; ++j) {
    $cont.append(
      $('<div/>', {
        'role': 'tabpanel',
        'class': 'tab-pane',
        'id': 'zh-' + Provider[j]['abbr']})
        .append($('<h4/>').text(articles[page][i]['title_' + Provider[j]['abbr']]),
                $('<p/>').text(articles[page][i]['abstract_' + Provider[j]['abbr']]))
    );
  }
  $('div', $cont).first().addClass('active');

  var $div = $('<div/>', {'role': 'tabpanel'})
        .append($ul, $cont);
  return $div.html();
}

function loadpagei(page)
{
  var $list = $('#article-list').html('');

  $.each(articles[page], function(i, item){
    var $t = $('<h3/>', {'class': 'list-group-item-heading'})
          .text(item['title'])
          .append($('<a/>', {
            'href': 'http://dx.doi.org/' + item['doi'],
            'style': 'margin-left: 10px'})
                  .append($('<span/>', {'class': 'glyphicon glyphicon-link'})));
    var $r = $('<small/>').html(item['citation']);
    var $p = $('<p/>', {'class': 'list-group-item-text'})
          .text(item['abstract']);
    var $d = $('<div/>', {'class': 'list-group-item'})
          .append($('<div/>', {
            'id': 'article-' + i,
            'data-original-title': ''})
                  .append($t, $r, $p)
                  .popover({
                    'html': true,
                    'title': '中文翻译',
                    'toggle': 'focus',
                    'placement': 'bottom',
                    'content': function() {return mkcontent(page, i);}}));
    $list.append($d);
  });
}

$(document).ready(function() {

  if (window.location.href.indexOf('evil') > -1)
    evil = '../';

  var param = UrlParam(window.location.search);

  if (param && Code.indexOf(param['by']) > -1) {

    $('.page-header').append(
      $('<div/>', {'class': 'alert alert-warning', 'role': 'alert'})
        .append(
          $('<span/>', {'class': 'glyphicon glyphicon-warning-sign', 'aria-hidden': 'true'}),
          $('<span/>').text('机器翻译，仅供参考 (Machine translated, for your reference only)')));

    $('ul', $('.page-header')).append(
      $('<li/>').append($('<a/>', {'href': 'http://ieeexplore.ieee.org/xpl/conhome.jsp?punumber=1000355'})
                        .text('Xplorer 会议主页')),
      $('<li/>').append($('<a/>', {'href': 'http://ieee-ies.org'})
                        .text('协会主页')));

    if (evil) {

      $.getJSON(evil + 'articles.json', function(data) {

        articles = data.slice();

        var $list = $('#article-list').html('');
        $.each(articles, function(i, item) {
          var $r = $('<p/>').html(item['citation']);
          var $t = $('<div/>', {'class': 'list-group-item-heading'})
                .append($('<h3/>').text('标题 (Title): ' + item['title_' + param['by']]));

          var $l = $('<ul/>', {'class': 'list-inline'}).append(
            $('<li/>').append($('<a/>', {'href': item['url']}).text('Abstract link')),
            $('<li/>').append($('<a/>', {'href': item['pdf']}).text('Full Text')),
            $('<li/>').append($('<a/>', {'href': item['url']}).text('摘要')),
            $('<li/>').append($('<a/>', {'href': item['pdf']}).text('全文'))
          );

          var $p = $('<div/>', {'class': 'list-group-item-text'})
                .append($('<p/>').text('摘要 (Abstract): ' + item['abstract_' + param['by']]));

          var $d = $('<div/>', {
            'class': 'list-group-item',
            'id': item['doi'].replace(/\//g, '-')})
                .append(
                  $('<table/>')
                    .append($('<tr/>').append(
                      $('<td/>', {'style': 'padding-right: 20px; vertical-align: top;'}).text(i + 1),
                      $('<td/>').append($r, $t, $l, $p))));

          $list.append($d);
        });

      });

    } else {

      $.getJSON(evil + 'articles.json', function(data) {

        articles = data.slice();

        var $list = $('#article-list').html('');
        $.each(articles, function(i, item) {
          var $r = $('<small/>').html(item['citation']);
          var $t = $('<div/>', {'class': 'list-group-item-heading'})
                .append(
                  $('<h3/>')
                    .text(item['title'])
                    .append($('<a/>', {
                      'href': 'http://dx.doi.org/' + item['doi'],
                      'style': 'margin-left: 10px'})
                            .append($('<span/>', {'class': 'glyphicon glyphicon-link'}))),
                  $('<h3/>')
                    .text(item['title_' + param['by']])
                );
          var $p = $('<div/>', {'class': 'list-group-item-text'})
                .append($('<p/>').text(item['abstract']),
                        $('<p/>').text(item['abstract_' + param['by']]));

          var $d = $('<div/>', {
            'class': 'list-group-item',
            'id': item['doi'].replace(/\//g, '-')})
                .append(
                  $('<table/>')
                    .append($('<tr/>').append(
                      $('<td/>', {'style': 'padding-right: 20px; vertical-align: top;'}).text(i + 1),
                      $('<td/>').append($r, $t, $p))));

          $list.append($d);
        });

      });

    }

  } else {

    if (evil) {

      $.getJSON(evil + 'articles.json', function(data) {

        articles = data.slice();

        var $list = $('#article-list').html('');
        $.each(articles, function(i, item) {
          var $r = $('<p/>').html(item['citation']);
          var $l = $('<ul/>', {'class': 'list-inline'}).append(
            $('<li/>').append($('<a/>', {'href': item['url']}).text('Abstract link')),
            $('<li/>').append($('<a/>', {'href': item['pdf']}).text('Full Text'))
          );
          var $p = $('<div/>', {'class': 'list-group-item-text'})
                .append($('<p/>').html('<b>Abstract</b>: ' + item['abstract']));

          var $d = $('<div/>', {
            'class': 'list-group-item',
            'id': item['doi'].replace(/\//g, '-')})
                .append(
                  $('<table/>')
                    .append($('<tr/>').append(
                      $('<td/>', {'style': 'padding-right: 20px; vertical-align: top;'}).text(i + 1),
                      $('<td/>').append($r, $l, $p))));
          $list.append($d);
        });

        if (window.location.hash)
          $('body').scrollTo(window.location.hash);

      });

    } else {

      $.getJSON(evil + 'articles.json', function(data) {

        var perpage = 20;
        var tot = parseInt(Math.ceil(data.length * 1. / perpage));

        for (var i = 0; i < tot; ++i)
          articles.push(data.slice(i * perpage, (i+1) * perpage));

        var $list = $('#article-list');

        $('#pagination').twbsPagination({
          totalPages: tot - 1,
          onPageClick: function (event, page) {
            loadpagei(page);
          }
        });

        loadpagei(1);

      });

      $('body').on('click', function (e) {
        $('[data-original-title]').each(function () {
          if (!$(this).is(e.target) &&
              $(this).has(e.target).length === 0 &&
              $('.popover').has(e.target).length === 0) {
            $(this).popover('hide');
          }
        });
      });

    }

  }

});

})(jQuery);
