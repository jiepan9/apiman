/// <reference path="../apimanPlugin.ts"/>
/// <reference path="../services.ts"/>
module Apiman {

    export var OrgPlansController = _module.controller("Apiman.OrgPlansController",
        ['$q', '$scope', '$location', 'OrgSvcs', 'PageLifecycle', '$rootScope', '$routeParams',
        ($q, $scope, $location, OrgSvcs, PageLifecycle, $rootScope, $routeParams) => {
            var params = $routeParams;
            $scope.organizationId = params.org;
            
            $scope.filterPlans = function(value) {
                if (!value) {
                    $scope.filteredPlans = $scope.plans;
                } else {
                    var filtered = [];
                    for (var i = 0; i < $scope.plans.length; i++) {
                        var plan = $scope.plans[i];
                        if (plan.name.toLowerCase().indexOf(value) > -1) {
                            filtered.push(plan);
                        }
                    }
                    $scope.filteredPlans = filtered;
                }
            };
            
            var pageData = {
                org: $q(function(resolve, reject) {
                    OrgSvcs.get({ organizationId: params.org, entityType: '' }, function(org) {
                        $rootScope.mruOrg = org;
                        resolve(org);
                    }, reject);
                }),
                members: $q(function(resolve, reject) {
                    OrgSvcs.query({ organizationId: params.org, entityType: 'members' }, function(members) {
                        resolve(members);
                    }, reject);
                }),
                plans: $q(function(resolve, reject) {
                    OrgSvcs.query({ organizationId: params.org, entityType: 'plans' }, function(plans) {
                        $scope.filteredPlans = plans;
                        resolve(plans);
                    }, reject);
                })
            };
            PageLifecycle.loadPage('OrgPlans', pageData, $scope, function() {
                PageLifecycle.setPageTitle('org-plans', [ $scope.org.name ]);
            });
        }]);

}
