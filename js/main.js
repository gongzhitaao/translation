(function($, undefined){

var articles = [];
var Provider = [
  {'name': 'Microsoft', 'abbr': 'ms'},
  {'name': 'Google', 'abbr': 'gl'},
  {'name': 'Auburn', 'abbr': 'zh'}
];

function mkcontent(i) {
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
        .append($('<h4/>').text(articles[i]['title_' + Provider[j]['abbr']]),
                $('<p/>').text(articles[i]['abstract_' + Provider[j]['abbr']]))
    );
  }
  $('div', $cont).first().addClass('active');

  var $div = $('<div/>', {'role': 'tabpanel'})
        .append($ul, $cont);
  return $div.html();
}

$(document).ready(function() {

  $.getJSON('articles.json', function(data) {

    articles = data.slice();

    var $list = $('#article-list');

    $.each(articles, function(i, item){
      var $t = $('<h3/>', {'class': 'list-group-item-heading'})
            .text(item['title'])
            .append($('<a/>', {
              'href': item['url'],
              'style': 'margin-left: 10px'})
                    .append($('<span/>', {'class': 'glyphicon glyphicon-link'})));
      var $p = $('<p/>', {'class': 'list-group-item-text'})
            .text(item['abstract']);
      var $d = $('<div/>', {'class': 'list-group-item'})
            .append($('<div/>', {
              'id': 'article-' + i,
              'data-original-title': ''})
                    .append($t, $p)
                    .popover({
                      'html': true,
                      'title': '中文翻译',
                      'toggle': 'focus',
                      'placement': 'bottom',
                      'content': function() {return mkcontent(i);}}));
      $list.append($d);
    });
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
});

})(jQuery);
