angular.module('livepost', [
	'ngRoute',
    'ngResource',
    'ngAnimate',
    'ngSanitize',
    'LocalStorageModule',
    'ui.bootstrap',
    'firebase'
])
.config(function($routeProvider, MyRoutesProvider, $sceProvider, localStorageServiceProvider) {
    "use strict";
    var MyRoutes = MyRoutesProvider.$get();
    angular.forEach(MyRoutes, function(route) {
        $routeProvider.when(route.path, route.options);
    });
    $routeProvider.otherwise({
        redirectTo: "/404"
    });
    $sceProvider.enabled(false); 
    localStorageServiceProvider.setStorageType('sessionStorage');
})
.run(function($rootScope, MyRoutes) {
    "use strict";
    $rootScope.$on('$routeChangeStart', function(e, next) {});
    $rootScope.$on("$routeChangeSuccess", function() {
        window.scrollTo(0, 0);
    });

    var config = {
        apiKey: "AIzaSyCbxo9Jz-44782HpXjwAkWRHfV1Qis5C_k",
        authDomain: "developer-livepost.firebaseapp.com",
        databaseURL: "https://developer-livepost.firebaseio.com",
        storageBucket: "developer-livepost.appspot.com",
        messagingSenderId: "579641317343"
    };
    firebase.initializeApp(config);
})
.controller('main', function($scope, $route) {
    "use strict";
    $scope.$route = $route;
});