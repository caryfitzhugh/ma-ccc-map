var ViewUtils = {
  to_month_name: function (v) {
    var months =  {
     1: "January",
     2: "February",
     3: "March",
     4: "April",
     5: "May",
     6: "June",
     7: "July",
     8: "August",
     9: "September",
     10:"October",
     11:"November",
     12:"December"};
     return months[parseInt(v,10)];
  },
  shorten_string: function (s, l, reverse){
    var stop_chars = [' ','/', '&'];
    var acceptable_shortness = l * 0.80; // When to start looking for stop characters
    var reverse = typeof(reverse) != "undefined" ? reverse : false;
    var s = reverse ? s.split("").reverse().join("") : s;
    var short_s = "";

    for(var i=0; i < l-1; i++){
        short_s += s[i];
        if(i >= acceptable_shortness && stop_chars.indexOf(s[i]) >= 0){
            break;
        }
    }
    if(reverse){ return short_s.split("").reverse().join(""); }
    return short_s;
  },
  shorten_url: function (url, l){
    var l = typeof(l) != "undefined" ? l : 50;
    var chunk_l = (l/2);
    if (url && url.length > 0) {
      var url = url.replace("http://","").replace("https://","");

      if(url.length <= l){ return url; }

      var start_chunk = ViewUtils.shorten_string(url, chunk_l, false);
      var end_chunk = ViewUtils.shorten_string(url, chunk_l, true);
      return start_chunk + ".." + end_chunk;
    } else {
      return url;
    }
  }
};
