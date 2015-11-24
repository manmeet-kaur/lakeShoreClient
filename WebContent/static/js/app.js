(function() {
	
	var app = angular.module("app", ['ngRoute']);
	
	app.config(['$routeProvider',
	            function($routeProvider) {
	              $routeProvider.
	                when('/', {
	                  templateUrl: 'index.jsp',
	                  controller: 'mainController'
	              }).
	                when('/cartAdded', {
	                  templateUrl: 'views/status.html',
	                }).
	                otherwise({
	                  redirectTo: '/index.jsp'
	                });
	          }]);
	
	app.controller("mainController", function($scope, $http, $window) {
		var baseUrl = 'http://localhost:8080';
		var app = this;
		$scope.navTitle = 'All Products';
		$scope.showProducts = true;
		$scope.cartSuccess = false;
		$scope.showCart = false;
		$scope.orderSuccess = false;
		$scope.showOrders = false;
		// retrieve all products
		var response = $http.get(baseUrl + '/products');
		response.success(function(data) {
			$scope.products = data;

			console.log("[main] # of items: " + data.length)
			angular.forEach(data, function(element) {
				console.log("[main] product: " + element.productName + "-" + element.links[0].url);
			});
		});
		response.error(function(data, status, headers, config) {
			alert("Failed to get data from " + baseUrl + "/products- status =" + status);
		});
		
		
		$scope.doSelect = function(id) {
			$scope.selected = id;
		};

		// add a product to the cart
		$scope.addToCart = function(url, method) {
			var cartRequest = {
				customerId: 10000174,
				productId: $scope.selected,
				quantity: 1
			};
			console.log('selected ' + $scope.selected);
			var response = $http.post(url , cartRequest);
			response.success(function(data){
				$scope.info = data;
				console.log(this.info);
				$scope.showProducts = false;
				$scope.cartSuccess = true;
			});
			response.error(function(data, status, headers, config) {
				alert("Failed to add to cart, status = " + status);
			});
		};
		
		// search a product by product name
		$scope.searchProduct = function(name) {
			var app = this;
			$scope.navTitle = 'Search Criteria';
			
			var response = $http.get(baseUrl + '/product/?name=' + name);
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
		
		// view cart
		$scope.viewCart = function() {
			var response = $http.get($scope.info.links[0].url + 10000174);
			response.success(function(data) {
				$scope.items = data;
				$scope.showCart = true;
				$scope.cartSuccess = false;
				console.log("[viewCart] # of items: " + data.length);
				angular.forEach(data, function(element) {
					console.log("[viewCart] product:" + element.productId + "-" + element.links[0].url);
				});
				$scope.decideHttpRequest($scope.info.links[0]);
			});
			response.error(function(data, status, headers, config) {
				alert("Failed to get data, status=" + status);
			});
		};
		
		// place order
		$scope.placeOrder = function(url) {
			var response = $http.put(url + 10000174);
			response.success(function(data) {
				$scope.order = data;
				console.log("placed order Successfully " + data.message + "=" + data.links[0].url);
				$scope.showCart = false;
				$scope.orderSuccess = true;
				console.log("order status " + $scope.orderSuccess);
			});
			response.error(function(data, status, headers, config) {
				alert("Failed to place order, status=" + status);
			});
		};
		
		// view orders
		$scope.viewOrders = function(url) {
			var response = $http.get(url + 10000174);
			response.success(function(data) {
				$scope.orders = data;
				$scope.orderSuccess = false;
				$scope.showOrders = true;
				console.log("show Orders " + $scope.showOrders);
				angular.forEach(data, function(element) {
					console.log("[viewOrders] order :" + element.orderId + "-" + element.links[0].url);
				});
			});
			response.error(function(data, status, headers, config) {
				alert("Failed to place order, status=" + status);
			});
		};
		
		$scope.checkOrderStatus = function(url, orderId) {
			var response = $http.get(url + orderId);
			response.success(function(data) {
				$scope.orderData = data;				
				$scope.showOrders = false;
				$scope.showOrderStatus = true;
			});
			response.error(function(data, status, headers, config) {
				alert("Failed to place order, status=" + status);
			});
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
		
		$scope.decideHttpRequest = function(data) {
			console.log("url is " + data.url);
			console.log("method is " + data.action);
			console.log("rel is " + data.rel);
		};
		
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
//				$scope.$apply();
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