//initialize app
var app = angular.module('MusicHistoryApp', ["firebase", 'angular.filter', 'ngRoute']);


//Setting Up routes
app.config(['$routeProvider', function($routeProvider){

	//route for main song view
	$routeProvider
		.when('/songs/list', {
			templateUrl: 'partials/songList.html',
			controller: 'showSongsCtrl'
		})
		//route for add song form
		.when('/songs/new', {
			templateUrl: 'partials/songForm.html',
			controller: 'addSongCtrl'
	})
    .when('/songs/:songKey', {
      templateUrl: 'partials/singleSong.html',
      controller: 'singleSongCtrl'
    })
    .otherwise({ redirectTo: '/songs/list' });

}]);

//factory for working with user's songs
app.factory("songBase", ['$firebaseObject', '$firebaseArray', function($firebaseObject, $firebaseArray) {

		//create a globally available 'songs' object
	var songsObject = {};
	var songsArray = [];

	var ref = new Firebase("https://ajpmusichistory.firebaseio.com/songs/songs");
  // download the data into a local object
  songsObject = $firebaseObject(ref);
  songsArray = $firebaseArray(ref);

  return {
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
		  		console.log("added record with id " + id);
					var index = songsArray.$indexFor(id);
					console.log(index);
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




//controller to populate and filter songs in the main view
app.controller('showSongsCtrl',['$scope','$rootScope', 'songBase', function($scope, $rootScope, songBase) {

	//get songs as object and array from the factory
	$scope.songsObject = songBase.getSongsObject();
	$scope.songsArray = songBase.getSongsArray();


	$scope.genreFilter = function(){

	$scope.filterByGenres = function(song) {
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
app.controller('addSongCtrl',['$scope','$rootScope', 'songBase', function($scope, $rootScope, songBase) {


  // get song list from the factory
  var songsArray = songBase.getSongsArray();

  // add new items to the array
  $scope.addNew = function(){

  	//check if fields are entered
  	if ($scope.newSongTitle.length > 0 &&
  			$scope.newSongArtist.length > 0 &&
  			$scope.newSongAlbum.length > 0 &&
  			$scope.newSongGenre.length > 0){

  		//build the new song
	  	var newSong = {
			title: $scope.newSongTitle,
			artist: $scope.newSongArtist,
			album: $scope.newSongAlbum,
			genre: $scope.newSongGenre
		};

		songBase.addSong(newSong);
				//reset fields
			$scope.newSongTitle = "";
			$scope.newSongArtist = "";
			$scope.newSongAlbum = "";
			$scope.newSongGenre = "";
		} //end if

	}; //end add new
}]); //end addSongCtrl

app.controller("singleSongCtrl",
  ["$scope", "$routeParams", "songBase", "$location",
  function($scope, $routeParams, songBase, $location) {

    // var songkey = $routeParams.songKey;
    // console.log($routeParams.songKey);
    $scope.song = songBase.getSong($routeParams.songKey);
    // console.log($scope.song)

    $scope.removeSong = function(songKey){
    	// console.log(songKey);
    	songBase.removeSong(songKey);
			$location.path( "/songs/list" )    };

    //use factory to update the song array
    $scope.editSong = function(songData){
	    songBase.editSong(songData);
	    $('.editInput').toggle('display');
    };
    //toggle edit field display
    $scope.toggleEdit = function(songData){
    	console.log($('.editInput'));
    	$('.editInput').toggle('display');
    };

  }]
);