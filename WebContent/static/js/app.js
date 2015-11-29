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
		$scope.login = true;
		$scope.showSearch = false;
		$scope.showProducts = true;
		$scope.cartSuccess = false;
		$scope.showCart = false;
		$scope.orderSuccess = false;
		$scope.showOrders = false;
		$scope.user = {};
		$scope.error = false;
		$scope.loggedIn = false;
		$scope.loggedOut = false;
		$scope.showAddress = false;
		$scope.showBilling = false;
		$scope.addAddress = false;
		$scope.addressSuccess = false;
		$scope.review = false;
		$scope.custAddr = {
			addrLine1: null,
			addrLine2: null,
			state: null,
			city: null,
			zipCode: null,
			addrId: null
		};
		$scope.updateAddress = false;
		//customer session variables
		//$scope.customerId = null;
		$scope.customerSession = {
				customerId: null,
				customerFirstName: null,
				customerLastName: null,
				customerAddressURL: null,
				customerBillingURL: null,
				customerOrdersURL: null,
				customerCartURL: null
			};
		
		
//		// register user
//		$scope.registerUser = function(id) {
//			var customer = {
//				email: 	
//			};
//			$scope.login = true;
//			$scope.showSearch = false;
//			var response = $http.get(baseUrl + '/customer/addCustomer');
//			response.success(function(data) {
//				$scope.customer = data;
//				console.log("customerId " + $scope.customer.custId);
//				console.log("customer first name " + $scope.customer.custFirstName);
//				console.log("customerId " + $scope.customer.custLastName);
//			});
//			response.error(function(data, status, headers, config) {
//				alert("Failed to get data from " + baseUrl + "/customer/login- status =" + status);
//			});		
//		};
		
		
		// authenticate user
		$scope.loginUser = function(customer) {
			this.user = angular.copy(customer);
			console.log(this.user.email);
			console.log(this.user.password);
			var response = $http.post(baseUrl + '/customer/login', this.user);
			response.success(function(data,status) {
				$scope.error = false;
				$scope.customer = data;
				console.log("customerId " + $scope.customer.custId);
				console.log("customer first name " + $scope.customer.custFirstname);
				console.log("customerId " + $scope.customer.custLastName);
				$scope.login = false;
				$scope.showSearch = true;
				$scope.loggedIn = true;
				$scope.customerId = $scope.customer.custId;
				$scope.customerSession = {
						customerId: $scope.customer.custId,
						customerFirstName: $scope.customer.custFirstname,
						customerLastName: $scope.customer.custLastName,
						customerAddressURL: $scope.customer.links[0].url + $scope.customer.custId,
						customerBillingURL: $scope.customer.links[1].url + $scope.customer.custId,
						customerOrdersURL: $scope.customer.links[2].url + $scope.customer.custId,
						customerCartURL: $scope.customer.links[3].url + $scope.customer.custId
				};
			});
			response.error(function(data, status, headers, config) {
				console.log(data);
				$scope.errorData = data;
				$scope.error = true;
			});		
		};
		
		// logout User
		$scope.logout = function() {
			$scope.navTitle = 'Customer Logged Out';
			$scope.resetSearch();
			$scope.showProducts = false;
			$scope.showSearch = false;
			$scope.review = false;
			$scope.login = true;
			$scope.loggedIn = false;
			$scope.loggedOut = true;
			$scope.customerSession =  null;
			var response = $http.get($scope.customerSession.customerAddressURL);
			response.success(function(data) {
				$scope.products = data;
				console.log("address: " + data)
		    });
			response.error(function(data, status, headers, config) {
				alert("Failed to get data, status=" + status);
			});
		};
		
		// view address details
		$scope.viewAddress = function() {
			$scope.navTitle = 'Customer Address';
			$scope.showAddress = true;
			$scope.addressSuccess = false;
			$scope.showSearch = false;
			$scope.showBilling = false;
			$scope.review = false;
			var response = $http.get($scope.customerSession.customerAddressURL);
			response.success(function(data) {
				$scope.addresses = data;
				$scope.addAddressInfo = data[0].links[1];
				console.log("address: " + $scope.customerSession.customerAddressURL)
				console.log("showAddress: " + $scope.showAddress)
		    });
			response.error(function(data, status, headers, config) {
				alert("Failed to get data, status=" + status);
			});
		};


		// add Address
		$scope.addCustomerAddress = function(custAddr) {
			var addressRequest = {
				addrLine1: custAddr.addrLine1,
				addrLine2: custAddr.addrLine2,
				city: custAddr.city,
				state: custAddr.state,
				zipCode: custAddr.zipCode,
				customerId: $scope.customerSession.customerId
			}
			$http({method: 'POST', url: $scope.addAddressInfo.url, data: addressRequest}).
			 then(function(response) {
				$scope.addrResponse = response.data;
				$scope.addressSuccess = true;
				$scope.addAddress = false;
			},
			function(response) {
				console.log("data is: " + response.data + "=" + response.status);
				$scope.errorData = response.data;
				$scope.error = true;
			});
		};
		// update Address
		$scope.updateAddressModel = function(addressInfo) {
			$scope.updateAddress = true;
			$scope.custAddr = {
				addrLine1: addressInfo.custAddrLine1,
				addrLine2: addressInfo.custAddrLine2,
				city: addressInfo.custCity,
				state: addressInfo.custState,
				zipCode: addressInfo.custZipCode,
				addrId: addressInfo.addrId
			}
			$scope.addAddress = true;
			$scope.showAddress = false;
			console.log("custAddr" + $scope.custAddr.addrLine1);
		};
		
		// reset Address Form
		$scope.resetAddress = function() {
			$scope.custAddr = null;
			$scope.addAddress = false;
			$scope.showAddress = true;
			$scope.updateAddress = false;
			console.log("resetting address form" + $scope.custAddr.addrLine1);
		};
		
		// update Address
		$scope.updateCustomerAddress = function() {
			var addressRequest = {
				addrLine1: $scope.custAddr.addrLine1,
				addrLine2: $scope.custAddr.addrLine2,
				city: $scope.custAddr.city,
				state: $scope.custAddr.state,
				zipCode: $scope.custAddr.zipCode,
				customerId: $scope.customerSession.customerId,
				addrId: $scope.custAddr.addrId
			}
			$http({method: 'PUT', url: $scope.addresses[0].links[0].url, data: addressRequest}).
			 then(function(response) {
				$scope.addrResponse = response.data;
				$scope.addressSuccess = true;
				$scope.updateAddress = false;
				$scope.addAddress = false;
			},
			function(response) {
				console.log("data is: " + response.data + "=" + response.status);
				$scope.errorData = response.data;
				$scope.error = true;
			});
		};
		
		// delete Address
		$scope.deleteCustomerAddress = function(addrId) {
			$http({method: 'DELETE', url: $scope.addresses[0].links[2].url + '?addrId=' + addrId}).
			 then(function(response) {
				$scope.addrResponse = response.data;
				$scope.addressSuccess = true;
				$scope.showAddress = false;
				console.log("deleting customer address - " + addrId + "=" + $scope.addresses[0].links[2].url)
			},
			function(response) {
				console.log("data is: " + response.data + "=" + response.status);
				$scope.errorData = response.data;
				$scope.error = true;
			});
		};
		
		// view billing details
		$scope.viewBilling = function() {
			$scope.navTitle = 'Customer Billing Details';
			$scope.showBilling = true;
			$scope.showSearch = false;
			$scope.showAddress = false;
			$scope.review = false;
			var response = $http.get($scope.customerSession.customerBillingURL);
			response.success(function(data) {
				$scope.products = data;
				console.log("billing: " + data)
		    });
			
			response.error(function(data, status, headers, config) {
				alert("Failed to get data, status=" + status);
			});
		};
		
//		// retrieve all products
//		var response = $http.get(baseUrl + '/products');
//		response.success(function(data) {
//			$scope.products = data;
//
//			console.log("[main] # of items: " + data.length)
//			angular.forEach(data, function(element) {
//				console.log("[main] product: " + element.productName + "-" + element.links[0].url);
//			});
//		});
//		response.error(function(data, status, headers, config) {
//			alert("Failed to get data from " + baseUrl + "/products- status =" + status);
//		});
		
		
		$scope.doSelect = function(id) {
			$scope.selected = id;
		};
		
		$scope.doSelectName = function(name) {
			$scope.selectedName = name;
		};

		// add a product to the cart
		$scope.addToCart = function(url, method) {
			var cartRequest = {
				customerId: $scope.customerId,
				productId: $scope.selected,
				quantity: 1
			};
			console.log('selected ' + $scope.selected);
			var response = $http.post(url , cartRequest);
			response.success(function(data){
				$scope.info = data;
				console.log(this.info);
				$scope.showProducts = false;
				$scope.review = false;
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
			$scope.resetSearch();
			$scope.showProducts = true;
			$scope.review = false;
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
		
		$scope.showReviews = function(links) {
			$scope.navTitle = 'Product Review';
			$scope.review = true;
			$scope.showProducts = false;
			$scope.addReviewLink = links[2];
			var response = $http.get(links[1].url + $scope.selected);
			response.success(function(data) {
				$scope.reviews = data;
				console.log("[product reviews] # of items: " + data.length);
				angular.forEach(data, function(element) {
					console.log("[product reviews] desc: " + element.reviewDesc);
				});

		    });
			
			
			response.error(function(data, status, headers, config) {
				alert("Failed to get data, status=" + status);
			});
		};
		
		// add a review
		$scope.postReview = function(desc) {
			var reviewRequest = {
				customerId: $scope.customerId,
				productId: $scope.selected,
				reviewDescription: desc,
				reviewType: 'product'
			};
			console.log('selected ' + $scope.selected);
			var response = $http.post($scope.addReviewLink.url, reviewRequest);
			response.success(function(data){
				$scope.reviews = data;
				console.log("[product reviews] # of items: " + data.length);
				angular.forEach(data, function(element) {
					console.log("[product reviews] desc: " + element.reviewDesc);
				});
			});
			response.error(function(data, status, headers, config) {
				alert("Failed to post data, status=" + status);
			});
		};
		
		//Reset page
		$scope.resetSearch = function() {
			$scope.login = false;
			$scope.showSearch = true;
			$scope.showProducts = false;
			$scope.cartSuccess = false;
			$scope.showCart = false;
			$scope.orderSuccess = false;
			$scope.showOrders = false;
			$scope.review = false;
			$scope.user = {};
			$scope.error = false;
			$scope.showBilling = false;
			$scope.showAddress = false;
			$scope.addAddress = false;
			$scope.addressSuccess = false;
		};
		
		// view cart
		$scope.viewCart = function() {
			$scope.review = false;
			$http({method: 'GET', url: $scope.customerSession.customerCartURL}).
			 then(function(response) {
				$scope.items = response.data;
				$scope.showCart = true;
				$scope.cartSuccess = false;
			},
			function(response) {
				console.log("data is: " + response.data + "=" + response.status);
				$scope.errorData = response.data;
				$scope.error = true;
			});
		};

		
		// place order
		$scope.placeOrder = function(url) {
			$scope.review = false;
			var response = $http.put(url + $scope.customer.custId);
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
		$scope.viewOrders = function() {
			$scope.review = false;
			var response = $http.get($scope.customerSession.customerOrdersURL);
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
		
		//check order status
		$scope.checkOrderStatus = function(url, orderId) {
			$scope.review = false;
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

		
		$scope.decideHttpRequest = function(data) {
			console.log("url is " + data.url);
			console.log("method is " + data.action);
			console.log("rel is " + data.rel);
		};
		
//		$scope.resetSearch = function(name) {
//			var app = this;
//			$scope.operation="";
//			$scope.clearForm();
//			$scope.isSaveDisabled = true;
//			$scope.isDeleteDisabled = true;
//			$scope.navTitle = 'All Products';
//			$scope.searchName = '';
//			
//			var response = $http.get('/product');
//			response.success(function(data) {
//				$scope.actors = data;
////				$scope.$apply();
//				console.log("[resetSearch] # of items: " + data.length);
//		    });
//			
//			response.error(function(data, status, headers, config) {
//				alert("Failed to get data, status=" + status);
//			});
//		};
		
		
		$scope.viewAllCustomer = function() {
			var url = "http://" + $window.location.host + "/lakeShoreWebProject/customer.html";
	        $window.location.href = url;
		};
	});	
})();