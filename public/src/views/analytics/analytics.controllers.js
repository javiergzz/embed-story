angular.module('livepost')
.controller("AnalyticsController", function($scope, $routeParams, analytics, analyticsUpdates, $timeout) {
    // ?-KUmvIcDmiWqELZx5iHy
    $scope.total_updates = 0;
    $scope.key = $routeParams.id;
    $scope.analytics = analytics.get("metrics/" + $scope.key);
    $scope.updates = analyticsUpdates.get("updates/" + $scope.key);
    	
    $scope.updates.on("value", function(_updates){
    	$timeout(function(){
    		$scope.total_updates = _updates.numChildren();
		},0);
    });

    $scope.returnSeconds = function(date){
        var seconds = date.getUTCSeconds();
        if(seconds < 10 && seconds > 0){
            return '0' + seconds;
        }
        return seconds;
    };

    $scope.analytics.$loaded(function(snap){
    	var times = [];
    	for(i in snap.connections){
    		if(snap.connections[i].offline != null && snap.connections[i].online != null){
    			times.push((snap.connections[i].offline - snap.connections[i].online));	
    		}
    	}
        if(times.length > 0){
            var sum = times.reduce(function(a, b){ 
               return a + b
            });
            var average = (sum/times.length);
            var date = new Date(average);
            $scope.average_time = date.getUTCMinutes() + ':'+ $scope.returnSeconds(date) + ' m';
        }
    });
    
});