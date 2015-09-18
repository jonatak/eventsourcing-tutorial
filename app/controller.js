var productsController = angular.module('productsController', []);

productsController.controller('ProductsCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.addToBasket = function(productId) {
	$http.post('/basket/add', {'productId': productId}).
	    then(function(response) {
		loadBasket();
		$scope.basketTab = true;
	    }, function(response) {
	    });
    };
    $http.get('/products').
	success(function(data, status, headers, config) {
	    $scope.products = data.products;
	});

    function loadBank() {
	$http.get('/bank').
	    success(function(data, status, headers, config){
		$scope.bank = data.bank;
	    });
    };

    function loadBasket() {
	$http.get('/basket').
	    success(function(data, status, headers, config) {
		$scope.basket = data;
	    });
    }

    $scope.discardBasket = function() {
	$http.post('basket/discard', {}).
	    success(function(data, status, headers, config) {
		loadBasket();
	    });
    }

    $scope.validateBasket = function() {
	$http.post('basket/validate', {}).
	    success(function(data, status, headers, config) {
		loadBasket();
		loadBank();
	    })
    };

    $scope.basketTab = false;

    loadBasket()
    loadBank()
}]);

productsController.directive('mainElem', function() {
    return {
	templateUrl: 'partials/main',
	replace: true,
	controller: 'ProductsCtrl',
	controllerAs: 'ctrl',
	bindToController: true
    };
});

productsController.directive('productList', function() {
    return {
	templateUrl: 'partials/products',
	replace: true,
	controller: 'ProductsCtrl',
	controllerAs: 'ctrl',
	bindToController: true
    };
});

productsController.directive('basketList', function() {
    return {
	templateUrl: 'partials/basket',
	replace: true,
	controller: 'ProductsCtrl',
	controllerAs: 'ctrl',
	bindToController: true
    };
});

