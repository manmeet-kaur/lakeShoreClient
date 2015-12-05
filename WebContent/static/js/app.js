(function() {
	
	var app = angular.module("app", ['ngRoute']);
	
	app.config(['$routeProvider',
	            function($routeProvider) {
	              $routeProvider.
	                when('/', {
	                  templateUrl: 'index.html',
	                  controller: 'mainController'
	              }).
	                when('/cartAdded', {
	                  templateUrl: 'views/status.html',
	                }).
	                otherwise({
	                  redirectTo: '/index.html'
	                });
	          }]);

	
	app.controller("mainController", function($rootScope, $scope, $http, $window, $route, $routeParams, $location) {
		var baseUrl = 'http://localhost:8080';
		var entryPoint = baseUrl + '/customer/login';
		var app = this;
		this.$route = $route;
		this.$location = $location;
		this.$routeParams = $routeParams;
		$scope.navTitle = 'All Products';
		$scope.login = true;
		$scope.showSearch = false;
		$scope.showProducts = true;
		$scope.cartSuccess = false;
		$scope.showCart = false;
		$scope.orderSuccess = false;
		$scope.showOrders = false;
		$scope.error = false;
		$scope.loggedIn = false;
		$scope.loggedOut = false;
		$scope.showAddress = false;
		$scope.showBilling = false;
		$scope.addAddress = false;
		$scope.showRegister = false;
		$scope.addressSuccess = false;
		$scope.review = false;
		$scope.checkOut = false;
		$scope.custAddr = {
			addrLine1: null,
			addrLine2: null,
			state: null,
			city: null,
			zipCode: null,
			addrId: null
		};
		$scope.message = "";
		$scope.messageFlag = false;
		$scope.updateAddress = false;
		//customer session variables
		$scope.customerSession = {
				customerId: null,
				customerFirstName: null,
				customerLastName: null,
				customerLinks: []
		};
		this.datatype = null;
		this.linkAttributes = {
			rel: null,
			action: null,
			mediaType: null,
			url: null
		};

		
		// register user
		$scope.registerUser = function(registration) {
			$scope.resetAll();
			var customerRequest = {
				email: registration.email,
				firstName: registration.firstName,
				lastName: registration.lastName,
				password: registration.password
			};
			
			$http({
				method: 'POST', 
				url: baseUrl + '/customer/addCustomer', 
				dataType: 'json',
				data: customerRequest, 
				headers: {
					"Content-Type": 'application/json'
				}
			}).then(function(response){
				$scope.customer = response.data;
				if(response.data.length == 0){
					$scope.message = "Account with this email already exists. Please login or use a different email id";
					$scope.messageFlag = true;
					$scope.showRegister = true;
				}
				else {	
				$scope.form.$setPristine();
				$scope.showSearch = true;
				$scope.loggedIn = true;
				$scope.customerSession = {
						customerId: $scope.customer.custId,
						customerFirstName: $scope.customer.custFirstname,
						customerLastName: $scope.customer.custLastName,
				};

				for(i=0; i < $scope.customer.links.length; i++) {
					this.data = $scope.customer.links[i]; 
					if (data.rel == "viewAddress")
						$scope.viewAddressLink = data;
					else if(data.rel == "updateCustomer")
						$scope.updateCustomerLink = data;
					else if(data.rel == "viewCart")
						$scope.viewCartLink = data;
					else if(data.rel == "viewOrders")
						$scope.viewOrdersLink = data;
					else if(data.rel == "viewBilling")
						$scope.viewBillingLink = data;
					else if(data.rel == "showAll")
						$scope.viewAllLink = data;
				};
				$scope.message = "Welcome to LakeShoreMart.You can start shopping and update address/billing in your profile";
				$scope.messageFlag = true;
				$scope.showAll();
				}
			},function(response){
				$scope.errorData = response.data;
				$scope.setErrorMessage(response.status);
				$scope.error = true;
			});	
		};
		
		$scope.setErrorMessage = function(status) {
			if(status == 404)
				$scope.errorMessage= "Oops!! Its 404. Looks like you have entered the wrong information. Please correct the error. ";
			else if(status == 500)
				$scope.errorMessage= "Oops!! Its 500. Looks like server is experiencing some problem. Please try after some time. ";
			else if(status == 405)
				$scope.errorMessage= "Oops!! Its 405. Not a valid method. Please rectify or contact the system administrator";
		}
		
		// authenticate user
		$scope.loginUser = function(customer) {
			$scope.resetAll();
			this.user = angular.copy(customer);
			$http({method: 'POST', url: entryPoint, data: this.user}).
			then(function(response) {
				$scope.customer = response.data;
				$scope.login = false;
				$scope.showSearch = true;
				$scope.loggedIn = true;
				$scope.customerSession = {
						customerId: $scope.customer.custId,
						customerFirstName: $scope.customer.custFirstname,
						customerLastName: $scope.customer.custLastName,
				};

				for(i=0; i < $scope.customer.links.length; i++) {
					this.data = $scope.customer.links[i]; 
					if (data.rel == "viewAddress")
						$scope.viewAddressLink = data;
					else if(data.rel == "updateCustomer")
						$scope.updateCustomerLink = data;
					else if(data.rel == "viewCart")
						$scope.viewCartLink = data;
					else if(data.rel == "viewOrders")
						$scope.viewOrdersLink = data;
					else if(data.rel == "viewBilling")
						$scope.viewBillingLink = data;
					else if(data.rel == "showAll")
						$scope.viewAllLink = data;
				};
				$scope.loginForm.$setPristine();
				$scope.showAll();
			}, function(response) {
				$scope.errorData = response.data;
				$scope.setErrorMessage(response.status);
				$scope.error = true;
				$scope.login = true;
			});	
		};
		
		// logout User
		$scope.logout = function() {
			$scope.navTitle = 'Customer Logged Out';
			$scope.resetAll();
			$scope.login = true;
			$scope.loginForm.$setPristine();
			$scope.loggedIn = false;
			$scope.loggedOut = true;
			$scope.customerSession =  null;
		};
		
		// view address details
		$scope.viewAddress = function() {
			$scope.navTitle = 'Customer Address';
			$scope.processLink($scope.viewAddressLink);
			$scope.resetAll();
			$http({
				method: this.linkAttributes.method, 
				url: this.linkAttributes.url, 
				dataType: this.dataType,
				data: '', 
				headers: {
					"Content-Type": this.linkAttributes.mediaType
				}
			}).then(function(response){
				$scope.addresses = response.data;
				$scope.showAddress = true;
				console.log("length of addresses: " + $scope.addresses.length);
				element = $scope.addresses[0];
				for(i=0;i<element.links.length;i++)
					if(element.links[i].rel == "addAddress") {
						$scope.addAddressLink = element.links[i];
						break;
					}
				console.log("in success of show address: " + $scope.showAddress)
			}, function(response) {
				console.log("data is: " + response.data + "=" + response.status);
				$scope.errorData = response.data;
				$scope.setErrorMessage(response.status);
				$scope.error = true;
			});
		};

		// add Address
		$scope.addCustomerAddress = function(custAddr) {
			$scope.processLink($scope.addAddressLink);
			var addressRequest = {
				addrLine1: custAddr.addrLine1,
				addrLine2: custAddr.addrLine2,
				city: custAddr.city,
				state: custAddr.state,
				zipCode: custAddr.zipCode,
				customerId: $scope.customerSession.customerId
			}
			$scope.processLink($scope.addAddressLink);
			$http({
				method: this.linkAttributes.method, 
				url: this.linkAttributes.url, 
				data: addressRequest,
				dataType: this.dataType,
				headers: {
					"Content-Type": this.linkAttributes.mediaType
					}
				}).
			 then(function(response) {
				$scope.addrResponse = response.data;
				$scope.addressSuccess = true;
				$scope.addAddress = false;
			},
			function(response) {
				console.log("data is: " + response.data + "=" + response.status);
				$scope.errorData = response.data;
				$scope.setErrorMessage(response.status);
				$scope.error = true;
			});
		};

		// update Address Model for showing previous values in form
		$scope.updateAddressModel = function(addressInfo) {
			$scope.updateAddress = true;
			$scope.custAddr = {
				addrLine1: addressInfo.custAddrLine1,
				addrLine2: addressInfo.custAddrLine2,
				city: addressInfo.custCity,
				state: addressInfo.custState,
				zipCode: addressInfo.custZipCode,
				addrId: addressInfo.addrId,
				links: addressInfo.links
			}
			$scope.addAddress = true;
			$scope.showAddress = false;
			console.log("custAddr" + $scope.custAddr.addrLine1);
		};
		
		// reset Address Form
		$scope.resetAddressForm = function() {
			console.log("in here - reset address");
			$scope.custAddr = null;
			$scope.addAddress = false;
			$scope.showAddress = true;
			$scope.updateAddress = false;
		};
		
		// reset Billing Form
		$scope.resetBillingForm = function() {
			console.log("in here - reset billing");
			$scope.bill = null;
			$scope.addBilling = false;
			$scope.showBilling = true;
		};
		

		
		// update Address
		$scope.updateCustomerAddress = function(custAddr) {
			for(i = 0; i < custAddr.links.length; i++) {
				if(custAddr.links[i].rel == "updateAddress") {
					$scope.processLink(custAddr.links[i]);
					break;
				}
			}
			var addressRequest = {
				addrLine1: $scope.custAddr.addrLine1,
				addrLine2: $scope.custAddr.addrLine2,
				city: $scope.custAddr.city,
				state: $scope.custAddr.state,
				zipCode: $scope.custAddr.zipCode,
				customerId: $scope.customerSession.customerId,
				addrId: $scope.custAddr.addrId
			}
			$http({
				method: this.linkAttributes.method, 
				url: this.linkAttributes.url, 
				data: addressRequest,
				dataType: this.dataType,
				headers: {
					"Content-Type": this.linkAttributes.mediaType
					}
				}).
			 then(function(response) {
				$scope.addrResponse = response.data;
				$scope.addressSuccess = true;
				$scope.updateAddress = false;
				$scope.addAddress = false;
				$scope.addressForm.$setPristine();
			},
			function(response) {
				console.log("data is: " + response.data + "=" + response.status);
				$scope.errorData = response.data;
				$scope.error = true;
			});
		};
		
		// delete Address
		$scope.deleteCustomerAddress = function(links) {
			for(i = 0; i < links.length; i++) {
				if(links[i].rel == "deleteAddress") {
					$scope.processLink(links[i]);
					break;
				}
			}
			$http({
				method: this.linkAttributes.method, 
				url: this.linkAttributes.url, 
				dataType: this.dataType,
				data: '', 
				headers: {
					"Content-Type": this.linkAttributes.mediaType
					}
				}).
			 then(function(response) {
				$scope.addrResponse = response.data;
				$scope.addressSuccess = true;
				$scope.showAddress = false;
				console.log("deleted address successfully");
			},
			function(response) {
				console.log("data is: " + response.data + "=" + response.status);
				$scope.errorData = response.data;
				$scope.setErrorMessage(response.status);
				$scope.error = true;
			});
		};
		
		// view billing details
		$scope.viewBilling = function() {
			$scope.navTitle = 'Customer Billing Details';
			console.log("billing Link: " + $scope.viewBillingLink);
			$scope.processLink($scope.viewBillingLink);
			$scope.resetAll();
			$http({
				method: this.linkAttributes.method, 
				url: this.linkAttributes.url, 
				dataType: this.dataType,
				data: '', 
				headers: {
					"Content-Type": this.linkAttributes.mediaType
					}
			}).then(function(response) {
				console.log("in success response");
				$scope.showBilling = true;
				$scope.billingInfo = response.data;
				console.log("billing: " + $scope.billingInfo.length);

				element = $scope.billingInfo[0];
				for(i=0;i<element.links.length;i++) {
					if(element.links[i].rel == "addBilling") {
						$scope.addBillingLink = element.links[i];
						break;
					}
				}

			}, function(response) {
				console.log("data is: " + response.data + "=" + response.status);
				$scope.errorData = response.data;
				$scope.setErrorMessage(response.status);
				$scope.error = true;
			});
		};
		
		// add Billing
		$scope.addCustomerBilling = function(bill) {
			$scope.resetAll();
			$scope.processLink($scope.addBillingLink);
			var billingRequest = {
				billAddrLine1: bill.billAddrLine1,
				billAddrLine2: bill.billAddrLine2,
				billCity: bill.billCity,
				billState: bill.billState,
				billZipCode: bill.billZipCode,
				cardType: bill.cardType,
				cardName: bill.cardName,
				cardNo: bill.cardNo,
				cvv: bill.cvv,
				cardExpiry: bill.cardExpiry,
				customerId: $scope.customerSession.customerId
			}
			$scope.processLink($scope.addBillingLink);
			$http({
				method: this.linkAttributes.method, 
				url: this.linkAttributes.url, 
				data: billingRequest,
				dataType: this.dataType,
				headers: {
					"Content-Type": this.linkAttributes.mediaType
					}
				}).
			 then(function(response) {
				$scope.billResponse = response.data;
				$scope.billSuccess = true;
				$scope.addBilling = false;
			},
			function(response) {
				console.log("data is: " + response.data + "=" + response.status);
				$scope.errorData = response.data;
				$scope.setErrorMessage(response.status);
				$scope.error = true;
			});
		};
		
		
		//delete customer billing
		$scope.deleteCustomerBilling = function(links) {
			for(i = 0; i < links.length; i++) {
				if(links[i].rel == "deleteBilling") {
					$scope.processLink(links[i]);
					break;
				}
			}
			$scope.resetAll();
			$http({
				method: this.linkAttributes.method, 
				url: this.linkAttributes.url, 
				dataType: this.dataType,
				data: '', 
				headers: {
					"Content-Type": this.linkAttributes.mediaType
					}
				}).
			 then(function(response) {
				$scope.billResponse = response.data;

				$scope.billSuccess = true;
				console.log("deleted address successfully");
			},
			function(response) {
				console.log("data is: " + response.data + "=" + response.status);
				$scope.errorData = response.data;
				$scope.setErrorMessage(response.status);
				$scope.error = true;
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
		
		$scope.showAll = function() {
			$scope.resetAll();
			$scope.processLink($scope.viewAllLink);
			console.log("show products link: " + $scope.viewAllLink.url);
			$http({
				method: this.linkAttributes.method, 
				url: this.linkAttributes.url, 
				dataType: this.dataType,
				data: '', 
				headers: {
					"Content-Type": this.linkAttributes.mediaType
				}
			}).then(function(response){
				$scope.products = response.data;
				$scope.showSearch = true;
				$scope.showProducts = true;			
			},function(response) {
				console.log("data is: " + response.data + "=" + response.status);
				$scope.errorData = response.data;
				$scope.setErrorMessage(response.status);
				$scope.error = true;
			});
		}
		
		
		$scope.doSelectName = function(name) {
			$scope.selectedName = name;
		};

		// add a product to the cart
		$scope.addToCart = function(links, productId) {
			var cartRequest = {
				customerId: $scope.customerSession.customerId,
				productId: productId,
				quantity: 1
			};
			$scope.resetAll();
			for(i=0;i<links.length; i++) {
				var element = links[i]; 
				if(element.rel == "addCart") {
					$scope.processLink(element);
					break;
				}
			}
			$http({
				method: this.linkAttributes.method, 
				url: this.linkAttributes.url, 
				dataType: this.dataType,
				data: cartRequest, 
				headers: {
					"Content-Type": this.linkAttributes.mediaType
				}
			}).then(function(response){
				$scope.info = response.data;
				console.log(this.cart);
				$scope.cartSuccess = true;				
			},function(response) {
				console.log("data is: " + response.data + "=" + response.status);
				$scope.errorData = response.data;
				$scope.setErrorMessage(response.status);
				$scope.error = true;
			});
		};
		
		// search a product by product name
		$scope.searchProduct = function(name) {
			var app = this;
			$scope.navTitle = 'Search Criteria';
			$scope.resetAll();
			$scope.showSearch = true;
			$scope.showProducts = true;
			var response = $http.get(baseUrl + '/product/?name=' + name);
			response.success(function(data) {
				$scope.products = data;
				console.log("[searchProduct] # of items: " + data.length)
				angular.forEach(data, function(element) {
					console.log("[searchProduct] product: " + element.name);
				});

		    });
			
			response.error(function(data, status, headers, config) {
				console.log("data is: " + response.data + "=" + response.status);
				$scope.errorData = response.data;
				$scope.setErrorMessage(response.status);
				$scope.error = true;
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
				console.log("data is: " + response.data + "=" + response.status);
				$scope.errorData = response.data;
				$scope.setErrorMessage(response.status);
				$scope.error = true;
			});
		};
		
		// add a review
		$scope.postReview = function(desc) {
			var reviewRequest = {
				customerId: $scope.customerSession.customerId,
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
				console.log("data is: " + response.data + "=" + response.status);
				$scope.errorData = response.data;
				$scope.setErrorMessage(response.status);
				$scope.error = true;
			});
		};
		

		
		// view cart
		$scope.viewCart = function() {
			$scope.processLink($scope.viewCartLink);
			$scope.resetAll();
			$http({
				method: this.linkAttributes.method, 
				url: this.linkAttributes.url, 
				dataType: this.dataType,
				data: '', 
				headers: {
					"Content-Type": this.linkAttributes.mediaType
				}
			}).then(function(response) {
				if(response.data.length == 0) {
					$scope.message = "Your cart is empty. Search products and continue shopping.";
					$scope.messageFlag = true;
				}
				else {
					$scope.items = response.data;
					$scope.showCart = true;
				}
			},
			function(response) {
				console.log("data is: " + response.data + "=" + response.status);
				$scope.errorData = response.data;
				$scope.setErrorMessage(response.status);
				$scope.error = true;
			});
		};
		
		// check Out
		$scope.checkOut = function() {
			console.log("in checkout");
			$scope.resetAll();
			$scope.checkOut = true; // should not be included in the resetAll() function
			console.log("checkout value: " + $scope.checkOut);
			$scope.viewBilling();
		};
		
		// select payment
		$scope.selectPayment = function(links) {
			$scope.checkOut = false; // should not be included in the resetAll() function
			$scope.resetAll();
			for(i=0;i<links.length; i++) {
				var element = links[i]; 
				if(element.rel == "selectPayment") {
					$scope.processLink(element);
					break;
				}
			}
			$http({
				method: this.linkAttributes.method, 
				url: this.linkAttributes.url, 
				dataType: this.dataType,
				data: '', 
				headers: {
					"Content-Type": this.linkAttributes.mediaType
				}
			}).then(function(response){
				$scope.paymentInfo = response.data;
				$scope.selectPaymentSuccess = true;
			},function(response) {
				console.log("data is: " + response.data + "=" + response.status);
				$scope.errorData = response.data;
				$scope.setErrorMessage(response.status);
				$scope.error = true;
			});
		};
		
		// place order
		$scope.placeOrder = function(links) {
			$scope.resetAll();
			
			for(i=0;i<links.length; i++) {
				var element = links[i]; 
				if(element.rel == "placeOrder") {
					$scope.processLink(element);
					break;
				}
			}
			
			$http({
				method: this.linkAttributes.method, 
				url: this.linkAttributes.url, 
				dataType: this.dataType,
				data: '', 
				headers: {
					"Content-Type": this.linkAttributes.mediaType
				}
			}).then(function(response) {
				$scope.order = response.data;
				$scope.orderSuccess = true;
			}, function(response) {
				console.log("data is: " + response.data + "=" + response.status);
				$scope.errorData = response.data;
				$scope.setErrorMessage(response.status);
				$scope.error = true;
			});
		};
		
		// view orders
		$scope.viewOrders = function() {
			$scope.processLink($scope.viewOrdersLink);
			$scope.resetAll();
			$http({
				method: this.linkAttributes.method, 
				url: this.linkAttributes.url, 
				dataType: this.dataType,
				data: '', 
				headers: {
					"Content-Type": this.linkAttributes.mediaType
				}
			}).then(function(response){
				if(response.data.length == 0) {
					$scope.message = "No Orders exist for you. Please continue Shopping.";
					$scope.messageFlag = true;
				}
				else {
					$scope.orders = response.data;
					$scope.showOrders = true;
					angular.forEach(response.data, function(element) {
						console.log("[viewOrders] order :" + element.orderId + "-" + element.links[0].url);
					});
				}
			},function(response) {
				console.log("data is: " + response.data + "=" + response.status);
				$scope.errorData = response.data;
				$scope.setErrorMessage(response.status);
				$scope.error = true;
			});
		};
		
		// cancel order
		$scope.cancelOrder = function(links) {
			$scope.resetAll();
			
			for(i=0;i<links.length; i++) {
				var element = links[i]; 
				if(element.rel == "cancelOrder") {
					$scope.processLink(element);
					break;
				}
			}
			
			$http({
				method: this.linkAttributes.method, 
				url: this.linkAttributes.url, 
				dataType: this.dataType,
				data: '', 
				headers: {
					"Content-Type": this.linkAttributes.mediaType
				}
			}).then(function(response) {
				$scope.orderInfo = response.data;
				$scope.cancelSuccess = true;
			}, function(response) {
				console.log("data is: " + response.data + "=" + response.status);
				$scope.errorData = response.data;
				$scope.setErrorMessage(response.status);
				$scope.error = true;
			});
		};

		//check order status
		$scope.checkOrderStatus = function(links) {
			$scope.resetAll();
			
			for(i=0;i<links.length; i++) {
				var element = links[i]; 
				if(element.rel == "checkStatus") {
					$scope.processLink(element);
					break;
				}
			}
			
			$http({
				method: this.linkAttributes.method, 
				url: this.linkAttributes.url, 
				dataType: this.dataType,
				data: '',
//				transformResponse: appendTransform($http.defaults.transformResponse, function(value) {
//					var x2s = new X2S();
//					var json = x2s.xml_str2json(data);
//					return json;
//				}),
				headers: {
					"Content-Type": this.linkAttributes.mediaType
				}
			}).then(function(response, headers){
				$scope.orderData = response.data;
				console.log($scope.orderData.orderId);
				console.log($scope.orderData.orderStatus);
				$scope.showOrderStatus = true;
			}, function(response){
				console.log("data is: " + response.data + "=" + response.status);
				$scope.errorData = response.data;
				$scope.setErrorMessage(response.status);
				$scope.error = true;
			});
		};	
		
		$scope.processLink = function(data) {
			if(data.mediaType == "application/json") 
				this.dataType = "json";
			else if(data.mediaType == "application/xml")
				this.dataType = "xml";
			$scope.linkAttributes = {
					rel: data.rel,
					method: data.action,
					mediaType: data.mediaType,
					url: data.url
				}
		};
		
		//Reset page
		$scope.resetAll = function() {
			console.log("in reset all");
			$scope.login = false;
			$scope.showSearch = false;
			$scope.showProducts = false;
			$scope.cartSuccess = false;
			$scope.showCart = false;
			$scope.orderSuccess = false;
			$scope.showOrders = false;
			$scope.review = false;
			$scope.error = false;
			$scope.errorData = false;
			$scope.showBilling = false;
			$scope.showAddress = false;
			$scope.addAddress = false;
			$scope.addressSuccess = false;
			$scope.billSuccess = false;
			$scope.addBilling = false;
			$scope.message = "";
			$scope.messageFlag = false;
			$scope.selectPaymentSuccess = false;
			$scope.showOrderStatus = false;
			$scope.cancelSuccess = false;
			$scope.showRegister = false;
			$scope.errorMessage = "";
		};
		
		$scope.resetMessages = function() {
			$scope.message = "";
			$scope.messageFlag = false;
		};
		
		$scope.resetRegisterForm = function() {
				$scope.form.$setPristine();
				$scope.registration = null;
		}
		
		$scope.viewAllCustomer = function() {
			var url = "http://" + $window.location.host + "/lakeShoreWebProject/customer.html";
	        $window.location.href = url;
		};
	});	
})();