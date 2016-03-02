Template.login.events({
  'submit form': function(event) {
    event.preventDefault();
    var uname = event.target.loginUsername.value;
    var pass = event.target.loginPassword.value;

    Meteor.loginWithPassword(uname, pass, function (error) {
      if (error) {
        console.log(error.reason);
      }
      else {
        Router.go('home');
      }
    });

  }
});
