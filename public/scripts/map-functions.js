$(() => {


  const maps = {
    "maps": [{
      "id": 1, "user_id": 1, "title": "Best Pubs In Calgary", "description": "I've worked long and hard to find the best pubs in calgary. I can die peacefully knowing ive accomplished everything i've set out to do."
    },
    { "id": 2, "user_id": 2, "title": "Best Coffee In Calgary", "description": "I've worked long and hard to find the best Coffee in calgary. I can die peacefully knowing i've accomplished everything ive set out to do." },
    { "id": 3, "user_id": 3, "title": "Best Sandwhiches In Calgary", "description": "I've worked long and hard to find the best Sandwhiches in calgary. I can die peacefully knowing i've accomplished everything ive set out to do." },
    { "id": 4, "user_id": 1, "title": "Best Wings In Calgary", "description": "I've worked long and hard to find the best Wings in calgary. I can die peacefully knowing i've accomplished everything ive set out to do." },
    { "id": 5, "user_id": 1, "title": "Best Malls In Calgary", "description": "I've worked long and hard to find the best Malls in calgary. I can die peacefully knowing i've accomplished everything ive set out to do." },
    { "id": 6, "user_id": 2, "title": "Best Pool Halls In Calgary", "description": "I've worked long and hard to find the best pool halls in calgary. I can die peacefully knowing i've accomplished everything ive set out to do." }]
  }


  // const getMaps = function(maps) {
  //   for (const map of maps.maps) {
  //     console.log(map.title);
  //     $('#map-container').append(map.title)
  //   }
  // }


  getMaps(maps)


  const users =
  {
    "users": [{ "id": 1, "username": "landongt", "email": "landontipantiza@gmail.com", "password": "password" },
    { "id": 2, "username": "BDeWitt-Cohen", "email": "BDeWitt-Cohen@hotmail.com", "password": "password" },
    { "id": 3, "username": " cjfelice", "email": "cjfelice@hotmail.com", "password": "password" },
    { "id": 4, "username": "randomUserName1", "email": "randomUserName1@gmail.com", "password": "password" },
    { "id": 5, "username": "randomUserName2", "email": "randomUserName2@hotmail.com", "password": "password" },
    { "id": 6, "username": "randomUserName3", "email": "randomUserName3@gmail.com", "password": "password" },
    { "id": 7, "username": "randomUserName4", "email": "randomUserName4@hotmail.com", "password": "password" },
    { "id": 8, "username": "randomUserName5", "email": "randomUserName5@gmail.com", "password": "password" }]
  }


  const getUsers = function(users) {
    for (const user of users.users) {
      // console.log(users);
    }
  }

  getUsers(users)

  let pins = {
    "pins": [
      { "id": 1, "user_id": 1, "map_id": 1, "name": "Bottlescrew Bill's Pub", "long": 51, "lat": -114, "description": "Bottlescrew Bill's Pub is greatttt", "suggestion": null },
      { "id": 2, "user_id": 1, "map_id": 1, "name": "The Ship & Ancho", "long": 51, "lat": -114, "description": "I freaken love this place you have to see it", "suggestion": null }, 
      { "id": 3, "user_id": 2, "map_id": 2, "name": "Phil & Sebastian Coffee Roasters", "long": 51, "lat": -114, "description": "it's a must go!!", "suggestion": null }, 
      { "id": 4, "user_id": 2, "map_id": 2, "name": "société Coffee Lounge", "long": 51, "lat": -114, "description": "You'll be obssessed with this place!", "suggestion": null }, 
      { "id": 5, "user_id": 3, "map_id": 3, "name": "Meat And Bread", "long": 51, "lat": -114, "description": "crazy good, trust!!!", "suggestion": null }, { "id": 6, "user_id": 3, "map_id": 3, "name": "Keith's Deli", "long": 51, "lat": -114, "description": "if you dont go here youre crazy", "suggestion": null }, { "id": 7, "user_id": 1, "map_id": 4, "name": "Mug Shotz Sports Bar & Grill", "long": 51, "lat": -114, "description": "truly amzaing", "suggestion": null }, { "id": 8, "user_id": 1, "map_id": 4, "name": "Buffalo Wild Wings", "long": 51, "lat": -114, "description": "so delicous", "suggestion": null }, { "id": 9, "user_id": 1, "map_id": 5, "name": "CORE Shopping Centre", "long": 51, "lat": -114, "description": "They have the best cloths in town", "suggestion": null }, { "id": 10, "user_id": 1, "map_id": 5, "name": "CF Market Mall", "long": 51, "lat": -114, "description": "Super high fashion!", "suggestion": null }, { "id": 11, "user_id": 2, "map_id": 6, "name": "Chill Billiards", "long": 51, "lat": -114, "description": "This place is pretty chill", "suggestion": null }, { "id": 12, "user_id": 2, "map_id": 6, "name": "Leather Pocket", "long": 51, "lat": -114, "description": "Got hustled here a couple times.", "suggestion": null }, { "id": 13, "user_id": 2, "map_id": 6, "name": "Mike's Billiards", "long": 51, "lat": -114, "description": "Old and dingy, just the way it should be.", "suggestion": null }, { "id": 14, "user_id": 2, "map_id": 6, "name": "Chalks", "long": 51, "lat": -114, "description": "Food sucks but easy money to be won here!", "suggestion": null }]
  }

  const getPins = function(pins) {
    for (const pin of pins.pins) {
      console.log(pin);
      $('#pin-container').append(pin.name)
      $('#pin-container').append(pin.description)


    }
  }
  getPins(pins)

  const renderPins = function(pins) {
    for (const pin of pins.pins) {
      var pinLatLng = { lat: pin.lat, lng: pin.long };
      var marker = new google.maps.Marker({
        position: pinLatLng,
        map: map,
        title: pin.name
      });
    }
  }

  marker.setMap(map); //this might need to come inside the render function





})