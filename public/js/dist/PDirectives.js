

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

PDirectives.directive('pEnter', function() {
	return function (scope, element, attrs) {
		element.bind("keydown keypress", function (event) {
			if(event.which === 13) {
				scope.$apply(function (){
					scope.$eval(attrs.pEnter);
				});
				event.preventDefault();
			}
		});
	};
});


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
/**
 * pUser
 * @namespace
 */


	PDirectives.directive('pUser', function() {
		return {
			restrict: 'EA',
			link: function(scope, element, attr) {

				scope.$watch('user.subjectiveMeta.friendship.forward', function(newValue) {
					if (newValue) {
						scope.followBtn.css({
							'background-color': '#8E73FF',
							'border': 'solid 1px' +  '#8E73FF',
							'color': '#FFF'
						});
						scope.actions.friendship = 'Following';
					} else {
						scope.followBtn.css({
							'background-color': '#7BD4EB',
							'border': 'solid 1px' +  '#7BD4EB',
							'color': '#FFF'
						});
						scope.actions.friendship = 'Follow';
					}
				});

				scope.$watch('user.subjectiveMeta.demand.forward', function(newValue) {
					if (newValue) {
						scope.demandBtn.css({
							'background-color': '#8E73FF',
							'border': 'solid 1px' + '#8E73FF',
							'color': '#FFF'
						});
						scope.actions.demand = 'Demanded';
					} else {
						scope.demandBtn.css({
							'background-color': '#7BD4EB',
							'border': 'solid 1px' + '#7BD4EB',
							'color': '#FFF'
						});
						scope.actions.demand = 'Demand';
					}
				});

			}
		}

	});

/**
 * HTML directive for a video cell element
 */

PDirectives.directive('pVideoCell', function() {
	return {
		restrict : 'EA',
		link : function(scope, element, attrs) {
			scope.$watch('videoCell.subjectiveMeta.like.forward', function(newValue) {
				if (newValue) scope.likesElem.css({'color' : '#FF557F'});
				else scope.likesElem.css({'color' : '#47525D'});
			});

			scope.$watchCollection('videoCell.likes', function(){});

			scope.$watchCollection('videoCell.comments', function(){});

		}
	}
});
/**
 * PDirectives.viewContainerDirective
 * HTML Directive that controls the main view container
 * I.E custom extension for ui-view
 */

  PDirectives.directive('pViewContainer', function() {});



PDirectives.directive('registerElement', function() {
	return {
		compile: function compile(tElement, tAttrs, transclude) {
			return {
				pre: function preLink(scope, iElement, iAttrs, controller) {
					scope[iAttrs.registerElement] = iElement;
				}
			}
		}
	}
});