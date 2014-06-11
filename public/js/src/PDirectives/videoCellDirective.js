/**
 * VideoCellDirective.js
 */

PDirectives.directive('videoCell', function() {
	return {
		restrict : 'EA',
		link : function(scope, element, attrs) {

			scope.$watch('videoCell.subjectiveMeta.like.forward', function(newValue) {
				if (newValue) scope.likesElem.css({'color' : '#FF557F'});
				else scope.likesElem.css({'color' : '#47525D'});
			});

		}
	}
});