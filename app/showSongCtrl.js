//controller to populate and filter songs in the main view
app.controller('ShowSongsCtrl',['$rootScope', 'songBase', function($rootScope, songBase) {



	//get songs as object and array from the factory
	this.songsObject = songBase.getSongsObject();
	this.songsArray = songBase.getSongsArray();
	this.reloadStars = false;

	this.rate = function(key, rating){

		songBase.rateSong(key, rating);

	}.bind(this);

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
