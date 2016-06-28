(function () {
    'use strict';

    angular.module('gridTest').service('stateService', function ($location) {
        var version = '',
            jobsColDefs = [],
            jobsParams = {};

        var updateQuerystring = function (data) {
            // set defaults
            data.page = data.page || 1;
            data.page_size = data.page_size || 25;
            data.started = data.started || moment.utc().subtract(1, 'weeks').startOf('d').toISOString();
            data.ended = data.ended || moment.utc().endOf('d').toISOString();
            data.order = data.order ? Array.isArray(data.order) ? data.order : [data.order] : null;
            data.status = data.status || null;
            // check for params in querystring, and update as necessary
            _.forEach(_.pairs(data), function (param) {
                $location.search(param[0], param[1]);
            });
        };

        var initJobsParams = function (data) {
            return {
                page: data.page ? parseInt(data.page) : 1,
                page_size: data.page_size ? parseInt(data.page_size) : 25,
                started: data.started ? data.started : moment.utc().subtract(1, 'weeks').startOf('d').toISOString(),
                ended: data.ended ? data.ended : moment.utc().endOf('d').toISOString(),
                order: data.order ? Array.isArray(data.order) ? data.order : [data.order] : ['-last_modified'],
                status: data.status ? data.status : null,
                error_category: data.error_category ? data.error_category : null,
                job_type_id: data.job_type_id ? parseInt(data.job_type_id) : null,
                job_type_name: data.job_type_name ? data.job_type_name : null,
                job_type_category: data.job_type_category ? data.job_type_category : null,
                url: null
            };
        };

        return {
            getJobsColDefs: function () {
                return jobsColDefs;
            },
            setJobsColDefs: function (data) {
                jobsColDefs = data;
            },
            getJobsParams: function () {
                if (_.keys(jobsParams).length === 0) {
                    return initJobsParams($location.search());
                }
                return jobsParams;
            },
            setJobsParams: function (data) {
                jobsParams = initJobsParams(data);
                updateQuerystring(jobsParams);
            }
        };
    });
})();
