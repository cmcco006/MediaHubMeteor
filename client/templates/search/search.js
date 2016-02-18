// Global session variables
// Session.setDefault("results", []);
var results = new ReactiveArray();

Session.setDefault("query", '');

doSearch = function () {
  //query parameters
  var url = 'https://www.googleapis.com/youtube/v3/search';
  var options = {
    params: {
      part: 'snippet',
      maxResults: '20',
      q: Session.get('query'),
      type: 'video',
      key: 'AIzaSyCuqp0_3XTVMSa1s14BoLKI7U04NN5ZUKg'

    }
  }

  //to hold the results
  var newArr = [];

  //Youtube query
  HTTP.get(url, options, function(error, result){
    if(error){
      console.log("error", error);
    }
    if(result){
      results.clear();

      var resArr = result.data.items;

      var index = 0;

      resArr.forEach(function (obj) {
        var added = false;
        var id = null;
        if(song = Songs.findOne({userId: Meteor.userId(), videoId:obj.id.videoId})) {
          added = true;
          id = song._id;
        }

        results.push({
          index: index,
          title: obj.snippet.title,
          description: obj.snippet.description,
          thumbnail: obj.snippet.thumbnails.default.url,
          kind: obj.id.kind,
          videoId: obj.id.videoId,
          added:added,
          id:id
        });

        index++;
      });

      // Session.set('results', newArr);
    }
  });
};

//
// Template.search.rendered = function(){
//   this.autorun(function () {
//     doSearch();
//   });
// };


Template.search.helpers({
  getResults: function () {
    return results.list();
  },
  getQuery: function () {
    return Session.get('query');
  }
});

//search bar in nav
Template.nav.events({
  "submit .search-bar": function (event) {
    event.preventDefault();

    // Get value from form element
    var text = event.target.query.value;

    Session.set('query', text);

    doSearch();

    Router.go('search');
  }
});

Template.search.events({
  "click #addSong": function (event) {
    event.preventDefault();

    //save id to update value in results list
    var id = Songs.insert({
      userId: Meteor.userId(),
      title: this.title,
      videoId: this.videoId,
      kind: this.kind,
      thumbnail: this.thumbnail
    });

    console.log(id);

    //Reactive method updates contents
    //added is true and id is updated
    results.splice(this.index, 1, {
      index: this.index,
      title: this.title,
      description: this.description,
      thumbnail: this.thumbnail,
      kind: this.kind,
      videoId: this.videoId,
      added:true,
      id:id
    });
  },

  "click #removeSong": function (event) {
    event.preventDefault();

    console.log(this.id);

    //set id to null and added to false in results
    results.splice(this.index, 1, {
      index: this.index,
      title: this.title,
      description: this.description,
      thumbnail: this.thumbnail,
      kind: this.kind,
      videoId: this.videoId,
      added:false,
      id:null
    });

    //remove song from mongo
    Songs.remove(this.id);
  }
});
