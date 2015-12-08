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
		$scope.showReview = false;
		$scope.checkingOut = false;
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
					else if(data.rel == "productSearch")
						$scope.productSearchLink = data;

				};
				$scope.message = "Welcome to LakeShoreMart.You can start shopping and update address/billing in your profile";
				$scope.messageFlag = true;
				$scope.showAllProducts();
				}
			},function(response){
				$scope.errorData = response.data;
				$scope.setErrorMessage(response.status);
				$scope.error = true;
			});	
		};
		
		
		$scope.setErrorMessage = function(status) {
			if(status == 404)
				$scope.errorMessage= "Oops!! Its 404. The resource you are trying to access does not exist. ";
			else if(status == 500)
				$scope.errorMessage= "Oops!! Its 500. Looks like server is experiencing some problem. Please try after some time. ";
			else if(status == 405)
				$scope.errorMessage= "Oops!! Its 405. Not a valid method. Please rectify or contact the system administrator";
			else if(status == 400)
				$scope.errorMessage= "Oops!! Its 400, a bad request. Please correct it.";
			else
				$scope.errorMessage= "Oops!! Looks like the server is having issues. Please try again later.";
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
					else if(data.rel == "productSearch")
						$scope.productSearchLink = data;
					else if(data.rel == "showVendorProducts")
						$scope.viewVendorProducts = data;
					else if(data.rel == "showVendorOrders")
						$scope.viewVendorOrders = data;
				};
				$scope.loginForm.$setPristine();
			}, function(response) {
				$scope.errorData = response.data;
				$scope.setErrorMessage(response.status);
				if(response.status == 404)
					$scope.setErrorMessage("Invalid UserID/Password");
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
			$scope.viewAddressLink = null;
			$scope.updateCustomerLink = null;
			$scope.viewCartLink = null;
			$scope.viewOrdersLink = null;
			$scope.viewBillingLink = null;
			$scope.viewAllLink = null;
			$scope.viewVendorProducts = null;
			$scope.viewVendorOrders = null;
			$scope.productSearchLink = null;
			$scope.customer = null;
			$scope.searchName = null;
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
				console.log("in success response: " + $scope.checkingOut);
				$scope.billingInfo = response.data;
				if($scope.billingInfo[0].custBillId == null & $scope.checkingOut == true) {
					$scope.messageFlag = true;
					$scope.message = "Please update your payment/address info in your profile before proceeding to checkout.";
					$scope.checkingOut = false;
				}
				else {
					$scope.showBilling = true;
					
					console.log("billing: " + $scope.billingInfo.length);
					element = $scope.billingInfo[0];
					for(i=0;i<element.links.length;i++) {
						if(element.links[i].rel == "addBilling") {
							$scope.addBillingLink = element.links[i];
							break;
						}
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
		
		$scope.showAllProducts = function() {
			$scope.resetAll();
			console.log("hello");
			if($scope.viewAllLink)
				$scope.processLink($scope.viewAllLink);
			else if($scope.viewVendorProducts)
				$scope.processLink($scope.viewVendorProducts);
			
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
				var element = $scope.products[0];
				console.log("==>" + element.links[0]);
				for(i=0; i < element.links.length; i++) {
					this.data = element.links[i]; 
					if (data.rel == "showReviews")
						$scope.showReviewsLink = true;
					else if(data.rel == "addCart")
						$scope.addCartLink = true;
					else if(data.rel == "addProduct")
						$scope.addProductLink = true;
					else if(data.rel == "deleteProduct")
						$scope.deleteProductLink = true;
					else if(data.rel == "updateProduct")
						$scope.updateProductLink = true;
					else if(data.rel == "addReview")
						$scope.addReviewLink = true;
				};
				console.log("showProducts"+$scope.showProducts);
				console.log("showReview"+$scope.showReview);
			},function(response) {
				console.log("data is: " + response.data + "=" + response.status);
				$scope.errorData = response.data;
				$scope.setErrorMessage(response.status);
				$scope.error = true;
			});
		}
			
		
		$scope.doSelect = function(id) {
 			$scope.selected = id;
 		};
		
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
			
			$scope.processLink($scope.productSearchLink);
			$http({
				method: this.linkAttributes.method, 
				url: this.linkAttributes.url + name, 
				dataType: this.dataType,
				data: '', 
				headers: {
					"Content-Type": this.linkAttributes.mediaType
				}
			}).then(function(response){
				$scope.products = response.data;
				$scope.showSearch = true;
				$scope.showProducts = true;
				console.log("# of products" + $scope.products.length);
				var element1 = $scope.products[0];
				for(i=0; i < element1.links.length; i++) {
					this.data = element1.links[i]; 
					if (data.rel == "showReviews")
						$scope.showReviewsLink = true;
					else if(data.rel == "addCart")
						$scope.addCartLink = true;
					else if(data.rel == "addProduct")
						$scope.addProductLink = true;
					else if(data.rel == "deleteProduct")
						$scope.deleteProductLink = true;
					else if(data.rel == "updateProduct")
						$scope.updateProductLink = true;
					else if(data.rel == "addReview")
						$scope.addReviewLink = true;
				};
			}
			
			, function(response){
				console.log("data is: " + response.data + "=" + response.status);
				$scope.errorData = response.data;
				$scope.setErrorMessage(response.status);
				$scope.error = true;
			});
			
		};
		
		$scope.showReviews = function(product) {
			$scope.navTitle = 'Product Review';
			//$scope.resetAll();
			$scope.selectedProductId = product.productId;
			
			for(i=0;i<product.links.length; i++) {
				var element = product.links[i]; 
				if(element.rel == "showReviews") {
					$scope.processLink(element);
					break;
				}
			}
			console.log("show Review: " + this.linkAttributes.url);
			$http({
				method: this.linkAttributes.method, 
				url: this.linkAttributes.url, 
				dataType: this.dataType,
				data: '', 
				headers: {
					"Content-Type": this.linkAttributes.mediaType
				}
			}).then(function(response){
				$scope.showReview = true;
				$scope.showProducts = true;
				$scope.showSearch = true;
				$scope.reviews = response.data;
				console.log("showproducts -" + $scope.showProducts);
				console.log("review -" + $scope.showReview);
				console.log("[product reviews] # of items: " + response.data.length);
				angular.forEach(data, function(element) {
					console.log("[product reviews] desc: " + element.reviewDesc);
				});
			},function(response){
				console.log("data is: " + response.data + "=" + response.status);
				$scope.errorData = response.data;
				$scope.setErrorMessage(response.status);
				$scope.error = true;				
			});
		};
		
		// add a review
		$scope.postReview = function(product, reviewDesc) {

			for(i=0;i<product.links.length; i++) {
				var element = product.links[i]; 
				if(element.rel == "addReview") {
					$scope.processLink(element);
					break;
				}
			}
			var reviewRequest = {
				customerId: $scope.customerSession.customerId,
				productId: product.productId,
				reviewDescription: reviewDesc,
				reviewType: 'product'
			};
			console.log('selected ' + product.productId);

			$http({
				method: this.linkAttributes.method, 
				url: this.linkAttributes.url, 
				dataType: this.dataType,
				data: reviewRequest, 
				headers: {
					"Content-Type": this.linkAttributes.mediaType
				}
			}).then(function(response){
				$scope.reviews = response.data;
				$scope.showReview = true;
				$scope.showProducts = true;
				console.log("[product reviews] # of items: " + response.data.length);
				angular.forEach(data, function(element) {
					console.log("[product reviews] desc: " + element.reviewDesc);
				});
				
			},function(response){
				console.log("data is: " + response.data + "=" + response.status);
				$scope.errorData = response.data;
				$scope.setErrorMessage(response.status);
				$scope.error = true;				
			});
		};

		
		// Update product Quantity
		$scope.updateProductInfo = function(product) {
			var productRequest = {
				vendorId: $scope.customerSession.customerId,
				productId: product.productId,
				quantity: product.quantity,
				price: product.price
			};
			console.log('selected for update' + product.productId);
			for(i=0;i<product.links.length; i++) {
				var element = product.links[i]; 
				if(element.rel == "updateProduct") {
					$scope.processLink(element);
					break;
				}
			}
			
			$http({
				method: this.linkAttributes.method, 
				url: this.linkAttributes.url, 
				dataType: this.dataType,
				data: productRequest, 
				headers: {
					"Content-Type": this.linkAttributes.mediaType
				}
			}).then(function(response){
				$scope.productInfo = response.data;
				$scope.message = $scope.productInfo.message;
				$scope.messageFlag = true;
				
			},function(response){
				console.log("data is: " + response.data + "=" + response.status);
				$scope.errorData = response.data;
				$scope.setErrorMessage(response.status);
				$scope.error = true;				
			});
		};

		// Delete product 
		$scope.deleteProductInfo = function(product) {
			console.log('selected for delete' + product.productId);
			for(i=0;i<product.links.length; i++) {
				var element = product.links[i]; 
				if(element.rel == "deleteProduct") {
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
				var productDeleteInfo = response.data;
				$scope.message = productDeleteInfo.message;
				$scope.messageFlag = true;
				
			},function(response){
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
			$scope.checkingOut = true; // should not be included in the resetAll() function
			console.log("checkout value: " + $scope.checkingOut);
			$scope.viewBilling();
			console.log("checkout value: " + $scope.checkingOut);
			console.log("showBilling value: " + $scope.showBilling);
		};
		
		// select payment
		$scope.selectPayment = function(links) {
			$scope.checkingOut = false; // should not be included in the resetAll() function
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
				if($scope.order.links == null) {
					$scope.messageFlag = true;
					$scope.message = $scope.order.message;
				} else
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
			if($scope.viewOrdersLink)
				$scope.processLink($scope.viewOrdersLink);
			else if($scope.viewVendorOrders)
				$scope.processLink($scope.viewVendorOrders);
			
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
					$scope.message = "No Orders exist for you.";
					$scope.messageFlag = true;
				}
				else {
					$scope.orders = response.data;
					$scope.showOrders = true;
					
					var element = $scope.orders[0];
					console.log("==>" + element.links[0]);
					for(i=0; i < element.links.length; i++) {
						this.data = element.links[i]; 
						if (data.rel == "cancelOrder")
							$scope.cancelOrderLink = true;
						else if(data.rel == "checkStatus")
							$scope.checkStatusLink = true;
						else if(data.rel == "viewOrderDetails")
							$scope.viewOrderDetailsLink = true;
						else if(data.rel == "shipOrder")
							$scope.shipOrderLink = true;
					};
					
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
		
		// ship order
		$scope.shipOrder = function(links) {
			$scope.resetAll();
			
			for(i=0;i<links.length; i++) {
				var element = links[i]; 
				if(element.rel == "shipOrder") {
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
				$scope.shipInfo = response.data;
				$scope.shipSuccess = true;
			}, function(response) {
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
			$scope.loggedOut = false;
			$scope.showSearch = false;
			$scope.showProducts = false;
			$scope.cartSuccess = false;
			$scope.showCart = false;
			$scope.orderSuccess = false;
			$scope.showOrders = false;
			$scope.showReview = false;
			$scope.error = false;
			$scope.errorData = false;
			$scope.showBilling = false;
			$scope.showAddress = false;
			$scope.addAddress = false;
			$scope.addressSuccess = false;
			$scope.billSuccess = false;
			$scope.addBilling = false;
			$scope.message = null;
			$scope.messageFlag = false;
			$scope.selectPaymentSuccess = false;
			$scope.showOrderStatus = false;
			$scope.cancelSuccess = false;
			$scope.showRegister = false;
			$scope.errorMessage = null;
			$scope.addProductLink = false;
			$scope.deleteProductLink = false;
			$scope.updateProductLink = false;
			$scope.updateProductLink = false;
			$scope.addCartLink = false;
			$scope.showReviewLink = false;
			$scope.cancelOrderLink = false;
			$scope.shipOrderLink = false;
			$scope.checkStatusLink = false;
			$scope.shipSuccess = false;
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