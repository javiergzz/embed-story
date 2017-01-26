angular.module('livePost', ['firebase'])
.controller("Analytics", function($scope, metrics, updates, $timeout) {
    //python -m SimpleHTTPServer
	$scope.total_updates = 0;
    var value = window.location.search;
    var query_metrics = "metrics/" + value.substring(1, value.length);
    var query_updates = "updates/" + value.substring(1, value.length);
    $scope.metrics = metrics.get(query_metrics);
    $scope.updates = updates.get(query_updates);
    
    $scope.updates.on("value", function(_updates){
    	$timeout(function(){
    		$scope.total_updates = _updates.numChildren()
		},0);
    });

    $scope.returnSeconds = function(date){
        var seconds = date.getUTCSeconds();
        if(seconds < 10 && seconds > 0){
            return '0' + seconds;
        }
        return seconds;
    };

    $scope.metrics.$loaded(function(snap){
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

})
.run(function(){
    var config = {
        apiKey: "AIzaSyCbxo9Jz-44782HpXjwAkWRHfV1Qis5C_k",
        authDomain: "developer-livepost.firebaseapp.com",
        databaseURL: "https://developer-livepost.firebaseio.com",
        storageBucket: "developer-livepost.appspot.com",
        messagingSenderId: "579641317343"
    };
    firebase.initializeApp(config);
})
.factory("metrics", function($firebaseObject) {
    var Actions = {};
    Actions.get = function(path){
    	if(path){
    		var ref = firebase.database().ref().child(path);
	    	return $firebaseObject(ref);	
    	}
		console.log("Path could not be null.");
		return null;
    };
    return Actions;
  }
)
.factory("updates", function() {
    var Actions = {};
    Actions.get = function(path){
    	if(path){
    		var ref = firebase.database().ref().child(path);
	    	return ref;	
    	}
		console.log("Path could not be null.");
		return null;
    };
    return Actions;
  }
);
