(function () {
    'use strict';

    var app = angular.module('gridTest', [
        'gridTestConfigModule',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'ui.bootstrap',
        'ui.grid',
        'ui.grid.selection',
        'ui.grid.pagination',
        'ui.grid.resizeColumns',
        'toggle-switch'
    ]);

    app.config(function($routeProvider, $resourceProvider) {
        // preserve trailing slashes
        $resourceProvider.defaults.stripTrailingSlashes = false;

        //routing
        $routeProvider
            .when('/', {
                controller: 'gridController',
                templateUrl: 'modules/gridTemplate.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
        .value('moment', window.moment)
        .value('localStorage', window.localStorage)
        .value('XMLHttpRequest', window.XMLHttpRequest)
        .value('toastr', window.toastr);
})();
