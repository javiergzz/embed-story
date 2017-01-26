angular.module('livepost')
.controller('homeController', function ($scope, $location, $routeParams) {
    'use strict';
    $scope.value = window.location.search;
    $scope.key = $scope.value.substring(1, $scope.value.length);
    if($scope.key != null && $scope.key.trim().length > 0){
    	$location.path( "/story/" + $scope.key );
    }
});