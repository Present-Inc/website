

PDirectives.directive('pMessage', function() {
	return {
		restrict: 'EA',
		templateUrl: 'views/partials/message',
		scope : {
			pMessage : '='
		},
		link: function(scope, element, attrs) {
			console.log(scope.pMessage);
		}
	}
});