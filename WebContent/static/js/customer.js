(function() {
	
	var customer = angular.module("customer", ['ngAnimate', 'ui.bootstrap']);

	
	customer.controller("HttpCtrl", function($scope, $uibModal, $http, $location, $q) {
		var baseUrl = 'http://localhost:8080';
		$scope.navTitle = 'Customer List';
		$scope.home = true;
		$scope.operation="";
		$scope.animationsEnabled = true;
		
		this.isHome = function() {    
			return $scope.home;
		};
		
		var customerListResponse = $http.get(baseUrl + '/customers');
		customerListResponse.success(function(data) {
			$scope.customers = data;
			console.log("[main] # of items: " + data.length);
			angular.forEach(data, function(element) {
				console.log("[main] customer: " + element.custFirstname);
			});
		});
		customerListResponse.error(function(data, status, headers, config) {
			alert("Failed to get data from " + baseUrl + "/customers; status is " + status);
		});
		
		$scope.open = function() {
			var modalInstance = $uibModal.open({
			      animation: $scope.animationsEnabled,
			      templateUrl: 'myModalContent.html',
			      controller: 'ModalInstanceCtrl',
			      size: 'lg',
			      resolve: {
			    	customerDetails: function () {
			          return $scope.customerDetails;
			        },
			        customerAddr: function () {
			          return $scope.customerAddr;
			        },
			        customerBillingDetailsResponse: function () {
			          return $scope.customerBillingDetailsResponse;
			        }
			      }
			    });
		};
		
		$scope.viewDetails = function(custId) {
			var customerDetailsResponse = $http.get(baseUrl + '/customer/?customerId=' + custId),
				customerAddrResponse = $http.get(baseUrl + '/customeraddress/?customerId=' + custId),
				customerBillingDetailsResponse = $http.get(baseUrl + '/billing/?customerId=' + custId);
			
			$q.all([customerDetailsResponse, customerAddrResponse, customerBillingDetailsResponse]).then(function(arrayOfResults) {
				$scope.customerDetails = arrayOfResults[0].data;
				$scope.customerAddr = arrayOfResults[1].data[0];
				$scope.customerBillingDetailsResponse = arrayOfResults[2].data[0];
				$scope.open();
			});
		};
		
	});
	
	customer.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, customerDetails, customerAddr, customerBillingDetailsResponse) {
		
		$scope.customerDetails = customerDetails;
		$scope.customerAddr = customerAddr;
		$scope.customerBillingDetailsResponse = customerBillingDetailsResponse;
		  $scope.ok = function () {
			$scope.customerDetails = null;
			$scope.customerAddr = null;
			$scope.customerBillingDetailsResponse = null;
		    $uibModalInstance.close();
		  };
		});
	
})();