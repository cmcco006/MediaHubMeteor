Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  yieldTemplates: {
    'nav': {to: 'nav'},
    'footer': {to: 'footer'},
  }
});

var OnBeforeActions = {
  loginRequired: function () {
    if (!Meteor.userId()) {
      this.render('nav', {
        to: 'nav',
      });
      this.render('footer', {
        to: 'footer',
      });
      this.render('login');
    }
    else {
      this.next();
    }
  }   //end loginRequired
};

Router.before(OnBeforeActions.loginRequired, {
  except: [
    'home',
    'login',
    'register',
  ]
});

Router.map( function () {
  this.route('home', {
    path: '/'
  });

  this.route('login', {
    path: '/login'
  });

  this.route('register', {
    path: '/register'
  });

  this.route('playlists', {
    path: '/playlists'
  });

  this.route('search', {
    path: '/search'
  });

  this.route('library', {
    path: '/library'
  });
});
