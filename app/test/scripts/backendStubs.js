(function () {
    'use strict';

    angular.module('gridTest').config(function ($provide) {
        $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
    }).run(function ($httpBackend, gridTestConfig, XMLHttpRequest) {

        var getSync = function (url) {
            var request = new XMLHttpRequest();
            request.open('GET', url, false);
            request.send(null);
            return [request.status, request.response, {}];
        };

        var getUrlParams = function (url) {
            var obj = {};

            if (url && url.split('?').length > 1) {
                url.split('?')[1].split('&').forEach(function (item) {
                    var s = item.split('='),
                        k = s[0],
                        v = s[1] && decodeURIComponent(s[1]);
                    (k in obj) ? obj[k].push(v) : obj[k] = [v]
                });
            }

            return obj;
        };

        // Jobs
        var jobsOverrideUrl = 'test/data/jobs.json';
        var jobsRegex = new RegExp('^' + gridTestConfig.urls.apiPrefix + 'jobs/', 'i');
        $httpBackend.whenGET(jobsRegex).respond(function (method, url) {
            var urlParams = getUrlParams(url),
                returnObj = getSync(jobsOverrideUrl),
                jobs = JSON.parse(returnObj[1]);

            if (urlParams.order && urlParams.order.length > 0) {
                var orders = [],
                    fields = [];
                _.forEach(urlParams.order, function (o) {
                    var order = o.charAt(0) === '-' ? 'desc' : 'asc',
                        field = order === 'desc' ? urlParams.order[0].substring(1) : urlParams.order[0];

                    if (field === 'job_type') {
                        field = 'job_type.name';
                    }

                    orders.push(order);
                    fields.push(field);
                });

                jobs.results = _.sortByOrder(jobs.results, fields, orders);
            }

            returnObj[1] = JSON.stringify(jobs);

            return returnObj;
        });

        // Job types
        var jobTypesOverrideUrl = 'test/data/jobTypes.json';
        var jobTypesRegex = new RegExp('^' + gridTestConfig.urls.apiPrefix + 'job-types/', 'i');
        $httpBackend.whenGET(jobTypesRegex).respond(function (method, url) {
            var urlParams = getUrlParams(url),
                returnObj = getSync(jobTypesOverrideUrl),
                jobTypes = JSON.parse(returnObj[1]);

            if (urlParams.order && urlParams.order.length > 0) {
                var orders = [],
                    fields = [];
                _.forEach(urlParams.order, function (o) {
                    var order = o.charAt(0) === '-' ? 'desc' : 'asc',
                        field = order === 'desc' ? urlParams.order[0].substring(1) : urlParams.order[0];

                    orders.push(order);
                    fields.push(field);
                });

                jobTypes.results = _.sortByOrder(jobTypes.results, fields, orders);
            }

            returnObj[1] = JSON.stringify(jobTypes);

            return returnObj;
        });

        // For everything else, don't mock
        $httpBackend.whenGET(/^\w+.*/).passThrough();
        $httpBackend.whenPOST(/^\w+.*/).passThrough();
    });
})();
