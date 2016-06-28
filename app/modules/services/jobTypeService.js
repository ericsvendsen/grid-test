(function () {
    'use strict';

    angular.module('gridTest').service('jobTypeService', function ($http, $q, $resource, gridTestConfig, jobService, JobType) {
        var getJobTypeParams = function (page, page_size, started, ended, name, category, order) {
            return {
                page: page,
                page_size: page_size ? page_size : 1000,
                started: started,
                ended: ended,
                name: name,
                category: category,
                order: order ? order : ['title', 'version']
            };
        };

        return {
            getJobTypes: function (params) {
                params = params || getJobTypeParams();

                var d = $q.defer();

                $http({
                    url: gridTestConfig.urls.apiPrefix + 'job-types/',
                    method: 'GET',
                    params: params
                }).success(function (data) {
                    data.results = JobType.transformer(data.results);
                    d.resolve(data);
                }).error(function (error) {
                    d.reject(error);
                });
                return d.promise;
            }
        };
    });
})();
