//can we get rid of this?//
// $(() => {
//   $.ajax({
//     method: "GET",
//     url: "/api/users"
//   }).done((users) => {
//     for(user of users) {
//       $("<div>").text(user.name).appendTo($("body"));
//     }
//   });;
// });

//fetchesIP, gets coordinates//\
//and uses them to find the nearest city with Google Geocoder api//

document.addEventListener('DOMContentLoaded', function() {
  $.get(`https://api.ipify.org?format=json`, function(data) {
    const ip = data.ip;

    $.get(`http://api.ipstack.com/${ip}?access_key=51ad6577289c9e4bc0315e9b521df4d2`, function(data, status) {

      const response = data;
      lat = response.latitude;
      long = response.longitude;
      city = response.city;

      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDPZzw7P0JN6ARr7TgqwufNUP-Vf-2jOc8&callback=initMap';
      script.defer = true;
      script.async = true;

      let map;
      window.initMap = function() {
        const geocoder = new google.maps.Geocoder();
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 0, lng: 0},
          zoom: 12
        });
        geocoder.geocode({'address': city}, function(results, status) {
          if (status === 'OK') {
            map.setCenter(results[0].geometry.location);
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });

      };
      document.head.appendChild(script);
    });
  });
});
