
//fetchesIP, gets coordinates//\
//and uses them to find the nearest city with Google Geocoder api//
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

document.addEventListener('DOMContentLoaded', function () {
  $.get(`https://api.ipify.org?format=json`, function (data) {
    const ip = data.ip;

    $.get(`http://api.ipstack.com/${ip}?access_key=51ad6577289c9e4bc0315e9b521df4d2`, function (data, status) {

      const response = data;
      lat = response.latitude;
      long = response.longitude;
      city = response.city;

      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDPZzw7P0JN6ARr7TgqwufNUP-Vf-2jOc8&callback=initMap';
      script.defer = true;
      script.async = true;




      let map;
      let markers = [];
      const mapPins = [];
      window.initMap = function () {
        const geocoder = new google.maps.Geocoder();
        map = new google.maps.Map(document.getElementById('map'), {
          center: { lat: 0, lng: 0 },
          zoom: 12,
          styles: CustomMapStyles,
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: true,
          streetViewControl: false,
          rotateControl: true,
          fullscreenControl: false
        });
        geocoder.geocode({ 'address': city }, function (results, status) {
          if (status === 'OK') {
            map.setCenter(results[0].geometry.location);
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });

        //Render map titles client side
        $.get("/api/maps", function (req, res) {
          const maps = req.maps
          for (const map of maps) {
            $('#map-container').append(`<button type="button" class="map_title" id="${map.id}"> ${map.title}  </button>`);

            //sets event handler for each map title in drop down mymaps
            $(`#${map.id}`).on('click', function () {
              $.get(`/api/pins/${map.id}`, function (req, res) {
                dropPins(req);
                $('#mySidebar').empty();
                $('#map-description').empty();
                const pins = req.pins
                for (const pin of pins) {
                  $('#mySidebar').append(`<button class="pin_title"> ${pin.name} ${pin.description} </button`)

                }
                $('#map-description').append(`<div id="map-title"><p>${map.title}</p> <p>${map.description}</p> </div>`)
              })
            })
          }
        })

        $.get("/api/pins", function (req, res) {
          const pins = req.pins
          for (const pin of pins) {
            $('#mySidebar').append(`<button class="pin_title"> ${pin.name} </button`)
          }
        })

        const dropPins = function(obj) {
          clearMarkers();
          renderMapPins(obj);
        };

        const badDirector = function(coordinate) {
          let coord = coordinate;
          let randonNum = Math.random();
          let smallerNum = randonNum / 300;
          if (Math.random() < .5) {
            coord = coord - smallerNum;
          } else {
            coord = coord + smallerNum;
          }
          return coord;
        };

        //supporting functions
        // renders pins on map
        const renderMapPins = function(obj) {
          let time = 200;
          let bounds = new google.maps.LatLngBounds();
          for (const pin of obj.pins) {
            time += 200;
            const newLat = badDirector(pin.lat);
            const newLong = badDirector(pin.long);
            console.log(newLat, newLong)
            let myLatlng = new google.maps.LatLng(newLong, newLat);
            bounds.extend(myLatlng);
            window.setTimeout(function() {
              markers.push(new google.maps.Marker({
                position: myLatlng,
                title:`${pin.name}`,
                map: map,
                animation: google.maps.Animation.DROP
              }))
            }, time);
          }
          map.fitBounds(bounds, {top: 150, bottom: 150, left:50, right: 50});
        }

        const clearMarkers = function() {
          for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
          }
          markers = [];
        }

      };
      document.head.appendChild(script);
    });
  });
});

const openNav = function () {
  document.getElementById("mySidebar").style.width = "250px";
  document.getElementById("main").style.marginLeft = "0px";
};

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
const closeNav = function () {
  document.getElementById("mySidebar").style.width = "0";
  // document.getElementById("mySidebar").style.marginLeft = "0";
  // $("#mySideBar").show("slide", { direction: "left" }, 1000);
};

let sidebarIsOpened = false;
//will change later
$('#mySidebar').on('click', function () {
  closeNav();
  sidebarIsOpened = false;
});


$('.openbtn').on('click', function () {
  if (sidebarIsOpened) {
    closeNav();
    sidebarIsOpened = false;
  } else {
    openNav();
    sidebarIsOpened = true;
  }
});


// //Render map titles client side
// $.get("/api/maps", function (req, res) {
//   const maps = req.maps
//   for (const map of maps) {
//     $('#map-container').append(`<button type="button" class="map_title" id="${map.id}"> ${map.title}  </button>`);

    //sets event handler for each map title in drop down mymaps
//     $(`#${map.id}`).on('click', function () {
//       $.get(`/api/pins/${map.id}`, function (req, res) {
//         renderMapPins(req)
//         $('#mySidebar').empty();
//         $('#map-description').empty();
//           const pins = req.pins
//           for (const pin of pins) {
//             $('#mySidebar').append(`<button class="pin_title"> ${pin.name} ${pin.description} </button`)

//           }
//           $('#map-description').append(`<div id="map-title"><p>${map.title}</p> <p>${map.description}</p> </div>`)
//       })
//     })
//   }
// })

//Could replace CSS animations
// $("#mySidebar").click(function () {
//   $(this).show("slide", { direction: "left" }, 1000);
// });

// $.get("/api/pins", function (req, res) {
//   const pins = req.pins
//   for (const pin of pins) {
//     $('#mySidebar').append(`<button class="pin_title"> ${pin.name} </button`)
//   }

// })



// //supporting functions
// // renders pins on map
// const renderMapPins = function(obj){
//   for(const pin of obj.pins){
//     console.log(pin);
//     const newLat = pin.lat
//     const newLong = pin.long
//     let myLatlng = new google.maps.LatLng(newLong, newLat);
//     new google.maps.Marker({
//       position: myLatlng,
//       title:`${pin.name}`,
//       map: map,
//       animation: google.maps.Animation.DROP
//     });

//   }

// }

