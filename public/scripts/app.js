
const CustomMapStyles = [
  { "featureType": "administrative.land_parcel",
    "elementType": "labels",
    "stylers": [ { "visibility": "off" } ]
  },
  { "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [ { "visibility": "off" } ]
  },
  { "featureType": "poi.business",
    "stylers": [ { "visibility": "off" } ]
  },
  { "featureType": "poi.park",
    "elementType": "labels.text",
    "stylers": [ { "visibility": "off" } ]
  },
  { "featureType": "road.local",
    "elementType": "labels",
    "stylers": [ { "visibility": "off" } ]
  },
  { "featureType": "landscape",
    "stylers": [ { "hue": "#FFBB00" },
      { "saturation": 43.400000000000006 },
      { "lightness": 37.599999999999994 },
      { "gamma": 1 } ]
  },
  { "featureType": "road.highway",
    "stylers": [ { "hue": "#FFC200" },
      { "saturation": -61.8 },
      { "lightness": 45.599999999999994 },
      { "gamma": 1 } ]
  },
  { "featureType": "road.arterial",
    "stylers": [ { "hue": "#FF0300" },
      { "saturation": -100 },
      { "lightness": 51.19999999999999 },
      { "gamma": 1 } ]
  },
  { "featureType": "road.local",
    "stylers": [ { "hue": "#FF0300" },
      { "saturation": -100 },
      { "lightness": 52 },
      { "gamma": 1 } ]
  },
  { "featureType": "water",
    "stylers": [ { "hue": "#0078FF" },
      { "saturation": -13.200000000000003 },
      { "lightness": 2.4000000000000057 },
      { "gamma": 1 } ]
  },
  { "featureType": "poi",
    "stylers": [ { "hue": "#00FF6A" },
      { "saturation": -1.0989010989011234 },
      { "lightness": 11.200000000000017 },
      { "gamma": 1 } ]
  }
];

const createMapBox = function(map, key) {
  $.get(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?query=${map.title}&key=${key}`, function(req, res) {
    let image;
    if (req.results[0] !== undefined && req.results[0].photos !== undefined) {
      image = `https://maps.googleapis.com/maps/api/place/photo?photoreference=${req.results[0].photos[0].photo_reference}&sensor=false&maxheight=200&maxwidth=200&key=${key}`;
    } else {
      image = `https://loremflickr.com/200/200/${map.title}`;
    }

    $.get(`/api/favs/${map.id}`, function(req, res) {
      numFavs = req.favs[0].count;
      let headerButton;
      if(map.user_id == req.user_id.user_id) {
        headerButton = `<button id="add-pins" class="footer-buttons">Add Spot</button>`;
      } else {
        headerButton = `<button class="suggest-pin" class="footer-buttons">Suggest Spot</button>`;
      }


      $('#map-description').css('padding: 10px');
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
      $('#crazy').on('mouseover', ()=>{
        $('#crazy').css('color', 'tomato');
        $('#wow').css('color', 'tomato');
      });
      $('#crazy').on('mouseout', ()=>{
        $('#crazy').css('color', 'white');
        $('#wow').css('color', 'white');
      });
      $(`#map-description`).off();



      $(`#map-description`).on(`click`, '#add-pins', function() {
        $('#map').append(`<div>
      <form  id="create-spot-form">
        <div id="submit-spot-content">
          <label for="add-spot">Add A New Spot</label>
          <input id="add-spot"  rows="1" cols="45" placeholder="New Spot"></input><br>
          <label for="new-spot-desc">New Spot Description</label>
          <textarea id="new-spot-desc" rows="2" cols="25" placeholder="Add some deets about this spot"></textarea>
        </div>
        <div id="submit-spot-buttons">
          <input type="submit" value="Add Spot" id="add-new-pin">
          <button id="exit-map-creation">Cancel</button>
        </div>
          
      </form>
    </div>`)

   const searchInput = 'add-spot';
   const defaultBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(userIpLat, userIpLong),
    new google.maps.LatLng(userIpLat + 0.001, userIpLong + 0.001));

    let autocomplete = new google.maps.places.Autocomplete((document.getElementById(searchInput)), {
    bounds: defaultBounds
    });
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
      let near_place = autocomplete.getPlace();
      firstPinlong = near_place.geometry.location.lat();
      firstPinlat = near_place.geometry.location.lng();
      pinTitle = near_place.name;
    });
    $('#add-new-pin').on('click', function () {
      alert('add new pin clicked')
      const newSpotDesc = $("#new-spot-desc").val();
            alert("added a new pin")
            $.post(`/api/pins/post/${map.id}`, {pinTitle, firstPinlong, firstPinlat})
    })
    $("#create-map-form").remove();
      })
      $(`#map-description`).on(`click`, `.fa-stack`, function() {
        $.post(`/api/favs/post/${map.id}`, function(req, res) {
          $.get(`/api/favs/${map.id}`, function (req, res) {
            $('#crazy').empty()
            const count = req.favs[0].count;
            $('#crazy').append(`${count}`);
          });
        });
      });
    });
   
  });
};

$.get(`/api/google`, function(data) {
  const key = data.key;
  $.get(`https://api.ipify.org?format=json`, function(data) {
    const ip = data.ip;

    $.get(`http://api.ipstack.com/${ip}?access_key=51ad6577289c9e4bc0315e9b521df4d2`, function(data, status) {

      const response = data;
      // console.log(response);
      userIpLat = response.latitude;
      userIpLong = response.longitude;
      city = response.city;

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

        //Render all map titles client side
        $("#all-maps-btn").on('mouseover', ()=>{
          $('#all-maps').empty();
          $('#my-map-container').empty();
          $("#favorite-map-container").empty();
          $.get("/api/maps", function(req, res) {
            const maps = req.maps;
            for (const map of maps) {
              if(!(map.user_id == req.user)){
                // if(req.user_id)
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
                $.get(`/api/pins/${map.id}`, function(req, res) {
                  dropPins(req);
                  $('#mySidebar').empty();
                  $('#map-description').empty();
                  const pins = req.pins;
                  for (const pin of pins) {
                    $('#mySidebar').append(`<button class="pin_title"> ${pin.name} ${pin.description} </button`);
                  }
                  createMapBox(map, key);
                });
              });

            }
          });
        });

        //render favorite maps
        $("#favorite-map").on("mouseover", ()=>{
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
                  createMapBox(map, key);
                });
              });

            }
          });
        });

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
     <input id="test-pin" rows="1" cols="25" placeholder="Enter your first pin"></input>
     <label for="pins-desc">Give us a little info about this spot</label>
     <textarea rows="1" cols="25" placeholder="Enter your first pin"></textarea>
    </div>
  <div id="submit-form-buttons">
    <input type="submit" value="Create Map" id="submit-new-map">
    <input type="submit" value="Drop Pin" id="drop-pin">
   <button id="exit-map-creation">Cancel</button>
  </div>
    </form>
   </div>`);

   const searchInput = 'test-pin';
   const defaultBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(userIpLat, userIpLong),
    new google.maps.LatLng(userIpLat + 0.001, userIpLong + 0.001));



    let autocomplete = new google.maps.places.Autocomplete((document.getElementById(searchInput)), {
    bounds: defaultBounds
    });
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
      let near_place = autocomplete.getPlace();
      firstPinlong = near_place.geometry.location.lat();
      firstPinlat = near_place.geometry.location.lng();
      pinTitle = near_place.name;
    });
    console.log(userIpLat);
    console.log(userIpLong);


  let tryingToExit = false;
  $("#exit-map-creation").click(function(event) {
    tryingToExit = true;
  });
  $("#create-map-form").submit(function(event) {
    if (tryingToExit) {
      $("#create-map-form").remove();
    } else {
      const mapName = $("#test-name").val();
      const mapDesc = $("#test-desc").val();
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
      } else {
        const newMapObj = { mapName, mapDesc };

        $.post("/api/maps/post", newMapObj, (res)=>{
          const newMapId = res.maps[0].id;
          console.log(firstPinlong);
          console.log(firstPinlat);
          $.post("/api/pins/post", {pinTitle, firstPinlong, firstPinlat, newMapId})
        });

        $("#create-map-form").remove();
      }
    }
  });
});

$(`#map-description`).on('click', "#edit-button",function() {
  alert("the edit map button was clicked");
});
