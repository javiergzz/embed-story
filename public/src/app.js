angular.module('livepost', [
	'ngRoute',
    'ngResource',
    'ngAnimate',
    'ngSanitize',
    'LocalStorageModule',
    'ui.bootstrap',
    'firebase',
    'fix-image-orientation',
    'dndLists',
    'angular-loading-bar',
    'cfp.loadingBar'
])
.config(function($routeProvider, MyRoutesProvider, $sceProvider, localStorageServiceProvider, cfpLoadingBarProvider) {
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
    cfpLoadingBarProvider.includeSpinner = false;
})
.run(function($rootScope, MyRoutes) {
    "use strict";
    $rootScope.$on('$routeChangeStart', function(e, next) {});
    $rootScope.$on("$routeChangeSuccess", function() {
        window.scrollTo(0, 0);
    });

    var config = {
        apiKey: "AIzaSyA1pwq4QX3CfIRsYbS_8djG9NGBEyXgZ-I",
        authDomain: "rss-trusted-news.firebaseapp.com",
        databaseURL: "https://rss-trusted-news.firebaseio.com",
        storageBucket: "rss-trusted-news.appspot.com",
        messagingSenderId: "3204402711"
    };

    // var config = {
    //     apiKey: "AIzaSyCbxo9Jz-44782HpXjwAkWRHfV1Qis5C_k",
    //     authDomain: "developer-livepost.firebaseapp.com",
    //     databaseURL: "https://developer-livepost.firebaseio.com",
    //     storageBucket: "developer-livepost.appspot.com",
    //     messagingSenderId: "579641317343"
    // };
    
    firebase.initializeApp(config);
})
.controller('main', function($scope, $route) {
    "use strict";
    $scope.$route = $route;
});