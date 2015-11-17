//controller for the add song form
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