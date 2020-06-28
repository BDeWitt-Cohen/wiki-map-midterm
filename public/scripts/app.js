

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

      const CustomMapStyles = [
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi.business",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "landscape",
          "stylers": [
            {
              "hue": "#FFBB00"
            },
            {
              "saturation": 43.400000000000006
            },
            {
              "lightness": 37.599999999999994
            },
            {
              "gamma": 1
            }
          ]
        },
        {
          "featureType": "road.highway",
          "stylers": [
            {
              "hue": "#FFC200"
            },
            {
              "saturation": -61.8
            },
            {
              "lightness": 45.599999999999994
            },
            {
              "gamma": 1
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "stylers": [
            {
              "hue": "#FF0300"
            },
            {
              "saturation": -100
            },
            {
              "lightness": 51.19999999999999
            },
            {
              "gamma": 1
            }
          ]
        },
        {
          "featureType": "road.local",
          "stylers": [
            {
              "hue": "#FF0300"
            },
            {
              "saturation": -100
            },
            {
              "lightness": 52
            },
            {
              "gamma": 1
            }
          ]
        },
        {
          "featureType": "water",
          "stylers": [
            {
              "hue": "#0078FF"
            },
            {
              "saturation": -13.200000000000003
            },
            {
              "lightness": 2.4000000000000057
            },
            {
              "gamma": 1
            }
          ]
        },
        {
          "featureType": "poi",
          "stylers": [
            {
              "hue": "#00FF6A"
            },
            {
              "saturation": -1.0989010989011234
            },
            {
              "lightness": 11.200000000000017
            },
            {
              "gamma": 1
            }
          ]
        }
      ];


      let map;
      window.initMap = function() {
        const geocoder = new google.maps.Geocoder();
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 0, lng: 0},
          zoom: 12,
          styles: CustomMapStyles,
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: true,
          streetViewControl: false,
          rotateControl: true,
          fullscreenControl: false
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


const openNav = function() {
  document.getElementById("mySidebar").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
};

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
const closeNav = function() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
};

$('#mySidebar').on('click', function() {
  closeNav();
});

$('.openbtn').on('click', function() {
  openNav();
});

$('.dropbtn').on('click', function() {
  console.log("hello world");
    let query = `SELECT * FROM maps;`
    console.log("this is query", query);
    db.query(query)
      .then(data => {
        const maps = data.rows;
        res.json({ maps });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      })
  })


