onReady = function (event) {
  event.target.playVideo();
}

onStateChange = function (event) {
  if(player.getPlayerState() == 0){
    // currentIdplaying++;
    player.loadVideoById(
      'lRlmM88zzbY',
      0,
      'highres' //getAvailableQualityLevels() *****
    );
  }
}


onYouTubeIframeAPIReady = function () {
  // New Video Player, the first argument is the id of the div.
  // Make sure it's a global variable.
  player = new YT.Player("youtube-main-player", {

    height: "400",
    width: "600",

    // videoId is the "v" in URL (ex: http://www.youtube.com/watch?v=LdH1hSWGFGU, videoId = "LdH1hSWGFGU")
    videoId: "",

    // Events like ready, state change,
    events: {
      onReady: onReady,
      onStateChange: onStateChange
    }
  });
};

Template.library.rendered = function(){
  YT.load();
}

Template.library.helpers({
  songList: function () {
    return Songs.find({userId: Meteor.userId()}).fetch();
  }
});
