var home = 'https://rawgit.com/malachai0/pages/gitcafe-pages/README.md'

var query = location.search.substring('1').split('&')
var params = {}
for (var i in query) {
  var key = query[i].split('=')[0],
    value = query[i].split('=')[1]
  params[key] = value
}

var url = params.url || location.hash.substring(2) || home
url = (url.indexOf('://') == -1) ? 'http://' + url : url

var fn = function() {
  qwest.get(url).then(function(data) {
    var $content = document.getElementById('content')
    if (!data) {
      return (document.getElementById('loading').innerHTML = 'not found')
    }
    var html = marked(data);
    var title = strip_tags(html.split('\n')[0])
   $content.innerHTML = html;
    document.title = title
  })
}

;(function(fn) {
  if (document.readyState != 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
})(fn);

function strip_tags(input, allowed) {
  allowed = (((allowed || '') + '')
      .toLowerCase()
      .match(/<[a-z][a-z0-9]*>/g) || [])
    .join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
    commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  return input.replace(commentsAndPhpTags, '')
    .replace(tags, function($0, $1) {
      return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
    });
}
