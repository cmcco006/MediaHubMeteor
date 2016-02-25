Template.register.events({
  'submit form': function(event) {
        event.preventDefault();
        var uname = event.target.registerUsername.value;
        var pass = event.target.registerPassword.value;
        Accounts.createUser({
            username: uname,
            password: pass
        });

        Router.go('home');
    }
});
