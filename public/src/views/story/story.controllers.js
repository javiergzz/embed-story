angular.module('livepost')
.controller("StoryController", function($scope, $routeParams, $uibModal, views, updates, metrics, localStorageService, story) {
    // run gulp
    // ?-KUmvIcDmiWqELZx5iHy
    
    $scope.key = $routeParams.id;

    $scope.query_updates = "updates/" + $scope.key;
    $scope.query_metrics = "metrics/" + $scope.key;
    $scope.query_story = "posts/" + $scope.key;

    $scope.updates = updates.get($scope.query_updates);
    $scope.link = (window.location != window.parent.location) ?
        document.referrer :
        document.location;

    $scope.photos = [];
    $scope.story_name = '';
    $scope.limit = 5;

    $scope.loadMore = function() {
        $scope.limit += 5;
    };

    $scope.updates.$loaded(function() {
        $('#loader').css('display', 'none');
    });

    $scope.iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    function inIframe() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    if ($scope.iOS) {
        if (inIframe()) {
            $scope.limit = 1000;
        }
    }

    angular.element(document).ready(function() {

        $scope.metrics = metrics.get($scope.query_metrics);
        $scope.story = story.get($scope.query_story);
        $scope.media = story.get($scope.query_updates);


        views.add($scope.query_metrics + "/story_views");

        if (localStorageService.get($scope.key) == null) {
            localStorageService.set($scope.key, $scope.key);
            views.add($scope.query_metrics + "/unique_visits");
        }

        $scope.story.$loaded(function(snap) {
            $scope.story_name = snap.title;
        });

        $scope.media.$loaded(function(snap) {
            var index = 0;
            $scope.slides =[];
            snap.forEach(function(e) {
                if (e.message.indexOf('https://livepostrocks.s3.amazonaws.com/images') != -1 || e.message.indexOf('http://livepostdev.blob.core.windows.net/images') != -1) {
                    $scope.slides.push({
                        image: e.message,
                        id: index++
                    });
                }
            });
            // $scope.slides = $scope.slides.reverse();
        });

    });

    $scope.swapArrayElements = function(arr, indexA, indexB) {
        var temp = arr[indexA];
        arr[indexA] = arr[indexB];
        arr[indexB] = temp;
        return arr;
    };

    $scope.openModal = function(url) {
    	var photo_array = $scope.slides.map(function(e){
    		 if(e.image == url)
    		 	$scope.active = e.id;
    	});    	
    	
    	$uibModal.open({
    		templateUrl: 'story/modalImageTemplate.view.html',
    		controller: 'ModalController',
    		scope: $scope
    	});
    };

    $scope.trackShareOnFacebook = function() {
        views.add($scope.query_metrics + "/shares");
        views.add($scope.query_metrics + "/shares_facebook");
    };

    $scope.trackShareOnTwitter = function() {
        views.add($scope.query_metrics + "/shares");
        views.add($scope.query_metrics + "/shares_twitter");
    };

    $scope.trackVideo = function() {
        views.add($scope.query_metrics + "/video_views");
    };

    $scope.containsUrl = function(status_text) {
        if (new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(status_text)) {
            views.add($scope.query_metrics + "/link_clicks");
        }
    }

    $scope.savePresenceSystem = function() {
        var con = firebase.database().ref('metrics/' + $scope.key + '/connections').push({
            online: firebase.database.ServerValue.TIMESTAMP
        });
        var lastOnlineRef = firebase.database().ref('metrics/' + $scope.key + '/connections/' + con.key + '/offline');
        lastOnlineRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
    };

    // $scope.savePresenceSystem();
});