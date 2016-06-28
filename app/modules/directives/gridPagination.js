(function () {
    'use strict';

    angular.module('gridTest').directive('gridPagination', function () {
        return {
            templateUrl: 'modules/directives/gridPaginationTemplate.html',
            restrict: 'E'
        };
    });
})();