// Global session variables
Session.setDefault("results", []);
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
      var resArr = result.data.items;


      resArr.forEach(function (obj) {
        newArr.push({
          title: obj.snippet.title,
          description: obj.snippet.description,
          thumbnail: obj.snippet.thumbnails.default.url,
          kind: obj.id.kind,
          videoId: obj.id.videoId
        });
      });
      Session.set('results', newArr);
    }
  });
};

Template.search.helpers({
  getResults: function () {
    return Session.get('results');//ReactiveMethod.call('searchYT');
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

    console.log(this.videoId);

    Songs.insert({
      userId: Meteor.userId(),
      title: this.title,
      videoId: this.videoId,
      kind: this.kind,
      thumbnail: this.thumbnail
    });

  }
});
