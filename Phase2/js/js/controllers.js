/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var DgcControllers = angular.module("DgcControllers", []);

 DgcControllers.service('sharedProperties', function () {
        var property="";

        return {
            getProperty: function () {
                return property;
            },
            setProperty: function(value) {
                property = value;
            }
        };
});
DgcControllers.controller("ListController", ['$scope','$http', '$filter', 'sharedProperties', function($scope, $http, $filter, sharedProperties)
    {


        $scope.isUndefined = function (strval) {

            return (typeof strval === "undefined");
        }
		
		$scope.StoreJson = function (strval) {
            sharedProperties.setProperty(strval);			
        }

        $scope.Showpaging = function(itemlength)
        {

            return (itemlength > 1);
        }

        $scope.isString=function isString(value){
            return typeof value === 'string';
        }

        $scope.isObject=function isObject(value){

            return typeof value === 'object';
        }



        $http.get('/api/metadata/types/list')
            .success(function (data) {
                $scope.iserror1=false;
                $scope.leftnav=angular.fromJson(data.results);


            })
            .error(function (e) {
                $scope.iserror1=true;
                $scope.error1=e;
            });

        $scope.executeSearchForleftNav = function executeSearchForleftNav(strSearch){
            $scope.query=strSearch;
            $scope.executeSearch();
        }
        $scope.executeSearch = function executeSearch()
        {
           $scope.SearchQuery=$scope.query;
            $scope.reverse = false;
            $scope.filteredItems = [];
            $scope.groupedItems = [];
            $scope.itemsPerPage = 10;
            $scope.pagedItems = [];
            $scope.currentPage = 0;
            $scope.itemlength=0;
            $scope.configdata=[];
            $scope.results=[];
            $scope.datatype="";
            $http.get('js/config.json').success(function(data){
                $scope.configdata=data.Search;

            });


            $http.get('/api/metadata/discovery/search?query='+$scope.SearchQuery)
                .success(function (data) {
                    $scope.iserror=false;
                    $scope.entities=angular.fromJson(data.results.rows);
                    if(!$scope.isUndefined($scope.entities)){
                        $scope.itemlength=$scope.entities.length;
                        $scope.datatype=data.results.dataType.typeName;
                    }

                    console.log($scope.entities);


                    // to get value based on config but not use (used in view directly)
                  /*  angular.forEach($scope.configdata, function(values, key) {
                        if(key===data.results.dataType.typeName)
                        {
                            $scope.entities.forEach(function(k,v){
                                    angular.forEach(values, function(value, key1) {
                                        var obj = {};
                                        obj[value] = k[value];
                                    $scope.results.push(obj);
                                });
                            });
                        }
                    });
                    */

                    $scope.currentPage = 0;
                    // now group by pages
                    $scope.groupToPages();


                })
                .error(function (e) {
                    alert("failed");
                    $scope.iserror=true;
                    $scope.error=e;


                });


        }


        // calculate page in place
        $scope.groupToPages = function () {
            $scope.pagedItems = [];

            for (var i = 0; i < $scope.itemlength; i++) {
                if (i % $scope.itemsPerPage === 0) {
                    $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.entities[i] ];
                } else {
                    $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.entities[i]);
                }
            }

        };

        $scope.range = function (start, end) {
            var ret = [];
            if (!end) {
                end = start;
                start = 0;
            }
            for (var i = start; i < end; i++) {
                ret.push(i);
            }
            return ret;
        };

        $scope.prevPage = function () {
            if ($scope.currentPage > 0) {
                $scope.currentPage--;
            }
        };

        $scope.nextPage = function () {
            if ($scope.currentPage < $scope.pagedItems.length - 1) {
                $scope.currentPage++;
            }
        };


        $scope.firstPage = function () {
            if ($scope.currentPage > 0) {
                $scope.currentPage = 0;
            }
        };

        $scope.lastPage = function () {
            if ($scope.currentPage < $scope.pagedItems.length - 1) {
                $scope.currentPage = $scope.pagedItems.length-1;
            }
        };
        $scope.setPage = function () {
            $scope.currentPage = this.n;
        };

    }]
);


DgcControllers.controller("DefinitionController", ['$scope','$http', '$routeParams', 'sharedProperties', function($scope, $http, $routeParams, sharedProperties)
    {


					$scope.isString=function isString(value){
					 return typeof value === 'string';
					}
					
					$scope.isObject=function isObject(value){
					 return typeof value === 'object';
					}
		
        $scope.Name=$routeParams.Id;
			
			//$scope.schema=sharedProperties.getProperty();

			
        $http.get('/api/metadata/entities/definition/'+$routeParams.Id)
                .success(function (data) {
                    $scope.iserror1=false;
                   $scope.schema=angular.fromJson(data.results);


            })
               .error(function (e) {
                $scope.iserror1=true;
                $scope.error1=e;
            });





    }]
);


