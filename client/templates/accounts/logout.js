Template.nav.events({
  'click #logoutBtn': function (event) {
    event.preventDefault();
    Meteor.logout();
    Router.go('login');
  }
});
