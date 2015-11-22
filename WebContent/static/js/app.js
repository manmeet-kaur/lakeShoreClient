(function() {
	
	var app = angular.module("app", []);

	
	app.controller("HttpCtrl", function($scope, $http, $window) {
		var baseUrl = 'http://localhost:8080';
		var app = this;
		$scope.navTitle = 'All Products';
		$scope.home = true;
		$scope.cartSuccess = false;
		$scope.operation="";
		$scope.isSaveDisabled = true;
		$scope.isDeleteDisabled = true;
		
		this.isHome = function() {
			return $scope.home;
		};
		
		var response = $http.get('http://localhost:8080/products');
		response.success(function(data) {
			$scope.products = data;
			console.log("[main] # of items: " + data.length);
			angular.forEach(data, function(element) {
				console.log("[main] product: " + element.name);
			});
		});
		response.error(function(data, status, headers, config) {
			alert("Failed to get data from " + baseUrl + "/products- status =" + status);
		});
		
		$scope.addToCart = function(productId) {
			var cartRequest = {
				customerId: 10000174,
				productId: productId,
				quantity: 1
			};
			var response = $http.post(baseUrl + '/cart/add', cartRequest);
			response.success(function(data){
				$scope.info = data;
				$scope.cartSuccess = true;
				$scope.home = false;
			});
			response.error(function(data, status, headers, config) {
				alert("Failed to add to cart, status = " + status);
			});
		};
		
		$scope.isCartSuccess = function() {
			return $scope.cartSuccess;
		};
		
//		$scope.getProduct = function(name) {
//			var response = $http.get('/product/?name='+ name );
//			
//			response.success(function(data) {
//				$scope.product = data;
//		    })
//			
//			response.error(function(data, status, headers, config) {
//				alert("Failed to get data, status=" + status);
//			})
//		};
		
		$scope.searchProduct = function(name) {
			var app = this;
			$scope.navTitle = 'Search Criteria';
			
			var response = $http.get('http://localhost:8080/product/?name=' + name);
			response.success(function(data) {
				$scope.products = data;

				console.log("[searchProduct] # of items: " + data.length)
				angular.forEach(data, function(element) {
					console.log("[searchProduct] product: " + element.name);
				});

		    });
			
			response.error(function(data, status, headers, config) {
				alert("Failed to get data, status=" + status);
			});
		};
		
		$scope.clearForm = function() {
			$scope.actor = {
					productId:'',
					productName:'',
					productType:'',
					quantity:'',
					vendorName:''
			};
		};
		
//		$scope.addNew = function(element) {
//			$scope.operation="create";
//			$scope.clearForm();
//			main.id.focus();
//			$scope.isSaveDisabled = false;
//			$scope.isDeleteDisabled = true;
//		}
//		
//		$scope.saveActor = function(id) {
//			$scope.jsonObj = angular.toJson($scope.actor, false);
//			console.log("[update] data: " + $scope.jsonObj);
//
//			if ($scope.operation == "update") {
//				var response = $http.put('/RestfulWebServiceExample/rest/actors/' + id, $scope.jsonObj);
//				response.success(function(data, status, headers, config) {
//					$scope.resetSearch();
//			    });
//				
//				response.error(function(data, status, headers, config) {
//					alert("AJAX failed to get data, status=" + status);
//				})
//			} else if ($scope.operation == "create") {
//				var response = $http.post('/RestfulWebServiceExample/rest/actors/add', $scope.jsonObj);
//				response.success(function(data, status, headers, config) {
//					$scope.resetSearch();
//			    });
//				
//				response.error(function(data, status, headers, config) {
//					alert("AJAX failed to get data, status=" + status);
//				})	
//			}
//		};
//		
//		$scope.deleteActor = function(id) {
//			var response = $http.delete('/RestfulWebServiceExample/rest/actors/' + id);
//			response.success(function(data, status, headers, config) {
//				$scope.resetSearch();
//			});
//				
//			response.error(function(data, status, headers, config) {
//				alert("AJAX failed to get data, status=" + status);
//			})
//		};
		
		$scope.resetSearch = function(name) {
			var app = this;
			$scope.operation="";
			$scope.clearForm();
			$scope.isSaveDisabled = true;
			$scope.isDeleteDisabled = true;
			$scope.navTitle = 'All Products';
			$scope.searchName = '';
			
			var response = $http.get('/product');
			response.success(function(data) {
				$scope.actors = data;
				$scope.$apply();
				console.log("[resetSearch] # of items: " + data.length);
		    });
			
			response.error(function(data, status, headers, config) {
				alert("Failed to get data, status=" + status);
			});
		};
		
		$scope.viewAllCustomer = function() {
			var url = "http://" + $window.location.host + "/lakeShoreWebProject/customer.html";
	        $window.location.href = url;
		};
		
	});	
})();