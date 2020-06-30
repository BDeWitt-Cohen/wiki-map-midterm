
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

document.addEventListener('DOMContentLoaded', function() {
  $.get(`https://api.ipify.org?format=json`, function(data) {
    const ip = data.ip;

    $.get(`http://api.ipstack.com/${ip}?access_key=51ad6577289c9e4bc0315e9b521df4d2`, function(data, status) {

      const response = data;
      lat = response.latitude;
      long = response.longitude;
      city = response.city;

      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDPZzw7P0JN6ARr7TgqwufNUP-Vf-2jOc8&libraries=places&callback=initMap';
      script.defer = true;
      script.async = true;

      let map;
      let markers = [];
      const mapPins = [];
      window.initMap = function() {
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
        geocoder.geocode({ 'address': city }, function(results, status) {
          if (status === 'OK') {
            map.setCenter(results[0].geometry.location);
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });

        //Render all map titles client side
        $("#all-maps-btn").hover(()=>{
          $('#all-maps').empty();
          $('#my-map-container').empty();
          $("#favorite-map-container").empty();
          $.get("/api/maps", function(req, res) {
            const maps = req.maps;
            for (const map of maps) {

              if(!(map.user_id == req.user)){

                $('#all-maps').append(`<button type="button" class="map_title" id="${map.id}"> ${map.title}  </button>`);

                //sets event handler for each map title in drop down mymaps
               $(`#${map.id}`).on('click', function() {
                  $.get(`/api/pins/${map.id}`, function(req, res) {
                    dropPins(req);
                    $('#mySidebar').empty();
                   $('#map-description').empty();
                    const pins = req.pins;
                   for (const pin of pins) {
                      $('#mySidebar').append(`<button class="pin_title"> ${pin.name} ${pin.description} </button`);
                    }
                    $.get(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?query=${map.title}&key=AIzaSyDPZzw7P0JN6ARr7TgqwufNUP-Vf-2jOc8`, function(req, res) {

                      let image;
                      if (req.results[0] !== undefined && req.results[0].photos !== undefined) {
                        image = req.results[0].photos[0].photo_reference;
                      } else {
                        image = 'CmRaAAAAvE6JP2ouTx7OnGX_Lzhrw-CrDzgg8EZnFV8qxrr7xE4chG-VKEhByBULwh0BUt9NcGAf2oVXdqPfqi2YQ3-TuxtznAiHeC9H7JlsK2QB9gYdDjUU569BCJQjS5JP-D1jEhBhvJDmoOXymD3htf9dngILGhSjk5PDgj9SftWxofRq4_pVa2Vc7w';
                      };
                      $('#map-description').append(`
                         <div class="header" id="map-desc-header">
                         <h3 class="description-header">${map.title}</h3>
                        <div id="num-likes"> 3</div>
                        </div>
                        <div class="map-image">
                    <img id="picto" src=https://maps.googleapis.com/maps/api/place/photo?photoreference=${image}&sensor=false&maxheight=200&maxwidth=200&key=AIzaSyDPZzw7P0JN6ARr7TgqwufNUP-Vf-2jOc8>
                    </div>
                    <div class="row" class="description-content">
                      <p> ${map.description}<p>
                    </div>
                    <div class="maps-footer">
                      <button class="add-favorite" class="footer-buttons"> &hearts;</button>
                       <button class="suggest-pin" class="footer-buttons">Suggest Pin</button>

                    </div>`);
                  })
                })
              })
            }
            }
          })
        });
        //Render all my map titles client side
        $("#my-maps").hover(() => {
          $('#all-maps').empty();
          $('#my-map-container').empty();
          $("#favorite-map-container").empty();
          $.get("/api/maps/user_id", function(req, res) {
            const maps = req.maps;
            for (const map of maps) {
              $('#my-map-container').append(`<button type="button" class="map_title" id="${map.id}"> ${map.title}  </button>`);

              //sets event handler for each map title in drop down mymaps
              $(`#${map.id}`).on('click', function() {
                $.get(`/api/pins/${map.id}`, function(req, res) {
                  dropPins(req);
                  $('#mySidebar').empty();
                  $('#map-description').empty();

                  const pins = req.pins;
                  for (const pin of pins) {
                    $('#mySidebar').append(`<button class="pin_title"> ${pin.name} ${pin.description} </button`);
                  }
                  $.get(`/api/favs`, function (req, res) {
                    numFavs = req.favs[0].count
                    console.log(numFavs);


                  $.get(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?query=${map.title}&key=AIzaSyDPZzw7P0JN6ARr7TgqwufNUP-Vf-2jOc8`, function(req, res) {

                    let image;
                    if (req.results[0] !== undefined && req.results[0].photos !== undefined) {
                      image = req.results[0].photos[0].photo_reference;
                    } else {
                      image = 'CmRaAAAAvE6JP2ouTx7OnGX_Lzhrw-CrDzgg8EZnFV8qxrr7xE4chG-VKEhByBULwh0BUt9NcGAf2oVXdqPfqi2YQ3-TuxtznAiHeC9H7JlsK2QB9gYdDjUU569BCJQjS5JP-D1jEhBhvJDmoOXymD3htf9dngILGhSjk5PDgj9SftWxofRq4_pVa2Vc7w';
                    };
                    $('#map-description').append(`
                    <div class="header" id="map-desc-header">
                      <h3 class="description-header">${map.title}</h3>
                    <div id="num-likes"> ${numFavs}</div>
                    </div>
                    <div class="map-image">
                    <img id="picto" src=https://maps.googleapis.com/maps/api/place/photo?photoreference=${image}&sensor=false&maxheight=200&maxwidth=200&key=AIzaSyDPZzw7P0JN6ARr7TgqwufNUP-Vf-2jOc8>
                    </div>
                    <div class="row" class="description-content">
                      <p> ${map.description}<p>
                    </div>
                    <div class="maps-footer">
                    <button class="edit-button" class="footer-buttons"> Edit </button>
                    <button class="add-pins" class="footer-buttons">Add Pins</button>

                    </div>`);
                    //Just a listener for edit-button, nothing implemented yet
                    $('#map-description').on('click', '.edit-button', function() {
                      alert("the edit map button was clicked") //
                      console.log("alert");
                    })


                  })
                })
                });

              });

            }
          });
        })

        //render favorite maps
        $("#favorite-map").hover(()=>{
          $('#all-maps').empty();
          $("#favorite-map-container").empty();
          $("#favorite-map-container").append('<div id="favorite-dropdown-container"><div class="map-container" id="fav-map-container"></div></div>')

          //get request for all favorite maps
          $.get("/api/maps/favorites", function(req, res) {
            const maps = req.maps;
            for (const map of maps) {
              $('#fav-map-container').append(`<button type="button" class="map_title" id="${map.id}"> ${map.title}  </button>`);

              //sets event handler for each map title in drop down mymaps
              $(`#${map.id}`).on('click', function() {
                $.get(`/api/pins/${map.id}`, function(req, res) {
                  dropPins(req);
                  $('#mySidebar').empty();
                  $('#map-description').empty();
                  const pins = req.pins;
                  for (const pin of pins) {
                    $('#mySidebar').append(`<button class="pin_title"> ${pin.name} ${pin.description} </button`);
                  }
                  $.get(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?query=${map.title}&key=AIzaSyDPZzw7P0JN6ARr7TgqwufNUP-Vf-2jOc8`, function(req, res) {

                    let image;
                    if (req.results[0] !== undefined && req.results[0].photos !== undefined) {
                      image = req.results[0].photos[0].photo_reference;
                    } else {
                      image = 'CmRaAAAAvE6JP2ouTx7OnGX_Lzhrw-CrDzgg8EZnFV8qxrr7xE4chG-VKEhByBULwh0BUt9NcGAf2oVXdqPfqi2YQ3-TuxtznAiHeC9H7JlsK2QB9gYdDjUU569BCJQjS5JP-D1jEhBhvJDmoOXymD3htf9dngILGhSjk5PDgj9SftWxofRq4_pVa2Vc7w';
                    };
                    $('#map-description').append(`
                    <div class="header" id="map-desc-header">
                      <h3 class="description-header">${map.title}</h3>
                    <div id="num-likes"> 3</div>
                    </div>
                    <div class="map-image">
                    <img id="picto" src=https://maps.googleapis.com/maps/api/place/photo?photoreference=${image}&sensor=false&maxheight=200&maxwidth=200&key=AIzaSyDPZzw7P0JN6ARr7TgqwufNUP-Vf-2jOc8>
                    </div>
                    <div class="row" class="description-content">
                      <p> ${map.description}<p>
                    </div>
                    <div class="maps-footer">
                    <button class="edit-button" class="footer-buttons"> Edit </button>
                    <button class="add-pins" class="footer-buttons">Add Pins</button>

                    </div>`);
                  })
                });
              });

            }
          });


        })

        $.get("/api/pins", function(req, res) {
          const pins = req.pins;
          for (const pin of pins) {
            $('#mySidebar').append(`<button class="pin_title"> ${pin.name} </button`)
          }
        });

        const dropPins = function(obj) {
          clearMarkers();
          renderMapPins(obj);
        };

        const badDirector = function(coordinate) {
          let coord = coordinate;
          let randonNum = Math.random();
          let smallerNum = randonNum / 300;
          if (Math.random() < .5) {
            coord -= smallerNum;
          } else {
            coord += smallerNum;
          }
          return coord;
        };

        //supporting functions
        // renders pins on map
        const renderMapPins = function(obj) {
          let time = 200;
          let bounds = new google.maps.LatLngBounds();
          for (const pin of obj.pins) {
            time += 250;
            const newLat = badDirector(pin.lat);
            const newLong = badDirector(pin.long);
            let myLatlng = new google.maps.LatLng(newLong, newLat);
            bounds.extend(myLatlng);
            window.setTimeout(function() {
              markers.push(new google.maps.Marker({
                position: myLatlng,
                title: `${pin.name}`,
                map: map,
                animation: google.maps.Animation.DROP
              }));
            }, time);
          }
          map.fitBounds(bounds, { top: 150, bottom: 150, left: 50, right: 50 });
        };

        const clearMarkers = function() {
          for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
          }
          markers = [];
        };
        google.maps.event.addDomListener(window, 'load', function() {
          var places = new google.maps.places.Autocomplete(document.getElementById('location'));
          google.maps.event.addListener(places, 'place_changed', function() {
            var place = places.getPlace();
            var address = place.formatted_address;
            var latitude = place.geometry.location.A;
            var longitude = place.geometry.location.F;
            var mesg = "Address: " + address;
            mesg += "\nLatitude: " + latitude;
            mesg += "\nLongitude: " + longitude;
            alert(mesg);
          });
        });

      };
      document.head.appendChild(script);
    });
  });
});

const openNav = function() {
  document.getElementById("mySidebar").style.width = "250px";
  document.getElementById("main").style.marginLeft = "0px";
};

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
const closeNav = function() {
  document.getElementById("mySidebar").style.width = "0";
  // document.getElementById("mySidebar").style.marginLeft = "0";
  // $("#mySideBar").show("slide", { direction: "left" }, 1000);
};

let sidebarIsOpened = false;
//will change later
$('#mySidebar').on('click', function() {
  closeNav();
  sidebarIsOpened = false;
});


$('.openbtn').on('click', function() {
  if (sidebarIsOpened) {
    closeNav();
    sidebarIsOpened = false;
  } else {
    openNav();
    sidebarIsOpened = true;
  }
});


$(`#create-map`).on('click', function() {
  // alert("the create map button was clicked")
  $("#map").append(`<div>
  <form  id="create-map-form">
  <div id="submit-form-content">
  <label for="map-name">Map Name</label>
      <textarea id="test-name" rows="1" cols="45" placeholder="What's a cool map name"></textarea><br>
        <label for="map-desc">Description</label>
        <textarea id="test-desc"  rows="4" cols="25" placeholder="Enter some deets about your new cool map"></textarea>
       <br>
      <label for="first-pin">Where's your first pin?</label>
     <textarea id="test-pin" rows="1" cols="25" placeholder="Enter your first pin"></textarea>
    </div>
  <div id="submit-form-buttons">
    <input type="submit" value="Create Map" id="submit-new-map">
    <input type="submit" value="Drop Pin" id="drop-pin">
   <button id="exit-map-creation">Cancel</button>
  </div>
    </form>
   </div>`)
  let tryingToExit = false;
  $("#exit-map-creation").click(function(event) {
    $("#create-map-form").hide();
    tryingToExit = true;
  })
  $("#create-map-form").submit(function(event) {
    if (tryingToExit) {
      $("#create-map-form").hide();
    } else {
    const mapName = $("#test-name").val()
    const mapDesc = $("#test-desc").val()
    const mapFirstPin = $("#test-pin").val().split(' ');
    const long = mapFirstPin[0];
    const lat = mapFirstPin[1];
      event.preventDefault();
      if (!(mapName) && !(mapDesc)) {
        alert('hold up please type something in');
      } else if (!mapName) {
        alert('hold up please give your map a title');
      } else if (!mapDesc) {
        alert('hold up please give your map a description');
      }
      else {
        const newMapObj = { mapName, mapDesc }

        $.post("/api/maps/post", newMapObj, (res)=>{
          const newMapId = res.maps[0].id;
          $.post("/api/pins/post", {long, lat, newMapId})
        })

        $("#create-map-form").hide();
      }
    }

  })


})

$(() => {

  $('.edit-button').on('click', function() {
    alert("the edit map button was clicked")
    console.log("alert");
  })

})




