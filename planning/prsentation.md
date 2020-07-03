### Trevor will share, full-screen, not-logged in, DB wiped so it's fresh.

### Initial intro, Trevor will intro the project as maps say we chose it because there was flexibility and we wanted to work with the Google API
### then pass off to Chris


### Chris will explain the namesake and the idea that while looking at cool spots on a map you can check out the area. Or whatever
### spin to you want to put on it then pass off to Landon

### Landon will explain the division of work and how we originally thought of splitting the work vertically but realized we worked well together
### so we took a more horizontal approach then pass off to Chris


### Chris - Not logged in state
* Expalin full screen layout and lay of the land
* Explore is a drop-down on hover which contains all of the maps other people have added 
* Once you click on a map a description box pops up along with populating any of the spots that have been added to that map and how many likes it has but can't like this map as you're not logged in
* You can view the names of the spot on the sidebar and clicking on them will snap them to center view providing their name, description and an image based on the Google search results

### Pass off to Landon

### Trevor will login. Auto-populate fields and quick sign-in - page refreshed

### Landon - Logged in state
* Similar layout but with some added functionality like now showing a "My Maps" button and who you're logged in as
* From there you can go to the explore hover dropdown which will only show maps that aren't yours
* Clicking on one of them will populate the same information however now you can actually like it which will do two things, increment the like counter and add it to your favorites which is another hover drop-down at the bottom of "My Maps"
* Additionally you can create a new map which will bring up a new form to add in the details for new map name, description, and adding your first pin which uses the Google API for the auto-complete functionality and creating that map will show the description and first pin location


### Pass off to Trevor

### Trevor will demo remaining functionality
* With the newly created map there are a couple other things we can do, like adding another spot
* Show off the auto-complete again and the new spot will snap into place
* With a newly added spot show off the delete map button (will need to prevent the default behavious so it doesn't reload or just say that this map is good and we hit it by accident)
* Move on to the logged in user view of spots which now also has the capability to delete a pin and also asks for confirmation, delete pin




