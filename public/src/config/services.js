angular.module('livepost')
.factory("story", function($firebaseObject) {
    var Actions = {};
    Actions.get = function(path){
        var ref = firebase.database().ref().child(path).orderByChild("timestamp");
        return $firebaseObject(ref);
    };
    return Actions;
  }
)
.factory("updates", function($firebaseArray) {
    var Actions = {};
    Actions.get = function(path){
        var ref = firebase.database().ref().child(path).orderByChild("timestamp");
        return $firebaseArray(ref);
    };
    return Actions;
  }
)
.factory("metrics", function() {
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
)
.factory("views", function() {
    var Actions = {};
    Actions.add = function(path){
        if(path){
            firebase.database().ref().child(path).transaction(function(currentValue) {
                return (currentValue||0)+1;
            }, function(error) {
                if( error ) {
                    console.log(error);
                }
            });
            return;
        }
        console.log("Path could not be null.");
        return null;
    };
    return Actions;
  }
)
.factory("analytics", function($firebaseObject) {
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
.factory("analyticsUpdates", function() {
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
)
.factory('FrankBuilder', function(PUSH, $resource){
    return  $resource("http://localhost:3002/frank/v1/top-stories", {}, {
            post : {
                method: 'POST',
                transformRequest : function(data){
                    return JSON.stringify(data);
                },
                isArray: true
            }
        }
    );
});