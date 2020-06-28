$(() => { 


  const maps = {
    "maps": [{
      "id": 1, "user_id": 1, "title": "Best Pubs In Calgary", "description": "I've worked long and hard to find the best pubs in calgary. I can die peacefully knowing ive accomplished everything i've set out to do."},
      {"id":2,"user_id":2,"title":"Best Coffee In Calgary","description":"I've worked long and hard to find the best Coffee in calgary. I can die peacefully knowing i've accomplished everything ive set out to do."},
      {"id":3,"user_id":3,"title":"Best Sandwhiches In Calgary","description":"I've worked long and hard to find the best Sandwhiches in calgary. I can die peacefully knowing i've accomplished everything ive set out to do."},
      {"id":4,"user_id":1,"title":"Best Wings In Calgary","description":"I've worked long and hard to find the best Wings in calgary. I can die peacefully knowing i've accomplished everything ive set out to do."},
      {"id":5,"user_id":1,"title":"Best Malls In Calgary","description":"I've worked long and hard to find the best Malls in calgary. I can die peacefully knowing i've accomplished everything ive set out to do."},
      {"id":6,"user_id":2,"title":"Best Pool Halls In Calgary","description":"I've worked long and hard to find the best pool halls in calgary. I can die peacefully knowing i've accomplished everything ive set out to do."}]}
  
  
  const getMaps = function(maps) {
    for (const map of maps.maps) {
      console.log(map.title);
      $('#map-container').append(map.title)
    }
  }
  
  
  getMaps(maps)
  
  
  const users =
  {"users":[{"id":1,"username":"landongt","email":"landontipantiza@gmail.com","password":"password"},
  {"id":2,"username":"BDeWitt-Cohen","email":"BDeWitt-Cohen@hotmail.com","password":"password"},
  {"id":3,"username":" cjfelice","email":"cjfelice@hotmail.com","password":"password"},
  {"id":4,"username":"randomUserName1","email":"randomUserName1@gmail.com","password":"password"},
  {"id":5,"username":"randomUserName2","email":"randomUserName2@hotmail.com","password":"password"},
  {"id":6,"username":"randomUserName3","email":"randomUserName3@gmail.com","password":"password"},
  {"id":7,"username":"randomUserName4","email":"randomUserName4@hotmail.com","password":"password"},
  {"id":8,"username":"randomUserName5","email":"randomUserName5@gmail.com","password":"password"}]}
  
  
  const getUsers = function(users) {
    for (const user of users.users){
      // console.log(users);
    }
  }
  
  getUsers(users)
  
  
  const getPins = function(pins){
    for (const pin of pins.pins) {
      console.log(pin);
      $('#pin-container').append(pin.name)
      $('#pin-container').append(pin.description)
  
  
    }
  }
  getPins(pins)
  
  const renderPins = function(pins){
    for (const pin of pins.pins) {
      var pinLatLng = {lat: pin.lat, lng: pin.long};
      var marker = new google.maps.Marker({
      position: pinLatLng,
      map: map,
      title: pin.name
    });
  }
  }
  
  marker.setMap(map); //this might need to come inside the render function
  
  
  
  
  
  })