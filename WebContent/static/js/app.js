(function(angular) {
  "use strict";
  
  angular.module("myApp.controllers", []);
  angular.module("myApp.directives", []);
  
  angular.module('myApp', [
    'myApp.controllers',
    'myApp.directives'
  ])
  .config(function($routeProvider, $httpProvider) {
//	  $routeProvider.when('/index', {templateUrl: 'views/dummy.html', controller: 'DummyCtrl'});
	  $routeProvider.when('/register', {templateUrl: 'templates/register.html', controller: 'RegisterCtrl'});
//	  $routeProvider.otherwise({redirectTo: '/index'});  
  });
}(angular));