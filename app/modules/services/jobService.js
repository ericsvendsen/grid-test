(function () {
    'use strict';

    angular.module('gridTest').service('jobService', function($http, $q, $resource, gridTestConfig, Job) {

        var getJobsParams = function (page, page_size, started, ended, order, status, job_type_id, job_type_name, job_type_category, url) {
            return {
                page: page,
                page_size: page_size,
                started: started,
                ended: ended,
                order: order,
                status: status,
                job_type_id: job_type_id,
                job_type_name: job_type_name,
                job_type_category: job_type_category,
                url: url
            };
        };

        var getJobUpdateData = function (status) {
            return {
                status: status
            };
        };

        return {
            getJobs: function (params) {
                params = params || getJobsParams();
                var d = $q.defer();

                $http({
                    url: params.url ? params.url : gridTestConfig.urls.apiPrefix + 'jobs/',
                    method: 'GET',
                    params: params
                }).success(function (data) {
                    data.results = Job.transformer(data.results);
                    d.resolve(data);
                }).error(function (error) {
                    d.reject(error);
                });

                return d.promise;
            },
            getJobCountsByStatus: function (hour) {
                hour = hour || 3;
                var d = $q.defer();

                $http.get(gridTestConfig.urls.getJobCountsByStatus(hour)).success(function (data) {
                    d.resolve(data);
                }).error(function (error) {
                    d.reject(error);
                });
                return d.promise;
            }
        };
    });
})();
