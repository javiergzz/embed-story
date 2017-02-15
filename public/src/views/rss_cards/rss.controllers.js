angular.module('livepost')
.controller("RssController", function($scope, $firebaseArray, $timeout) {
    // $scope.articles = updates.get("rss");
    $scope.info = false;
	$scope.PATH = "search";
	$scope.query = {
		index: "firebase",
		from: 1,
		q: "",
		size: 1000,
		type: "rss"
    };

    $scope.showResults = function(snap){
    	console.log(snap.val())
    	if( !snap.exists() ) { 
    		$timeout(function() {
		      // $scope.info = true;
		    });
    		return; 
    	}
    	var dat = snap.val().hits;
	    snap.ref.off('value', $scope.showResults);
	    snap.ref.remove();

	    function getUniqueTitles(data){
	    	var uniqueNames = [];
			for(i = 0; i< data.length; i++){    
			    if(uniqueNames.indexOf(data[i]._source.title) === -1){
			        uniqueNames.push(data[i]._source.title);        
			    }        
			}
			return uniqueNames;
	    }

	    function getUniqueValues(data, ids){
	    	var uniqueValues = [];
	    	for(idx in ids){
	    		var allow = true;
	    		for(k in data){
	    			if(ids[idx] == data[k]._source.title){
	    				if(allow == true){
	    					uniqueValues.push(data[k]);
	    					allow = false;	
	    				}
	    				
	    			}
	    		}
	    	}
	    	return uniqueValues;
	    }

	    $timeout(function() {
	    	// console.log(getUniqueTitles(dat.hits));
		    $scope.articles = getUniqueValues(dat.hits, getUniqueTitles(dat.hits));
	    });
    }

	$scope.doSearch = function(e){
		e.preventDefault();
		$timeout(function() {
	      $scope.info = false;
	    });
		var ref = firebase.database().ref().child($scope.PATH);
	    var key = ref.child('request').push($scope.query).key;
	    console.log('search', key, $scope.query);
	    ref.child('response/'+key).on('value', $scope.showResults);
	};

});