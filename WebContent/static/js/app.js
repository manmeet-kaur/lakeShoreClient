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
	
<<<<<<< HEAD
	app.controller("mainController", function($scope, $http, $window) {
		var baseUrl = 'http://localhost:8080';
		var app = this;
		$scope.navTitle = 'All Products';
		app.home = true;
		app.cartSuccess = false;
		this.showCart = false;
		this.orderSuccess = false;
=======
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
>>>>>>> origin/master
		
		// retrieve all products
		var response = $http.get(baseUrl + '/products');
		response.success(function(data) {
			$scope.products = data;
<<<<<<< HEAD
			console.log("isHome " + app.home)
			console.log("[main] # of items: " + data.length)
=======
			console.log("[main] # of items: " + data.length);
>>>>>>> origin/master
			angular.forEach(data, function(element) {
				console.log("[main] product: " + element.productName);
			});
		});
		response.error(function(data, status, headers, config) {
			alert("Failed to get data from " + baseUrl + "/products- status =" + status);
		});
		

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
<<<<<<< HEAD
				app.cartSuccess = true;
			})
=======
				$scope.cartSuccess = true;
				$scope.home = false;
			});
>>>>>>> origin/master
			response.error(function(data, status, headers, config) {
				alert("Failed to add to cart, status = " + status);
			});
		};
		
<<<<<<< HEAD
=======
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
>>>>>>> origin/master
		
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
		
<<<<<<< HEAD
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
=======
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
>>>>>>> origin/master
		};
		
		$scope.viewAllCustomer = function() {
			var url = "http://" + $window.location.host + "/lakeShoreWebProject/customer.html";
	        $window.location.href = url;
		};
	});	
})();