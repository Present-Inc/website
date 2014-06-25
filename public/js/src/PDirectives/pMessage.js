

PDirectives.directive('pMessage', function() {
	return {
		restrict: 'EA',
		templateUrl: 'views/partials/message',
		scope : {
			pFeedback : '='
		},
		link: function(scope, element, attrs) {
			console.log(scope.pFeedback);
		}
	}
});