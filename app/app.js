angular.module('ecommerce', ['ui.bootstrap', 'ngRoute', 'productsController']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/products',
        controller: 'ProductsCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode({
	enable:true,
	requireBase: false
    });
  }]);
