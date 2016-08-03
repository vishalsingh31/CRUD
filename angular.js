var app = angular.module('myModule', []);
 app.controller('myController',function($scope,$http){

 	$scope.callEmp=function()
 	{
 		$http.get("http://localhost:8081/Employees/?name_like="+$scope.name)
   				.success(function(response) {$scope.names = response;});
 	};
 	var offset=0;
 	$scope.callAllEmp=function()
 	{
 		$http.get("http://localhost:8081/Employees?_start=" + offset + "&_limit=20")
   				.success(function(response) {$scope.names = response;});
 	};
 	$scope.next=function(){
 		offset=offset+20;
 		$scope.callAllEmp();
 	}
 	$scope.prev=function(){
 		offset=offset-20;
 		$scope.callAllEmp();
 	}
 	$scope.delete=function(id){
 		return $http({
 			method: 'DELETE',
 			url: "http://localhost:8081/Employees/"+id
 			})
 			.then(function successCallback(response) {
            alert("Deleted Successfully");
            $scope.callEmp();
        	},
        	function errorCallback(response) {
            alert("Error in delete");
        	});
 	}
 });