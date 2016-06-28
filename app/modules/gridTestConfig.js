(function () {
    'use strict';

    angular.module('gridTestConfigModule', []).provider('gridTestConfig', function () {
        var gridTestConfig = {},
            gridTestConfigLocal = {};

        this.$get = function () {
            var config = $.ajax({
                type: 'GET',
                url: 'config/gridTestConfig.json',
                cache: false,
                async: false,
                contentType: 'application/json',
                dataType: 'json'
            });
            
            if (config.status === 200) {
                gridTestConfig = config.responseJSON.gridTestConfig;

                var configLocal = $.ajax({
                    type: 'GET',
                    url: 'config/gridTestConfig.local.json',
                    cache: false,
                    async: false,
                    contentType: 'application/json',
                    dataType: 'json'
                });

                if (configLocal.status === 200) {
                    gridTestConfigLocal = configLocal.responseJSON.gridTestConfigLocal;
                }

                _.merge(gridTestConfig, gridTestConfigLocal);
            }

            return gridTestConfig;
        }
    });
})();
