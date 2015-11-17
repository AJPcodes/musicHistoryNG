//initialize app
var app = angular.module('MusicHistoryApp', ["firebase", 'angular.filter', 'ngRoute']);


//Setting Up routes
app.config(['$routeProvider', function($routeProvider){

	//route for main song view
	$routeProvider
		.when('/logIn', {
			templateUrl: 'partials/logIn.html',
			controller: 'AuthCtrl as authCtrl'
		})
		.when('/register', {
			templateUrl: 'partials/register.html',
			controller: 'AuthCtrl as authCtrl'
		})
		.when('/songs/list', {
			templateUrl: 'partials/songList.html',
			controller: 'ShowSongsCtrl as showSongsCtrl'
		})
		//route for add song form
		.when('/songs/new', {
			templateUrl: 'partials/songForm.html',
			controller: 'AddSongCtrl as addSongCtrl'
	})
    .when('/songs/:songKey', {
      templateUrl: 'partials/singleSong.html',
      controller: 'SingleSongCtrl as singleSongCtrl'
    })
    .otherwise({ redirectTo: 'logIn' });

}]);

//factory for working with user's songs
app.factory("songBase", ['$firebaseObject', '$firebaseArray', function($firebaseObject, $firebaseArray) {


		//create a globally available 'songs' object
	var songsObject = {};
	var songsArray = [];
	var currentUser, ref;


  return {
  	setUser: function(userData) {
  		currentUser = userData;
  		ref = new Firebase("https://ajpmusichistory.firebaseio.com/users/" + currentUser.uid + "/songs");
  		  // download the data into a local object
  		songsObject = $firebaseObject(ref);
 		 	songsArray = $firebaseArray(ref);
  	},
    getSongsObject: function() {
      return songsObject;
    },
    getSongsArray: function() {
      return songsArray;
    },
    getSong: function(key) {
      return songsArray.filter(function(song){
      	// console.log(key);
      	// console.log(song.key);
      	// console.log(song.key == key);
        return song.key == key;
      })[0];
    },
    addSong: function(newSong) {
      // song_list.push(song);
			songsArray.$add(newSong)
				.then(function(newSongRef) {
					//add generated key as 'key' and save again
		  		var id = newSongRef.key();
		  		// console.log("added record with id " + id);
					var index = songsArray.$indexFor(id);
					// console.log(index);
					songsArray[index].key = id;
					songsArray.$save(index);
				}); //end then
   	}, //end add song
		removeSong: function(songKey) {
					var index = songsArray.$indexFor(songKey);
					songsArray.$remove(index);
   	}, //end remove song
   	editSong: function(editedSongData) {
   		var index = songsArray.$indexFor(editedSongData.key);
   		songsArray[index] = editedSongData;
   		songsArray.$save(index);

   	} //end edit song
  }; //end return

}]);

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



//controller to populate and filter songs in the main view
app.controller('ShowSongsCtrl',['$rootScope', 'songBase', function($rootScope, songBase) {



	//get songs as object and array from the factory
	this.songsObject = songBase.getSongsObject();
	this.songsArray = songBase.getSongsArray();


	this.genreFilter = function(){

	this.filterByGenres = function(song) {
        return (selectedGenres.indexOf(song.genre) !== -1);
  };

		selectedGenres = [];
		var checkboxes = angular.element('.checkbox');

		checkboxes.each(function(index, checkGenre){
			if ($(checkGenre).prop('checked')) {
				selectedGenres.push($(checkGenre).val());
			}
		});


	}; //end genreFilter



}]); //end TodoCtrl

//controller to populate filter options
app.controller('AddSongCtrl',['$rootScope', 'songBase', function($rootScope, songBase) {


  // get song list from the factory
  var songsArray = songBase.getSongsArray();

  // add new items to the array
  this.addNew = function(){

  	//check if fields are entered
  	if (this.newSongTitle.length > 0 &&
  			this.newSongArtist.length > 0 &&
  			this.newSongAlbum.length > 0 &&
  			this.newSongGenre.length > 0){

  		//build the new song
	  	var newSong = {
			title: this.newSongTitle,
			artist: this.newSongArtist,
			album: this.newSongAlbum,
			genre: this.newSongGenre
		};

		songBase.addSong(newSong);
				//reset fields
			this.newSongTitle = "";
			this.newSongArtist = "";
			this.newSongAlbum = "";
			this.newSongGenre = "";
		} //end if

	}; //end add new
}]); //end addSongCtrl

app.controller("SingleSongCtrl",
  ["$routeParams", "songBase", "$location",
  function($routeParams, songBase, $location) {

    // var songkey = $routeParams.songKey;
    // console.log($routeParams.songKey);
    this.song = songBase.getSong($routeParams.songKey);
    // console.log(this.song)

    this.removeSong = function(songKey){
    	// console.log(songKey);
    	songBase.removeSong(songKey);
			$location.path( "/songs/list");
    };

    //use factory to update the song array
    this.editSong = function(songData){
	    songBase.editSong(songData);
	    $('.editInput').toggle('display');
    };
    //toggle edit field display
    this.toggleEdit = function(songData){
    	// console.log($('.editInput'));
    	$('.editInput').toggle('display');
    };

  }]
);