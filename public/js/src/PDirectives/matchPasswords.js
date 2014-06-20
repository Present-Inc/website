

	PDirectives.directive('matchPasswords', function() {
		return {
			require: 'ngModel',
			link: function(scope, element, attrs, ngModel) {
				scope.$watch('input.confirmPassword', function(newValue, oldValue) {
					 if(newValue == scope.input.password) {
						 ngModel.$setValidity('matchPasswords', true)
					 } else ngModel.$setValidity('matchPasswords', false);
				});
			}
		}
	});