(function() {
	
	var vendor = angular.module("vendor", ['ngAnimate', 'ui.bootstrap']);

	
	vendor.controller("HttpCtrl", function($scope, $uibModal, $http, $location, $q) {
		var baseUrl = 'http://localhost:8080';
		$scope.navTitle = 'Vendor List';
		$scope.home = true;
		$scope.operation="";
		$scope.animationsEnabled = true;
		
		this.isHome = function() {    
			return $scope.home;
		};
		
		var vendorListResponse = $http.get(baseUrl + '/vendors');
		vendorListResponse.success(function(data) {
			$scope.vendors = data;
			console.log("[main] # of items: " + data.length);
			angular.forEach(data, function(element) {
				console.log("[main] vendor: " + element.vendorName);
			});
		});
		vendorListResponse.error(function(data, status, headers, config) {
			alert("Failed to get data from " + baseUrl + "/vendor; status is " + status);
		});
		
		$scope.open = function() {
			var modalInstance = $uibModal.open({
			      animation: $scope.animationsEnabled,
			      templateUrl: 'myModalContent.html',
			      controller: 'ModalInstanceCtrl',
			      size: 'lg',
			      resolve: {
			    	vendorDetails: function () {
			          return $scope.vendorDetails;
			        }
			      }
			    });
		};
		
		$scope.viewDetails = function(vendorId) {
			var vendorDetailsResponse = $http.get(baseUrl + '/vendor/?vendorId=' + vendorId);
			
			$q.all([vendorDetailsResponse]).then(function(arrayOfResults) {
				$scope.vendorDetails = arrayOfResults[0].data;
				$scope.open();
			});
		};
		
	});
	
	vendor.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, vendorDetails) {
		
		$scope.vendorDetails = vendorDetails;
		  $scope.ok = function () {
			$scope.vendorDetails = null;
		    $uibModalInstance.close();
		  };
		});
	
})();