/*global angular $ */
angular.module('livepost')
.directive('videoLoader', function(){
    return function (scope, element, attrs){
        scope.$watch(attrs.videoLoader, function(){
            element[0].addEventListener("play", function(){
                if(scope.trackVideo){
                    scope.trackVideo();
                    scope.$apply();    
                }
            });
            element[0].addEventListener("click", function(e){     
                if(scope.openLightboxModal){
                    scope.openLightboxModal(e.srcElement.currentSrc);
                    scope.$apply();
                }
            });
        });
    }
})
.directive('wmBlock', function ($parse) {
    'use strict';
    return {
        scope: {
            wmBlockLength: '='
        },
        link: function (scope, elm, attrs) {
            elm.bind('keypress', function (e) {
                if (elm[0].value.length > scope.wmBlockLength) {
                    e.preventDefault();
                    return false;
                }
            });
        }
    };
})
.directive('angularLazyLoad', ['$window', '$timeout', '$rootScope', function($window, $timeout, $rootScope) {
    return {
        restrict: 'EA',
        scope: true,
        link: function(scope, element, attrs) {
            var elements = [],
                threshold = Number(attrs.threshold) || 0;
            function getElements() {
                elements =  Array.prototype.slice.call(element[0].querySelectorAll('img[data-src], iframe[data-src], div[data-src]'));
                if(elements.length > 0 ) {
                    loadMedia();
                }
            }
            function inViewPort(media) {
                var coordinates = media.getBoundingClientRect();
                return (
                    coordinates.bottom + threshold >= 0 &&
                    coordinates.left >= 0 &&
                    coordinates.top - threshold <= (window.innerHeight || document.documentElement.clientHeight) &&
                    coordinates.right <= (window.innerWidth || document.documentElement.clientWidth)
                );
            };

            //replaces 'data-src' with 'src' for the elements found.
            function loadMedia() {
                elements = elements.reduce(function ( arr, item ) {
                    var src = item.getAttribute("data-src");
                    if (!inViewPort ( item)) {
                        arr.push(item);
                        return arr;
                    }
                    switch(item.tagName) {
                        case "IMG":
                        case "IFRAME":
                            item.src = src;
                            break;
                        case "DIV":
                            item.style.backgroundImage = "url("+src+")";
                            break;
                        default:
                            arr.push(item);
                    }

                    return arr;
                }, []);
            };

            angular.element(document).ready(function () {
                getElements();
            });

            function reloadElements () {
                $timeout(getElements, 0);
            }

            function reloadMedia ( ) {
                $timeout(loadMedia, 0);
            }
            //listens for partials loading events using ng-include
            scope.$on('$includeContentLoaded', reloadElements);

            //listens for selective loading, that is, if the developer using this directive wants to load the elements programmatically he can emit a selectiveLoad event
            $rootScope.$on('selectiveLoad', reloadElements);

            //calls loadMedia for each window scroll event
            angular.element($window).bind('scroll', reloadMedia);

            //calls loadMedia for each window scroll event
            angular.element($window).bind('resize', reloadMedia);

            //calls loadMedia for each element scroll event
            angular.element(element).bind('scroll', reloadMedia);
        }
    }
}])
.value('THROTTLE_MILLISECONDS', null).directive('infiniteScroll', [
  '$rootScope', '$window', '$interval', 'THROTTLE_MILLISECONDS', function($rootScope, $window, $interval, THROTTLE_MILLISECONDS) {
    return {
      scope: {
        infiniteScroll: '&',
        infiniteScrollContainer: '=',
        infiniteScrollDistance: '=',
        infiniteScrollDisabled: '=',
        infiniteScrollUseDocumentBottom: '=',
        infiniteScrollListenForEvent: '@'
      },
      link: function(scope, elem, attrs) {
        var changeContainer, checkInterval, checkWhenEnabled, container, handleInfiniteScrollContainer, handleInfiniteScrollDisabled, handleInfiniteScrollDistance, handleInfiniteScrollUseDocumentBottom, handler, height, immediateCheck, offsetTop, pageYOffset, scrollDistance, scrollEnabled, throttle, unregisterEventListener, useDocumentBottom, windowElement;
        windowElement = angular.element($window);
        scrollDistance = null;
        scrollEnabled = null;
        checkWhenEnabled = null;
        container = null;
        immediateCheck = true;
        useDocumentBottom = false;
        unregisterEventListener = null;
        checkInterval = false;
        height = function(elem) {
          elem = elem[0] || elem;
          if (isNaN(elem.offsetHeight)) {
            return elem.document.documentElement.clientHeight;
          } else {
            return elem.offsetHeight;
          }
        };
        offsetTop = function(elem) {
          if (!elem[0].getBoundingClientRect || elem.css('none')) {
            return;
          }
          return elem[0].getBoundingClientRect().top + pageYOffset(elem);
        };
        pageYOffset = function(elem) {
          elem = elem[0] || elem;
          if (isNaN(window.pageYOffset)) {
            return elem.document.documentElement.scrollTop;
          } else {
            return elem.ownerDocument.defaultView.pageYOffset;
          }
        };
        handler = function() {
          var containerBottom, containerTopOffset, elementBottom, remaining, shouldScroll;
          if (container === windowElement) {
            containerBottom = height(container) + pageYOffset(container[0].document.documentElement);
            elementBottom = offsetTop(elem) + height(elem);
          } else {
            containerBottom = height(container);
            containerTopOffset = 0;
            if (offsetTop(container) !== void 0) {
              containerTopOffset = offsetTop(container);
            }
            elementBottom = offsetTop(elem) - containerTopOffset + height(elem);
          }
          if (useDocumentBottom) {
            elementBottom = height((elem[0].ownerDocument || elem[0].document).documentElement);
          }
          remaining = elementBottom - containerBottom;
          shouldScroll = remaining <= height(container) * scrollDistance + 1;
          if (shouldScroll) {
            checkWhenEnabled = true;
            if (scrollEnabled) {
              if (scope.$$phase || $rootScope.$$phase) {
                return scope.infiniteScroll();
              } else {
                return scope.$apply(scope.infiniteScroll);
              }
            }
          } else {
            if (checkInterval) {
              $interval.cancel(checkInterval);
            }
            return checkWhenEnabled = false;
          }
        };
        throttle = function(func, wait) {
          var later, previous, timeout;
          timeout = null;
          previous = 0;
          later = function() {
            previous = new Date().getTime();
            $interval.cancel(timeout);
            timeout = null;
            return func.call();
          };
          return function() {
            var now, remaining;
            now = new Date().getTime();
            remaining = wait - (now - previous);
            if (remaining <= 0) {
              $interval.cancel(timeout);
              timeout = null;
              previous = now;
              return func.call();
            } else {
              if (!timeout) {
                return timeout = $interval(later, remaining, 1);
              }
            }
          };
        };
        if (THROTTLE_MILLISECONDS != null) {
          handler = throttle(handler, THROTTLE_MILLISECONDS);
        }
        scope.$on('$destroy', function() {
          container.unbind('scroll', handler);
          if (unregisterEventListener != null) {
            unregisterEventListener();
            unregisterEventListener = null;
          }
          if (checkInterval) {
            return $interval.cancel(checkInterval);
          }
        });
        handleInfiniteScrollDistance = function(v) {
          return scrollDistance = parseFloat(v) || 0;
        };
        scope.$watch('infiniteScrollDistance', handleInfiniteScrollDistance);
        handleInfiniteScrollDistance(scope.infiniteScrollDistance);
        handleInfiniteScrollDisabled = function(v) {
          scrollEnabled = !v;
          if (scrollEnabled && checkWhenEnabled) {
            checkWhenEnabled = false;
            return handler();
          }
        };
        scope.$watch('infiniteScrollDisabled', handleInfiniteScrollDisabled);
        handleInfiniteScrollDisabled(scope.infiniteScrollDisabled);
        handleInfiniteScrollUseDocumentBottom = function(v) {
          return useDocumentBottom = v;
        };
        scope.$watch('infiniteScrollUseDocumentBottom', handleInfiniteScrollUseDocumentBottom);
        handleInfiniteScrollUseDocumentBottom(scope.infiniteScrollUseDocumentBottom);
        changeContainer = function(newContainer) {
          if (container != null) {
            container.unbind('scroll', handler);
          }
          container = newContainer;
          if (newContainer != null) {
            return container.bind('scroll', handler);
          }
        };
        changeContainer(windowElement);
        if (scope.infiniteScrollListenForEvent) {
          unregisterEventListener = $rootScope.$on(scope.infiniteScrollListenForEvent, handler);
        }
        handleInfiniteScrollContainer = function(newContainer) {
          if ((newContainer == null) || newContainer.length === 0) {
            return;
          }
          if (newContainer.nodeType && newContainer.nodeType === 1) {
            newContainer = angular.element(newContainer);
          } else if (typeof newContainer.append === 'function') {
            newContainer = angular.element(newContainer[newContainer.length - 1]);
          } else if (typeof newContainer === 'string') {
            newContainer = angular.element(document.querySelector(newContainer));
          }
          if (newContainer != null) {
            return changeContainer(newContainer);
          } else {
            throw new Error("invalid infinite-scroll-container attribute.");
          }
        };
        scope.$watch('infiniteScrollContainer', handleInfiniteScrollContainer);
        handleInfiniteScrollContainer(scope.infiniteScrollContainer || []);
        if (attrs.infiniteScrollParent != null) {
          changeContainer(angular.element(elem.parent()));
        }
        if (attrs.infiniteScrollImmediateCheck != null) {
          immediateCheck = scope.$eval(attrs.infiniteScrollImmediateCheck);
        }
        return checkInterval = $interval((function() {
          if (immediateCheck) {
            handler();
          }
          return $interval.cancel(checkInterval);
        }));
      }
    };
  }
]);