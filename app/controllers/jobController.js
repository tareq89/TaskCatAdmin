(function () {
	
	'use strict';

	app.controller('jobController', jobController);

	function jobController($scope, $http, $interval, $uibModal, $window, $routeParams, menus, templates, ngAuthSettings, timeAgo, jobFactory, dashboardFactory, mapFactory, restCall, patchUpdate, localStorageService) {
		
		var vm = $scope;
		vm.HRID = $routeParams.id;	
		vm.selectedStateForFetchAsset = vm.selectedStateForPickup = vm.selectedStateForDelivery = vm.selectedStateForSecuredelivery = 'COMPLETED';
		vm.trackingLink = "fetchprod.gobd.co/#/track/" + vm.HRID;
		vm.CommentTobeUpdated = null;
		vm.job = jobFactory.job(vm.HRID);
		vm.job.loadJob();
		vm.job.getComments(vm.HRID);
		vm.invoiceUrl = function () {
			// var url = ngAuthSettings.apiServiceBaseUri + '/api/job/'+ vm.job.data.HRID +'/invoice';
			var url = 'app/content/invoice/invoice.html?'+ vm.job.data.HRID;
			return url;
		}

		vm.editComment = function (comment) {
			vm.CommentTobeUpdated = Object.assign({}, comment);
			console.log(vm.CommentTobeUpdated);
			vm.job.isUpdatingComment = true;
		}

		vm.getAssetsList = function (page) {
			console.log("EnterpriseUsers");
			var getUsersUrl = ngAuthSettings.apiServiceBaseUri + "api/Account/odata?$filter=Type eq 'BIKE_MESSENGER'&$orderby=UserName&page="+ page +"&pageSize=50";
			dashboardFactory.getUserNameList(getUsersUrl).then(function (response) {
				if (page === 0) {
					vm.BikeMessengers = [];				
				}
				angular.forEach(response.data, function (value, index) {
					vm.BikeMessengers.push(value);
				})
				if (response.pagination.TotalPages > page) {
					vm.getAssetsList(page + 1);
				}			
			}, function (error) {
				console.log(error);			
			});
		}
		vm.getAssetsList(0);

		vm.assetAssign = function (taskId, selectedAssetId) {
			if (vm.job.data.Tasks[0].id === taskId) {
				vm.stateUpdate(vm.job.data.Tasks[0], 'COMPLETED');
			}
			if (vm.job.data.Tasks[1].id === taskId && (vm.job.data.Tasks[0].State === 'PENDING' || vm.job.data.Tasks[0].State === 'IN_PROGRESS')) {
				vm.stateUpdate(vm.job.data.Tasks[0], 'COMPLETED');
				vm.stateUpdate(vm.job.data.Tasks[1], 'IN_PROGRESS');
			}
			vm.job.assigningAsset(taskId, selectedAssetId);
		}


		vm.stateUpdate = function (task, state) {
			console.log(task)
			console.log(state)
			if ((task.State === "FAILED" || task.State === "RETURNED") && state === "IN_PROGRESS") {
				var modalInstance = $uibModal.open({
					animation: $scope.animationsEnabled,
					templateUrl: 'app/views/detailsJob/TaskUpdateAlert.html',
					controller: 'TaskUpdateAlertCtrl'
				});

				modalInstance.result.then(function (reason) {
					vm.job.stateUpdate(task, state);
					console.log(reason);
				}, function () {
					console.log("discarded");
				})
			} else {
				vm.job.stateUpdate(task, state);
			}
		}
	 
		vm.openCancellationModal = function (size) {
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'app/views/detailsJob/JobCancellation.html',
				controller: 'JobCancellationCtrl'
			});

			modalInstance.result.then(function (reason) {
				vm.cancelReason = reason;
				console.log(reason);
				vm.job.cancel(reason);
			}, function () {
				console.log("discarded")
			})
		}

		vm.confirmDeleteComment = function (comment) {
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'app/views/detailsJob/confirmDeleteComment.html',
				controller: 'commentDeleteCtrl'
			});		
			modalInstance.result.then(function () {
				console.log(comment);
				vm.job.deleteComment(comment.Id);
			}, function (discarded) {
				console.log("Decided not to delete comment");
			})
		}		
	}
})();


(function () {

	'use strict';

	app.controller('JobCancellationCtrl', ['$scope', '$uibModalInstance', JobCancellationCtrl]);

	function JobCancellationCtrl($scope, $uibModalInstance) {
		$scope.reason = "";

		$scope.cancel = function () {
			$uibModalInstance.close($scope.reason);
		}
		$scope.discard = function () {
			$uibModalInstance.dismiss("cancel");
		}
	}
})();


(function () {

	'use strict';
	
	app.controller('commentDeleteCtrl', ['$scope', '$uibModalInstance', commentDeleteCtrl]);

	function commentDeleteCtrl($scope, $uibModalInstance) {
		$scope.delete = function () {
			$uibModalInstance.close();
		}
		$scope.discard = function () {
			$uibModalInstance.dismiss("cancel");
		}
	}
})();


(function () {

	'use strict';

	app.controller('TaskUpdateAlertCtrl', ['$scope', '$uibModalInstance', TaskUpdateAlertCtrl]);
	
	function TaskUpdateAlertCtrl($scope, $uibModalInstance) {
		$scope.stateUpdateMessage = "Are you sure you want to Update the Task status from FAILED/RETURNED to something else?";
		$scope.confirm = function () {
			console.log("confirm update it!")
			$uibModalInstance.close("");
		}
		$scope.discard = function () {
			$uibModalInstance.dismiss();
		}
	}
})();




