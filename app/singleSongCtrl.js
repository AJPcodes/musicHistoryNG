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

    this.rate = function(key, rating){
        console.log('called rate');
        songBase.rateSong(key, rating);
    }.bind(this);

  }]
);