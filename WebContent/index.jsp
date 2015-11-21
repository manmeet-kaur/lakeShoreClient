<html ng-app="app">
	<head>
		<title>Show Products</title>
		<link href="static/css/styles.css" rel="stylesheet"></link>
		<!-- Use Bootstrap -->
		<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/angularjs/1.2.16/angular.min.js"></script>
		<script type="text/javascript" src="static/js/app.js"></script>
		<meta name="viewport" content="width=device-width, initial-scale=1">
	</head>
	
	<body ng-controller="HttpCtrl as app">
  	<div class="container">
		<div class="header">
			<h1 class="custom">Welcome to Lake Shore Mart</h1>
		</div>
		<div class="container">
		    <form>
		    	<table>
					<tr>
						<td><input type="text" ng-model="searchName" size="30"></td>
						<td><button type="button" ng-click="searchProduct(searchName)" class="btn btn-primary btn-sm">
      					<span class="glyphicon glyphicon-search"></span> Search </button></td>
<!-- 						<td><button ng-click="addNew()" class="btn btn-primary btn-sm">
						<span class="glyphicon glyphicon-plus"></span> Add New </button></td>
 -->						<td><button ng-click="resetSearch()"  class="btn btn-info btn-sm">
						<span class="glyphicon glyphicon-refresh"></span> Reset Search </button></td>
					</tr>
				</table>
		    </form>					
		</div>
		<div ng-repeat="product in products" ng-show=app.isHome>
			<h3>{{product.productName}}</h3>
			<p>Price: {{product.price}}</p>
			<p>Quantity: {{product.quantity}}</p>
			<button ng-click="addToCart(product.productId)">Add to Cart</button>
		</div>

		<div ng-hide=isHome ng-show=app.isCartSuccess>
			<h3>{{info.message}}</h3>
			<button ng-click="placeOrder()">Place Order</button>
		</div>

		<div class="footer">@Copyright WebServicesGroup</div>
	</div>
	</body>
	    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
</html>