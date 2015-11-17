//auth controller

app.controller("AuthCtrl", ["$firebaseAuth", "$location", "songBase",
	function($firebaseAuth, $location, songBase) {

    var ref = new Firebase("https://ajpmusichistory.firebaseio.com");
    this.authObj = $firebaseAuth(ref);

    this.logOut = function(){
    	// console.log('logged out');
			this.authObj.$unauth();
			$location.path( "/logIn");
			$('#mainNavbar').toggle('display');
    };

    this.logIn = function(){
    	// console.log('log in called');
    	this.authObj.$authWithPassword({
			  email: this.email,
			  password: this.password
			}).then(function(authData) {
			  // console.log("Logged in as:", authData.uid);
			  $location.path( "/songs/list");
			  songBase.setUser(authData);
			  $('#mainNavbar').toggle('display');
			}).catch(function(error) {
			  console.error("Authentication failed:", error);
			});
    };

    this.authWith = function(authType){
    	// console.log('called Auth with ', authType);
			this.authObj.$authWithOAuthPopup(authType).then(function(authData) {
			  console.log("Logged in as:", authData.uid);
			  $location.path( "/songs/list");
			  songBase.setUser(authData);
			  $('#mainNavbar').toggle('display');
			}).catch(function(error) {
			  console.error("Authentication failed:", error);
			});
		};

		this.register = function(){
			  this.authObj.$createUser({
			  email: this.newUser.email,
			  password: this.newUser.password
			}).then(function(userData) {
			  // console.log("User " + userData.uid + " created successfully!");

			  return this.authObj.$authWithPassword({
			    email: this.newUser.email,
			    password: this.newUser.password
			  });
			}).then(function(authData) {
			  // console.log("Logged in as:", authData.uid);
			  $location.path( "/songs/list");
			  songBase.setUser(authData);
			  $('#mainNavbar').toggle('display');
			}).catch(function(error) {
			  console.error("Error: ", error);
			});
		}; //end register
  }//end controller function
]);

