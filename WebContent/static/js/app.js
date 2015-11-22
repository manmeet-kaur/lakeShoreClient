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
		app.home = true;
		app.cartSuccess = false;
		this.showCart = false;
		this.orderSuccess = false;
		
		// retrieve all products
		var response = $http.get(baseUrl + '/products');
		response.success(function(data) {
			$scope.products = data;
			console.log("isHome " + app.home)
			console.log("[main] # of items: " + data.length)
			angular.forEach(data, function(element) {
				console.log("[main] product: " + element.productName);
			});
		})
		response.error(function(data, status, headers, config) {
			alert("Failed to get data from " + baseUrl + "/products- status =" + status);
		})
		

		// add a product to the cart
		$scope.addToCart = function(productId, url) {
			var cartRequest = {
				customerId: 10000174,
				productId: productId,
				quantity: 1
			};
			var response = $http.post(url, cartRequest);
			response.success(function(data){
				$scope.info = data;
				app.cartSuccess = true;
			})
			response.error(function(data, status, headers, config) {
				alert("Failed to add to cart, status = " + status);
			})
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
			})
		};
		
		// view cart
		$scope.viewCart = function(url) {
			var response = $http.get(url);
			response.succcess(function(data) {
				this.items = data;
				console.log("[viewCart] # of items: " + data.length);
				angular.forEach(data, function(element) {
					console.log("[viewCart] product:" + element.name + "-" + element.quantity);
				});
				this.showCart = true;
				this.cartSuccess = false;
			});
			response.error(function(data, status, headers, config) {
				alert("Failed to get data, status=" + status);
			});
		};
		
		// place order
		$scope.placeOrder = function(url) {
			var response = $http.get(url);
			response.succcess(function(data) {
				this.items = data;
				console.log("[placeOrder] # of items: " + data.length);
				this.orderSuccess = true;
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