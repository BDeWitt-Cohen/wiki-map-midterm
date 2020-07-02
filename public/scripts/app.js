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

//Escape function for invalid characters and malicious code
const escape = function(str) {
  let div = document.createElement('div');

  div.appendChild(document.createTextNode(str));

  return div.innerHTML;
};

//Creates full map
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
        headerButton = `<div id="header-buttons"> <button id="add-pins" class="footer-buttons">Add Spot</button>
        <button id="delete-map" class="footer-buttons">Delete Map</button>
        </div>`;
      } else {
        headerButton = '<div></div>'
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

      //Delete Maps
      $(`#map-description`).on(`click`, '#delete-map', function() {
        console.log(map.id);
        $.post(`/api/maps/delete/${map.id}`)
        $("#map-description").remove();
        alert('Map Successfully Deleted')

      })

      //Add Spots to a map
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
      const escapeNewSpotDesc = $("#new-spot-desc").val();
      const newSpotDesc = escape(escapeNewSpotDesc)
      $.post(`/api/pins/post/${map.id}`, {pinTitle, firstPinlong, firstPinlat, newSpotDesc})
    })
    $("#create-map-form").remove();
      })
      $('#add-new-pin').on('click', function () {
        const escapeNewSpotDesc = $("#new-spot-desc").val();
        const newSpotDesc = escape(escapeNewSpotDesc)
        $.post(`/api/pins/post/${map.id}`, {pinTitle, firstPinlong, firstPinlat, newSpotDesc})
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
              if(!(map.user_id == req.user)) {
                // if(req.user_id)
                $('#all-maps').append(`<button type="button" class="map_title" id="${map.id}"> ${map.title}  </button>`);

                //sets event handler for each map title in drop down mymaps
                $(`#${map.id}`).on('click', function() {
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
                  $('#mySidebar').empty();
                  $('#map-description').empty();
                  const pins = req.pins;
                  console.log(req.pins);
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
          const infoWindow = new google.maps.InfoWindow;
          for (const pin of obj.pins) {
            time += 250;
            const newLat = badDirector(pin.lat);
            const newLong = badDirector(pin.long);
            let myLatlng = new google.maps.LatLng(newLong, newLat);
            bounds.extend(myLatlng);
            window.setTimeout(function() {
              const mark = new google.maps.Marker({
                position: myLatlng,
                title: `${pin.name}`,
                map: map,
                animation: google.maps.Animation.DROP
              });
              markers.push(mark);
              console.log(pin.lat);
              console.log(pin.long);
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
                map.panTo({lat: pin.long + 0.005, lng: pin.lat});
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
                map.panTo({lat: pin.long + 0.005, lng: pin.lat});
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
     <textarea rows="1" id="pin-desc" cols="25" placeholder="Enter your first pin"></textarea>
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
      const escapeMapName = $("#test-name").val();
      const mapName = escape(escapeMapName)
      const escapeMapDesc = $("#test-desc").val();
      const mapDesc = escape(escapeMapDesc)
      const escapePinDesc = $("#pin-desc").val();
      const pinDesc = escape(escapePinDesc)
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
          $.post("/api/pins/post", {pinTitle, firstPinlong, firstPinlat, newMapId, pinDesc})
        });

        $("#create-map-form").remove();
      }
    }
  });
});

$(`#map-description`).on('click', "#edit-button",function() {
  alert("the edit map button was clicked");
});


//login in form
$(`#login`).click(()=>{
  loginForm();
})
const loginForm = function (){
  $('#map').append(`
  <div id="login-container">
     <label id="title">login</label>
     <form action="/login/form/" id="login-form" method="POST">
     <input type="text" id="username" name="username"  cols="45" placeholder="Username">
     <input type="password" id="password"  name="password" cols="45" placeholder="password">

     <button id="login-btn">login</button>

     </form>
     <div id="buttons">
       <button id="register-btn">Register</button>
       <button id="cancel-btn">Cancel</button>
     </div>
    </div>`
  )
  $(`#register-btn`).click(()=>{
    $("#login-container").remove();
    $('#map').append(`
    <div id="register-container">
    <label id="title">Register</label>
    <form action="/register/form/" id="login-form" method="POST">
    <input type="email" id="email"  name="email" cols="45" placeholder="email">
    <input type="text" id="username" name="username"  cols="45" placeholder="Username">
    <input type="password" id="password"  name="password" cols="45" placeholder="password">

    <button id="register-btn">Register</button>

    </form>
    <div id="buttons">
      <button id="login-btn">Login</button>
      <button id="cancel-btn">Cancel</button>
    </div>
   </div>`
  )
  $(`#login-btn`).click(()=>{
    $("#register-container").remove()
    loginForm()
  })
  })

  $(`#cancel-btn`).click(()=>{
    $("#login-container").remove();
  })
}
