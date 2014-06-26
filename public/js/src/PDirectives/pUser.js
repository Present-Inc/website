/**
 * pUser
 * @namespace
 */


	PDirectives.directive('pUser', function() {
		return {
			restrict: 'EA',
			link: function(scope, element, attr) {

				scope.$watch('User.subjectiveMeta.friendship.forward', function(newValue) {
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

				scope.$watch('User.subjectiveMeta.demand.forward', function(newValue) {
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