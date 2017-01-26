angular.module('livepost')
.controller("ModalController", function($scope, views) {
    views.add($scope. query_metrics + "/image_views");
    $scope.myInterval = 0;
    $scope.noWrapSlides = false;
});