'use strict';

app.factory('assetsFactory', function($http){
	
	var populateAssets = function (assets, url){	
		var Assets = {Collection : [], pages: []};	
		angular.forEach(assets.data, function(value, key){
			var asset = {
				_id : value._id,
				Username : value.Username,
				Type : value.Type,
				Phone : value.Phone,
				CurrentLocation : value.CurrentLocation,
				AreaOfOperation : value.AreaOfOperation,
				IsAvailable : value.IsAvailable,
				State : value.State,
				
			};
			Assets.Collection.push(asset);
		});
		for (var i = 0; i < assets.pagination.TotalPages ; i++) {
			Assets.pages.push(i);
		};
		return Assets;		
	};

	var registerNewAsset = function (asset){
		console.log(asset);
  		$http({
  			method: 'POST',
  			url: 'http://localhost:23873/api/Account/Register',
  			data: asset,
  			header: {
  				'Content-Type' : 'application/json'
  			} 
  		}).then(function success(response) {
  			console.log("success : ");
  			console.log(response);
  			$window.location.href = '#/asset';

  		}, function error(response) {
  			console.log("error : ");
  			console.log(response);
  		});
	};

	return {
		populateAssets : populateAssets,
		registerNewAsset : registerNewAsset
	}
});

// app.factory('populateAssets', function($window){
// 	return function (assets, url){	
// 		var Assets = {Collection : [], pages: []};	
// 		angular.forEach(assets.data, function(value, key){
// 			var asset = {
// 				Username : value.Username,
// 				Type : value.Type,
// 				Phone : value.Phone,
// 				CurrentLocation : value.CurrentLocation,
// 				AreaOfOperation : value.AreaOfOperation,
// 				IsAvailable : value.IsAvailable,
// 				State : value.State,
// 				Details : function(){
// 					$window.location.href = '/index.html?id='+ value._id;
// 				}
// 			};
// 			Assets.Collection.push(asset);
// 		});
// 		for (var i = 0; i < assets.pagination.TotalPages ; i++) {
// 			Assets.pages.push(i);
// 		};
// 		return Assets;		
// 	};
// });



// angular.module('app').factory('registerNewAsset', function($http, $window){
// 	return function (asset){
// 		console.log(asset);
//   		$http({
//   			method: 'POST',
//   			url: 'http://localhost:23873/api/Account/Register',
//   			data: asset,
//   			header: {
//   				'Content-Type' : 'application/json'
//   			} 
//   		}).then(function success(response) {
//   			console.log("success : ");
//   			console.log(response);
//   			$window.location.href = '#/asset';

//   		}, function error(response) {
//   			console.log("error : ");
//   			console.log(response);
//   		});
// 	};
// });