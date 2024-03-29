var points = #{points};

var myLatlng = new google.maps.LatLng(48.922499263758255, 6.6796875);
var myOptions = {
  zoom: 2,
  center: myLatlng,
  mapTypeId: google.maps.MapTypeId.ROADMAP
}
// var mapCan = document.getElementById('map');
var map = new google.maps.Map(document.getElementById("map"), myOptions);

var markers = makeMarkers(points);



// var marker = new google.maps.Marker({
//     position: myLatlng,
//     map: map,
//     title:"Hello World!"
// });
var infowindow = null;
/* now inside your initialise function */
infowindow = new google.maps.InfoWindow({
  content: "holding..."
});


for (var i = 0; i < markers.length; i++) {
  var marker = markers[i];
  google.maps.event.addListener(marker, 'click', function () {
    // where I have added .html to the marker object.
    infowindow.setContent(this.html);
    infowindow.open(map, this);
  });
}

function makeMarkers (points) {
  var markers = [];
  for (var key in points) {
    var mark = new google.maps.Marker({
      position: new google.maps.LatLng(points[key].lat, points[key].long),
      map: map,
      title:key,
      html:(points[key].path + '/' + key)
    });
    markers.push(mark);
  }
  return markers;
}

