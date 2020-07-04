let activeMap;
let boxExists = false;
let autocomplete;
let pinTitle = null;
let previousMarker = null;
let pinsExist = false;
let bounds;
let randomMarker = null;
const CustomMapStyles = [
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "poi.business",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text",
    "stylers": [{ "visibility": "on" }]
  },
  {
    "featureType": "road.local",
    "elementType": "labels",
    "stylers": [{ "visibility": "on" }]
  },
  {
    "featureType": "landscape",
    "stylers": [{ "hue": "#FFBB00" },
      { "saturation": 43.400000000000006 },
      { "lightness": 37.599999999999994 },
      { "gamma": 1 }]
  },
  {
    "featureType": "road.highway",
    "stylers": [{ "hue": "#FFC200" },
      { "saturation": -61.8 },
      { "lightness": 45.599999999999994 },
      { "gamma": 1 }]
  },
  {
    "featureType": "road.arterial",
    "stylers": [{ "hue": "#FF0300" },
      { "saturation": -100 },
      { "lightness": 51.19999999999999 },
      { "gamma": 1 }]
  },
  {
    "featureType": "road.local",
    "stylers": [{ "hue": "#FF0300" },
      { "saturation": -100 },
      { "lightness": 52 },
      { "gamma": 1 }]
  },
  {
    "featureType": "water",
    "stylers": [{ "hue": "#0078FF" },
      { "saturation": -13.200000000000003 },
      { "lightness": 2.4000000000000057 },
      { "gamma": 1 }]
  },
  {
    "featureType": "poi",
    "stylers": [{ "hue": "#00FF6A" },
      { "saturation": -1.0989010989011234 },
      { "lightness": 11.200000000000017 },
      { "gamma": 1 }]
  }
];

//Escape function for invalid characters and malicious code
const escape = function(str) {
  let div = document.createElement('div');

  div.appendChild(document.createTextNode(str));

  return div.innerHTML;
};

//Creates full map
const createMapBox = function(map, key) {
  if (!boxExists) {
    boxExists = true;
    setTimeout(()=> {
      boxExists = false;
    }, 200);
    activeMap = map;
    $.get(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?query=${map.title}&key=${key}`, function(req, res) {
      let image;
      $('#map-description').css({ 'padding': '14px', 'padding-bottom': '40px' });
      if (req.results[0] !== undefined && req.results[0].photos !== undefined) {
        image = `https://maps.googleapis.com/maps/api/place/photo?photoreference=${req.results[0].photos[0].photo_reference}&sensor=false&maxheight=200&maxwidth=200&key=${key}`;
      } else {
        image = `https://loremflickr.com/200/200/${map.title}`;
      }

      $.get(`/api/favs/${map.id}`, function(req, res) {
        numFavs = req.favs[0].count;
        let headerButton;
        if (map.user_id == req.user_id.user_id) {
          headerButton = `<div id="header-buttons"> <button id="delete-map" class="footer-buttons">Delete Map</button>
        <button id="add-pins" class="footer-buttons">Add a spot</button>

        </div>`;
        } else {
          headerButton = '<div></div>';
        }
        $('#map-description').append(`
      <div class="header" id="map-desc-header">
      <h3 class="description-header">${map.title}</h3>
      ${headerButton}
    </div>
      <div class="map-image">
      <img id="picto" src=${image}>
      </div>
      <div class="row" class="description-content">
        <p> ${map.description}<p>
      </div>
      <div class="maps-footer">
        <span class="fa-stack-1x">
        <span id="wow" class="far fa-heart fa-stack-2x"></span>
        <strong id="crazy" class="fa-stack" style="font:10px">
      ${numFavs}
       </strong>
        </span>
        <div></div>
      </div>`);
        $('#crazy').on('mouseover', () => {
          $('#crazy').css('color', 'red');
          $('#wow').css('color', 'red');
        });
        $('#crazy').on('mouseout', () => {
          $('#crazy').css('color', 'tomato');
          $('#wow').css('color', 'tomato');
        });
        $(`#map-description`).off();

        //Delete Maps
        $(`#map-description`).on(`click`, '#delete-map', function() {
          if (randomMarker !== null) {
            randomMarker.setMap(null);
          }
          $('#map').append(`
        <div id="delete-Mymap">
        <i id='x-3' class="fas fa-times"></i>
        <br>
          <div>
            <div id="delete-header">Are you sure you want to delete your map?</div>
         </div>
         <div id="delete-form-buttons">
          <button id="delete-map-button">Yes, Delete It!</button>
          </div>
        </div>`);
          $(`#delete-map-button`).on('click', function() {
            if (randomMarker !== null) {
              randomMarker.setMap(null);
            }
            $.post(`/api/maps/delete/${map.id}`);
            $("#map-description").empty();
            $('#map-description').css({ 'padding': '0px', 'padding-bottom': '0px' });
            $("#delete-Mymap").remove();
            location.reload();
          });
          $(`#x-3`).on('click', function() {
            $("#delete-Mymap").remove();
          });

        });


        $(`#map-description`).on(`click`, `.fa-stack`, function() {
          $.post(`/api/favs/post/${map.id}`, function(req, res) {
            $.get(`/api/favs/${map.id}`, function(req, res) {
              $('#crazy').empty()
              const count = req.favs[0].count;
              $('#crazy').append(`${count}`);
            });
          });
        });
      });

    });
  }
};

$.get(`/api/google`, function(data) {
  const key = data.key;
  $.get(`https://api.ipify.org?format=json`, function(data) {
    const ip = data.ip;

    $.get(`http://api.ipstack.com/${ip}?access_key=51ad6577289c9e4bc0315e9b521df4d2`, function(data, status) {

      const response = data;
      let userIpLat = response.latitude;
      let userIpLong = response.longitude;
      let city = response.city;

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&callback=initMap`;
      script.defer = true;
      script.async = true;

      let map;
      let markers = [];
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
        ///GET-LOST button functionality///
        google.maps.event.addListener(map, 'idle', function() {
          bounds =  map.getBounds();
        });

        $('#get-lost-btn').click(() => {
          if (randomMarker !== null) {
            randomMarker.setMap(null);
          }
          $.get(`https://api.quotable.io/random`, function(data) {
            let quote = data.content;
            let coords = getLostSpot(bounds);
            randomMarker = new google.maps.Marker({
              position: coords,
              map: map,
              animation: google.maps.Animation.DROP
            });
            map.panTo(randomMarker.position);
            google.maps.event.addListener(randomMarker, 'mouseover', function() {
              randomMarker.setAnimation(google.maps.Animation.BOUNCE);
            });
            google.maps.event.addListener(randomMarker, 'mouseout', function() {
              randomMarker.setAnimation(google.maps.Animation.NULL);
            });
            google.maps.event.addListener(randomMarker, 'click', function() {
              let infoWindow = new google.maps.InfoWindow ({
                content: `<div id="pin-content">${quote}</div>`
              });
              map.panTo(randomMarker.position);
              infoWindow.open(map, randomMarker);
            });
          });
        });

        const getLostSpot = function(bounds) {
          let lat_min = bounds.getSouthWest().lat(),
            lat_range = bounds.getNorthEast().lat() - lat_min,
            lng_min = bounds.getSouthWest().lng(),
            lng_range = bounds.getNorthEast().lng() - lng_min;

          return new google.maps.LatLng(lat_min + (Math.random() * lat_range),
            lng_min + (Math.random() * lng_range));
        };
        ///

        //Render all map titles client side
        $("#all-maps-btn").on('mouseover', () => {
          $('#all-maps').empty();
          $('#my-map-container').empty();
          $("#favorite-map-container").empty();
          $.get("/api/maps", function(req, res) {
            const maps = req.maps;
            for (const map of maps) {
              if (!(map.user_id == req.user)) {
                // if(req.user_id)
                $('#all-maps').append(`<button type="button" class="map_title" id="${map.id}"> ${map.title}  </button>`);

                //sets event handler for each map title in drop down mymaps
                $(`#${map.id}`).on('click', function() {
                  if (randomMarker !== null) {
                    randomMarker.setMap(null);
                  }
                  $.get(`/api/pins/${map.id}`, function(req, res) {
                    $('#mySidebar').empty();
                    $('#map-description').empty();
                    const pins = req.pins;
                    for (const pin of pins) {
                      $('#mySidebar').append(`<button id="${pin.id + 100}" class="pin_title"> ${pin.name} </button>`);
                    }
                    dropPins(req);
                    createMapBox(map, key);
                  });
                });
              }
            }
          });
        });
        // $("#all-maps-btn").on('mouseout', ()=>{
        //   $("#favorite-map-container").empty();
        // });
        //Render all map titles client side
        $("#my-maps").on('mouseover', () => {
          $('#all-maps').empty();
          $('#my-map-container').empty();
          $("#favorite-map-container").empty();
          $.get("/api/maps/user_id", function(req, res) {
            const maps = req.maps;
            for (const map of maps) {
              $('#my-map-container').append(`<button type="button" class="map_title" id="${map.id}"> ${map.title}  </button>`);

              //sets event handler for each map title in drop down mymaps
              $(`#${map.id}`).on('click', function() {
                if (randomMarker !== null) {
                  randomMarker.setMap(null);
                }
                $.get(`/api/pins/${map.id}`, function(req, res) {
                  $('#mySidebar').empty();
                  $('#map-description').empty();
                  const pins = req.pins;
                  for (const pin of pins) {
                    $('#mySidebar').append(`<div id="pin-box">
                    <button id="${pin.id + 100}" class="pin_title"> ${pin.name} </button>
                    <button id="${pin.id}" class="pin-delete "> <b X> </button
                    </div>`);
                    $(`#mySidebar`).on('click', `#${pin.id}`, function() {
                      if (!document.getElementById('delete-spot')) {
                        $(`#map`).append(`
                      <div id="delete-spot">
                      <i id='x-3' class="fas fa-times"></i>
                      <br>
                        <div>
                          <div id="delete-header">Are you sure you want to delete this spot?</div>
                       </div>
                       <div id="delete-form-buttons">
                        <button id="delete-spot-button">Yes, Delete It!</button>
                        </div>
                      </div>
                      `);
                        $(`#delete-spot`).on('click', `#delete-spot-button`, function() {
                          if (randomMarker !== null) {
                            randomMarker.setMap(null);
                          }
                          $.post(`/api/pins/delete/${pin.id}`);
                          $('#mySidebar').empty();
                          $("#delete-spot").remove();
                          $.get(`/api/pins/${map.id}`, function(req, res) {
                            const pins = req.pins;
                            for (const pin of pins) {
                              $('#mySidebar').append(`<div id="pin-box">
                          <button id="${pin.id + 100}" class="pin_title"> ${pin.name} </button>
                          <button id="${pin.id}" class="pin-delete "> <b X> </button
                          </div>`);
                            }

                          });
                          $.get(`/api/pins/${map.id}`, function(req, res) {
                            $('#mySidebar').empty();
                            $('#map-description').empty();
                            const pins = req.pins;
                            for (const pin of pins) {
                              $('#mySidebar').append(`<div id="pin-box">
                          <button id="${pin.id + 100}" class="pin_title"> ${pin.name} </button>
                          <button id="${pin.id}" class="pin-delete "> <b X> </button
                          </div>`);
                            }
                          });
                          dropPins(req);
                          createMapBox(map, key);
                        });
                        $(`#x-3`).click(function() {
                          $("#delete-spot").remove();
                        });
                      }
                    });
                  }
                  dropPins(req);
                  createMapBox(map, key);
                });
              });

            }
          });
        });

        //render favorite maps
        $("#favorite-map").on("mouseover", () => {
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
                if (randomMarker !== null) {
                  randomMarker.setMap(null);
                }
                $.get(`/api/pins/${map.id}`, function(req, res) {
                  $('#mySidebar').empty();
                  $('#map-description').empty();
                  const pins = req.pins;
                  for (const pin of pins) {
                    $('#mySidebar').append(`<button id="${pin.id + 100}" class="pin_title"> ${pin.name} </button`);
                  }
                  dropPins(req);
                  createMapBox(map, key);
                });
              });

            }
          });
        });

        const dropPins = function(obj) {
          if (!pinsExist) {
            pinsExist = true;
            setTimeout(()=> {
              pinsExist = false;
            }, 500);
            clearMarkers();
            renderMapPins(obj);
          }
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

        const renderMapPins = function(obj) {
          let time = 200;
          let bounds = new google.maps.LatLngBounds();
          const infoWindow = new google.maps.InfoWindow;
          for (const pin of obj.pins) {
            time += 250;
            const newLat = badDirector(pin.lat);
            const newLong = badDirector(pin.long);
            let myLatlng = new google.maps.LatLng(newLong, newLat);
            let extendLatlng = new google.maps.LatLng(newLong - 0.008, newLat - 0.008);
            bounds.extend(myLatlng);
            bounds.extend(extendLatlng);
            window.setTimeout(function() {
              const mark = new google.maps.Marker({
                position: myLatlng,
                title: `${pin.name}`,
                map: map,
                animation: google.maps.Animation.DROP
              });
              markers.push(mark);
              $(`#${pin.id + 100}`).on('mouseover', function() {
                mark.setAnimation(google.maps.Animation.BOUNCE);
              });
              $(`#${pin.id + 100}`).on('mouseout', function() {
                mark.setAnimation(google.maps.Animation.NULL);
              });
              google.maps.event.addListener(mark, 'mouseover', function() {
                mark.setAnimation(google.maps.Animation.BOUNCE);
              });
              google.maps.event.addListener(mark, 'mouseout', function() {
                mark.setAnimation(google.maps.Animation.NULL);
              });
              $(`#${pin.id + 100}`).on('click', function() {
                infoWindow.setContent(
                  `<div id="pin-content">
                  <div id="pin-title">${pin.name}<div>
                  <div><img id="picz" src=https://maps.googleapis.com/maps/api/streetview?size=120x120&location=${pin.long},${pin.lat}&radius=1000&key=${key}></div>
                  <div id="bodyContent">
                  ${pin.description}
                  </div>
                  </div>`
                );
                map.panTo({ lat: pin.long + 0.003, lng: pin.lat });
                infoWindow.open(map, mark);
                mark.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                  mark.setAnimation(google.maps.Animation.NULL);
                }, 1400);
              });
              google.maps.event.addListener(mark, 'click', function() {
                infoWindow.setContent(
                  `<div id="pin-content">
                  <div id="pin-title">${pin.name}<div>
                  <div><img id="picz" src=https://maps.googleapis.com/maps/api/streetview?size=120x120&location=${pin.long},${pin.lat}&radius=1000&key=${key}></div>
                  <div id="bodyContent">
                  ${pin.description}
                  </div>
                  </div>`
                );
                map.panTo({ lat: pin.long + 0.003, lng: pin.lat });
                infoWindow.open(map, mark);
                mark.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                  mark.setAnimation(google.maps.Animation.NULL);
                }, 1400);

              });
            }, time);

          }
          map.fitBounds(bounds, { top: 150, bottom: 150, left: 90, right: 90 });
        };

        const clearMarkers = function() {
          for (let i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
          }
          markers = [];
        };

        $(`#create-map`).on('click', function() {
          if (randomMarker !== null) {
            randomMarker.setMap(null);
          }
          // alert("the create map button was clicked")
          $("#map").append(`<div>
          <form  id="create-map-form">
          <i id='x-2' class="fas fa-times"></i>
          <div id="submit-form-content">
          <label for="map-name">Name Your Map</label>
              <textarea id="test-name" rows="1" cols="45" placeholder="Think of a cool map name"></textarea>
                <label for="map-desc">Description</label>
                <textarea id="test-desc"  rows="4" cols="25" placeholder="Enter some deets about your new cool map"></textarea>
              <label for="first-pin">What's your first spot?</label>
             <div id="theplace"><input id="test-pin" rows="1" cols="25" placeholder="Enter your first pin"></input></div>
             <div id=toggle ><label id="toggle-rules">drop a pin</label><i id="pin-drop" class="fas fa-toggle-off"></i></div>
             <label for="pins-desc">Give us a little info about it</label>
             <textarea rows="1" id="pin-desc" cols="25" placeholder="Enter your first pin"></textarea>
            </div>
          <div id="submit-form-buttons">
            <input type="submit" value="Create Map" id="submit-new-map">
          </div>
            </form>
           </div>`);

          const searchInput = 'test-pin';
          const defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(userIpLat, userIpLong),
            new google.maps.LatLng(userIpLat + 0.001, userIpLong + 0.001));



          autocomplete = new google.maps.places.Autocomplete((document.getElementById(searchInput)), {
            bounds: defaultBounds
          });
          google.maps.event.addListener(autocomplete, 'place_changed', function() {
            let near_place = autocomplete.getPlace();
            firstPinlong = near_place.geometry.location.lat();
            firstPinlat = near_place.geometry.location.lng();
            pinTitle = near_place.name;
          });

          $(`#x-2`).click(() => {
            $("#create-map-form").remove();
            google.maps.event.removeListener(clickMap);
            if (previousMarker !== null) {
              previousMarker.setMap(null);
            }
          });
          let clickMap;
          let dropMode = false;
          $('#pin-drop').click(() => {
            if (dropMode) {
              $("#pin-drop").css('color:tomato');
              $("#pin-drop").removeClass("fas fa-toggle-on");
              $("#pin-drop").addClass("fas fa-toggle-off");
              $("#pin-drop").css("color", "tomato");
              $("#test-pin").remove();
              $("#theplace").append(`<input id="test-pin" rows="1" cols="25" placeholder="Enter your first pin"></input>`);
              const searchInput = 'test-pin';
              if (previousMarker !== null) {
                previousMarker.setMap(null);
              };
              google.maps.event.removeListener(clickMap);
              const defaultBounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(userIpLat, userIpLong),
                new google.maps.LatLng(userIpLat + 0.001, userIpLong + 0.001));

              autocomplete = new google.maps.places.Autocomplete((document.getElementById(searchInput)), {
                bounds: defaultBounds
              });
              google.maps.event.addListener(autocomplete, 'place_changed', function() {
                let near_place = autocomplete.getPlace();
                firstPinlong = near_place.geometry.location.lat();
                firstPinlat = near_place.geometry.location.lng();
                pinTitle = near_place.name;
              });
              dropMode = false;
            } else {
              dropMode = true;
              $("#pin-drop").removeClass("fas fa-toggle-off");
              $("#pin-drop").addClass("fas fa-toggle-on");
              $("#pin-drop").css("color", "palegreen");
              $("#test-pin").remove();
              $("#theplace").append(`<textarea id="test-pin" rows="1" cols="25" placeholder="Give your spot a name"></textarea>`);
              const placeMarker = function(location) {
                if (previousMarker !== null) {
                  previousMarker.setMap(null);
                }
                previousMarker = new google.maps.Marker({
                  position: location,
                  map: map,
                  animation: google.maps.Animation.DROP
                });
              };
              clickMap = google.maps.event.addListener(map, 'click', function(event) {
                placeMarker(event.latLng);
                const myLatLng = event.latLng;
                firstPinlong = myLatLng.lat();
                firstPinlat = myLatLng.lng();
                pinTitle = 'Z';
              });
            }
          });

          $("#create-map-form").submit(function(event) {
            if (randomMarker !== null) {
              randomMarker.setMap(null);
            }
            google.maps.event.removeListener(clickMap);
            if (previousMarker !== null) {
              previousMarker.setMap(null);
            }
            const escapeMapName = $("#test-name").val();
            const mapName = escape(escapeMapName);
            const escapeMapDesc = $("#test-desc").val();
            const mapDesc = escape(escapeMapDesc);
            const escapePinDesc = $("#pin-desc").val();
            const pinDesc = escape(escapePinDesc);
            if (pinTitle === 'Z') {
              const escapePinTitle = $("#test-pin").val();
              pinTitle = escape(escapePinTitle);
            }
            if (!pinTitle || !mapDesc || !pinDesc) {
              alert('Slow down there buckaroo, please fill out all the fields!');
            } else {
              const newMapObj = { mapName, mapDesc };
              $.post("/api/maps/post", newMapObj, (res) => {
                event.preventDefault();
                const newMapId = res.maps[0].id;
                const newMap = res.maps[0];
                $.post("/api/pins/post", { pinTitle, firstPinlong, firstPinlat, newMapId, pinDesc },()=>{
                  event.preventDefault();
                });
                setTimeout (function() {
                  $.get(`/api/pins/${newMapId}`, function(req, res) {
                    $('#mySidebar').empty();
                    $('#map-description').empty();
                    const pins = req.pins;
                    for (const pin of pins) {
                      $('#mySidebar').append(`<div id="pin-box">
                          <button id="${pin.id + 100}" class="pin_title"> ${pin.name} </button>
                          <button id="${pin.id}" class="pin-delete "> <b X> </button
                          </div>`);
                      $(`#mySidebar`).on('click', `#${pin.id}`, function() {
                        if (!document.getElementById('delete-spot')) {
                          $(`#map`).append(`
                            <div id="delete-spot">
                            <i id='x-3' class="fas fa-times"></i>
                            <br>
                              <div>
                                <div id="delete-header">Are you sure you want to delete this spot?</div>
                             </div>
                             <div id="delete-form-buttons">
                              <button id="delete-spot-button">Yes, Delete It!</button>
                              </div>
                            </div>
                            `);
                          $(`#delete-spot`).on('click', `#delete-spot-button`, function() {
                            if (randomMarker !== null) {
                              randomMarker.setMap(null);
                            }
                            $.post(`/api/pins/delete/${pin.id}`);
                            $('#mySidebar').empty();
                            $("#delete-spot").remove();
                            $.get(`/api/pins/${map.id}`, function(req, res) {
                              const pins = req.pins;
                              for (const pin of pins) {
                                $('#mySidebar').append(`<div id="pin-box">
                                <button id="${pin.id + 100}" class="pin_title"> ${pin.name} </button>
                                <button id="${pin.id}" class="pin-delete "> <b X> </button
                                </div>`);
                              }

                            });
                            $.get(`/api/pins/${map.id}`, function(req, res) {
                              $('#mySidebar').empty();
                              $('#map-description').empty();
                              const pins = req.pins;
                              for (const pin of pins) {
                                $('#mySidebar').append(`<div id="pin-box">
                                <button id="${pin.id + 100}" class="pin_title"> ${pin.name} </button>
                                <button id="${pin.id}" class="pin-delete "> <b X> </button
                                </div>`);
                              }
                              dropPins(req);
                              createMapBox(map, key);
                            });

                          });
                          $(`#x-3`).click(function() {
                            $("#delete-spot").remove();
                          });
                        }
                      });
                    }
                    $.get(`/api/pins/${map.id}`, function(req, res) {
                      $('#mySidebar').empty();
                      $('#map-description').empty();
                      const pins = req.pins;
                      for (const pin of pins) {
                        $('#mySidebar').append(`<button id="${pin.id + 100}" class="pin_title"> ${pin.name} </button`);
                      }
                    dropPins(req);
                    createMapBox(newMap, key);
                  });
                }, 500);
              });
              $("#create-map-form").remove();
            }
              )}
          });
        });

        //Add Spots to a map
        $(`body`).on(`click`, '#add-pins', function() {
          if (randomMarker !== null) {
            randomMarker.setMap(null);
          }
          let firstPinlong;
          let firstPinlat;
          $('#map').append(`<div id="new-pin">
        <i id='x-3' class="fas fa-times"></i>
        <form id="create-spot-form">
        <div id="submit-spot-content">
        <label for="add-spot">Add Another Spot</label>
        <div id="theplace"><input id="test-pin" rows="1" cols="25" placeholder="Enter your first pin"></input></div>
        <div id=toggle ><label id="toggle-rules">drop a pin</label><i id="pin-drop" class="fas fa-toggle-off"></i></div>
        <label for="new-spot-desc">Give a little info about it</label>
        <input id="new-spot-desc" rows="2" cols="25" placeholder="Add some deets about this spot">
        </div>
        <div id="submit-spot-buttons">
        <input type="submit" value="Add Spot" id="add-new-pin">
        </div>
        </form>
        </div>`);

          $('#add-new-pin').click(() => {
            if (randomMarker !== null) {
              randomMarker.setMap(null);
            }
            google.maps.event.removeListener(clickMap);
            if (previousMarker !== null) {
              previousMarker.setMap(null);
            }
            if($("#test-pin").val()) {
              const escapePinTitle = $("#test-pin").val();
              pinTitle = escape(escapePinTitle);
            }
            const escapePinDesc = $('#new-spot-desc').val();
            const pinDesc = escape(escapePinDesc);
            $("#new-pin").remove();
            if (previousMarker !== null) {
              previousMarker.setMap(null);
            }
            if (pinTitle === 'Z') {
              const escapePinTitle = $("#test-pin").val();
              pinTitle = escape(escapePinTitle);
            }
            if (!pinTitle || !firstPinlat || !pinDesc) {
              alert('Slow down there buckaroo, please fill out all the fields!');
            } else {
              event.preventDefault();
              let newMapId = activeMap.id;
              $.post("/api/pins/post", { pinTitle, firstPinlong, firstPinlat, newMapId, pinDesc },()=>{
              });
              setTimeout (function() {
                $.get(`/api/pins/${newMapId}`, function(req, res) {
                  $('#mySidebar').empty();
                  $('#map-description').empty();
                  const pins = req.pins;
                  for (const pin of pins) {
                    $('#mySidebar').append(`<div id="pin-box">
                      <button id="${pin.id + 100}" class="pin_title"> ${pin.name} </button>
                      <button id="${pin.id}" class="pin-delete "> <b X> </button
                      </div>`);
                    $(`#mySidebar`).on('click', `#${pin.id}`, function() {
                      if (!document.getElementById('delete-spot')) {
                        $(`#map`).append(`
                        <div id="delete-spot">
                        <i id='x-3' class="fas fa-times"></i>
                        <br>
                          <div>
                            <div id="delete-header">Are you sure you want to delete this spot?</div>
                         </div>
                         <div id="delete-form-buttons">
                          <button id="delete-spot-button">Yes, Delete It!</button>
                          </div>
                        </div>
                        `);
                        $(`#x-3`).click(function() {
                          $("#delete-spot").remove();
                        });
                      }
                    });
                  }
                  dropPins(req);
                  createMapBox(activeMap, key);
                });
              }, 500);
              $("#create-map-form").remove();
            }
          });


          $("#x-3").click(() => {
            $("#new-pin").remove();
            google.maps.event.removeListener(clickMap);
            if (previousMarker !== null) {
              previousMarker.setMap(null);
            }
          });

          const searchInput = 'test-pin';
          const defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(userIpLat, userIpLong),
            new google.maps.LatLng(userIpLat + 0.001, userIpLong + 0.001));

          autocomplete = new google.maps.places.Autocomplete((document.getElementById(searchInput)), {
            bounds: defaultBounds
          });
          google.maps.event.addListener(autocomplete, 'place_changed', function() {
            let near_place = autocomplete.getPlace();
            firstPinlong = near_place.geometry.location.lat();
            firstPinlat = near_place.geometry.location.lng();
            pinTitle = near_place.name;
          });

          let clickMap;
          let dropMode = false;
          $('#pin-drop').click(() => {
            if (dropMode) {
              $("#pin-drop").css('color:tomato');
              $("#pin-drop").removeClass("fas fa-toggle-on");
              $("#pin-drop").addClass("fas fa-toggle-off");
              $("#pin-drop").css("color", "tomato");
              $("#test-pin").remove();
              $("#theplace").append(`<input id="test-pin" rows="1" cols="25" placeholder="Enter your first pin"></input>`);
              const searchInput = 'test-pin';
              if (previousMarker !== null) {
                previousMarker.setMap(null);
              }
              google.maps.event.removeListener(clickMap);
              const defaultBounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(userIpLat, userIpLong),
                new google.maps.LatLng(userIpLat + 0.001, userIpLong + 0.001));

              autocomplete = new google.maps.places.Autocomplete((document.getElementById(searchInput)), {
                bounds: defaultBounds
              });
              google.maps.event.addListener(autocomplete, 'place_changed', function() {
                let near_place = autocomplete.getPlace();
                firstPinlong = near_place.geometry.location.lat();
                firstPinlat = near_place.geometry.location.lng();
                pinTitle = near_place.name;
              });
              dropMode = false;
            } else {
              dropMode = true;
              $("#pin-drop").removeClass("fas fa-toggle-off");
              $("#pin-drop").addClass("fas fa-toggle-on");
              $("#pin-drop").css("color", "palegreen");
              $("#test-pin").remove();
              $("#theplace").append(`<textarea id="test-pin" rows="1" cols="25" placeholder="Give your spot a name"></textarea>`);
              const placeMarker = function(location) {
                if (previousMarker !== null) {
                  previousMarker.setMap(null);
                }
                previousMarker = new google.maps.Marker({
                  position: location,
                  map: map,
                  animation: google.maps.Animation.DROP
                });
              };
              clickMap = google.maps.event.addListener(map, 'click', function(event) {
                placeMarker(event.latLng);
                const myLatLng = event.latLng;
                firstPinlong = myLatLng.lat();
                firstPinlat = myLatLng.lng();
                pinTitle = 'Z';
              });
            }
            // this used to be the pins creation i think but im not sure it could be something else if we start getting major bugs somewhere else uncommenting this might do the trick
            // $("#create-spot-form").submit(function(event) {
            //   alert('hi');
            //   $("#new-pin").remove();
            //   if (previousMarker !== null) {
            //     previousMarker.setMap(null);
            //   }
            //   console.log(firstPinlat);
            //   const escapePinDesc = $("#new-spot-desc").val();
            //   const pinDesc = escape(escapePinDesc);
            //   console.log(pinDesc);
            //   console.log(pinTitle);
            //   if (pinTitle === 'Z') {
            //     const escapePinTitle = $("#test-pin").val();
            //     pinTitle = escape(escapePinTitle);
            //   }
            //   if (!pinTitle || !firstPinlat || !pinDesc) {
            //     alert('Slow down there buckaroo, please fill out all the fields!');
            //   } else {
            //     event.preventDefault();
            //     let newMapId = activeMap.id;
            //     $.post("/api/pins/post", { pinTitle, firstPinlong, firstPinlat, newMapId, pinDesc },()=>{
            //     });
            //     setTimeout (function() {
            //       console.log(newMapId);
            //       $.get(`/api/pins/${newMapId}`, function(req, res) {
            //         $('#mySidebar').empty();
            //         $('#map-description').empty();
            //         const pins = req.pins;
            //         for (const pin of pins) {
            //           $('#mySidebar').append(`<div id="pin-box">
            //               <button id="${pin.id + 100}" class="pin_title"> ${pin.name} </button>
            //               <button id="${pin.id}" class="pin-delete "> <b X> </button
            //               </div>`);
            //         }
            //         dropPins(req);
            //         createMapBox(activeMap, key);
            //       });
            //     }, 500);
            //     $("#create-map-form").remove();
            //   }
            // });
          });
        });
      };


      document.head.appendChild(script);
    });
  });
});

const openNav = function() {
  document.getElementById("mySidebar").style.width = "150px";
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
$('#map').on('click', function() {
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


$(`#map-description`).on('click', "#edit-button", function() {
  alert("the edit map button was clicked");
});


//login in form
$(`#login`).click(() => {
  if (!document.getElementById("login-container") && !document.getElementById("register-container")) {
    loginForm();
  }
});
const loginForm = function() {
  $('#map').append(`
  <div id="login-container">
     <label id="title">login</label>
     <i id='x' class="fas fa-times"></i>
     <form action="/login/form/" id="login-form" method="POST">
     <input type="text" class="info-entry" id="username" name="username"  cols="45" placeholder="Username">
     <input type="password" id="password"  name="password" cols="45" placeholder="password">
     <div id="register-instruct">Dont have an account?</div>
     <div id="buttons-login"><button id="login-btn">login</button>
     </form>
     <button id="register-btn">Register</button>
     </div>
    </div>`
  );
  $(".info-entry").keypress(function(event) {
    if(event.keyCode == 13) {
      event.preventDefault();
      $(this).next('input').focus();
    }
  });
  $(`#register-btn`).click(() => {
    $("#login-container").remove();
    $('#map').append(`
    <div id="register-container">
    <label id="title">Register</label>
    <i id='x' class="fas fa-times"></i>
    <form action="/register/form/" id="login-form" method="POST">
    <input type="email" class="info-entry" id="email"  name="email" cols="45" placeholder="email">
    <input type="text" class="info-entry" id="username" name="username"  cols="45" placeholder="Username">
    <input type="password" id="password"  name="password" cols="45" placeholder="password">
    <div id="buttons-register">
      <button id="register-btn">Register</button>
    </div>
    </form>
   </div>`
    );
    $(".info-entry").keypress(function(event) {
      if(event.keyCode == 13) {
        event.preventDefault();
        $(this).next('input').focus();
      }
    });
    $(`#x`).click(() => {
      $("#login-container").remove();
      $("#register-container").remove();
    });
  });

  $(`#x`).click(() => {
    $("#login-container").remove();
    $("#register-container").remove();
  });
};
