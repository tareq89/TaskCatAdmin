'use strict';

app.factory('assetsFactory', function($http, $window, restCall, host, UrlPath){

	var populateAssets = function (assets, type, envelope, page, pageSize){	

		var assetlistUrl = host + UrlPath.assets(type, envelope, page, pageSize);

		function successCallback (response) {
			angular.forEach(response.data.data, function(value, key){
				console.log(value);
				var asset = {
					_id : value._id,
					UserName : value.UserName,
					Type : value.Type,
					Phone : value.PhoneNumber,
					CurrentLocation : value.CurrentLocation,
					AreaOfOperation : value.AreaOfOperation,
					IsAvailable : value.IsAvailable,
					State : value.State,
				};
				assets.Collection.push(asset);
			});

			for (var i = 0; i < response.data.pagination.TotalPages ; i++) {
				assets.pages.push(i);
			};
		}
		restCall('GET', assetlistUrl, null, successCallback);
	};

	var registerNewAsset = function (asset){
		var successCallback = function (response) {
  			console.log("success : ");
  			console.log(response);
  			alert("")
  			$window.location.href = '#/asset';
  		};
  		
  		var errorCallback = function error(response) {
  			console.log("error : ");
  			console.log(response);
  		};

		console.log(asset);
		var registerNewAssetUrl = host + "api/Account/Register";
		restCall('POST', registerNewAssetUrl, asset, successCallback, errorCallback)  	
	};

	return {
		populateAssets : populateAssets,
		registerNewAsset : registerNewAsset
	}
});