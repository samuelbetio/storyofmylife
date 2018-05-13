/***********************************************************
* Developer: Samuel Betio (samuelbetio@gmail.com)       *
* Website: https://github.com/samuelbetio/DownGit          *
* License: MIT License                                     *
***********************************************************/

'use strict';

var siteHeaderText={};

var downGit = angular.module('downGit', [
	'ngRoute',
	'homeModule',
	'toastr',
]);

downGit.config([
    '$routeProvider',
	
    function($routeProvider) {
        $routeProvider
            .when('/', {
                redirectTo: '/home',
            })
			.otherwise({
                redirectTo: '/home',
            });
    }
]);

downGit.config([
    'toastrConfig',
	
	function(toastrConfig) {
		angular.extend(toastrConfig, {
			positionClass: 'toast-bottom-right',
			maxOpened: 3,
		});
	}
]);
