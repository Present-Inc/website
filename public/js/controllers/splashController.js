

PresentWebApp.controller('splashCtrl', ['$scope', function($scope) {
  $scope.message = 'Present!';
  $scope.staticContent = {
    title: "Present",
    appIcon: {
      source: 'assets/img/app-icon.png',
      alt: 'Present app icon'
    }
  };
}]);
