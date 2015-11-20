(function(angular) {
  "use strict";
  
//  angular.module("myApp.controllers").controller("RegisterCtrl", function($scope, $q) {
//    
//    $scope.passwordPattern = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
//    
//    
//  });
  
  var app = angular.module('myApp.controllers', []);
  
  app.controller('RegisterCtrl', ['$scope', 'UsersFactory', '$location',
                                      function ($scope, UsersFactory, $location) {
	  
	  $scope.passwordPattern = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
		/* callback for ng-click 'createNewUser': */
		$scope.createNewUser = function () {
		UsersFactory.create($scope.user);
		$location.path('/user-list');
		}
}]);
  
}(angular));