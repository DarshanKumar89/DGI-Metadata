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
		var Query="";
		
        return {
            getProperty: function () {
                return property;
            },
            setProperty: function(value) {
                property = value;
            },
			getQuery: function () {
                return Query;
            },setQuery: function(value) {
                Query = value;
            }
        };
});



DgcControllers.controller("headerController", ['$scope', '$window', '$location', '$stateParams', function($scope, $window, $location,$stateParams)
    {
		$scope.executeSearch=function executeSearch() {
            $window.location.href = "#Search/" + $scope.query;
			
			
        }
		$scope.query=$stateParams.searchid;
    }]
);

DgcControllers.controller("footerController", ['$scope','$http', function($scope, $http)
    {
        $http.get('/api/metadata/admin/version')
            .success(function (data) {
                $scope.iserror1=false;
                $scope.apiVersion=data.Version;

            })
            .error(function (e) {
                $scope.iserror1=true;
                $scope.error1=e;
            });

    }]
);


DgcControllers.controller("NavController", ['$scope','$http', '$filter', 'sharedProperties', function($scope, $http, $filter, sharedProperties)
{

    $http.get('/api/metadata/types/traits/list')
        .success(function (data) {
            $scope.iserror1=false;
            $scope.leftnav=angular.fromJson(data.results);

        })
        .error(function (e) {
            $scope.iserror1=true;
            $scope.error1=e;
        });
        //Nav to textbox

         $scope.updateVar = function (event) {
         $scope.$$prevSibling.query = angular.element(event.target).text();
         console.log("test");
        console.log(angular.element(event.target).text());
         console.log("testing");
    };


}]
);


DgcControllers.controller("ListController", ['$scope','$http', '$filter','$stateParams', 'sharedProperties', function($scope, $http, $filter, $stateParams, sharedProperties)
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
        $scope.Storeqry=function Storeqry(value){

            return typeof value === 'object';
        }



        $scope.executeSearchForleftNav = function executeSearchForleftNav(strSearch){
            $scope.query=strSearch;
			 sharedProperties.setQuery(strSearch);
            //$scope.executeSearch();
        }

        console.log($stateParams.searchid);
           $scope.SearchQuery=$stateParams.searchid;
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

                        var i=0;
                        angular.forEach($scope.configdata, function(values, key) {
                            if (key === data.results.dataType.typeName) {
                                i=1;
                            }
                        });
                            if(i===0){
                                var tempdataType="__tempQueryResultStruct";
                                //console.log(tempdataType);
                                var datatype1=$scope.datatype.substring(0,tempdataType.length);
                               // console.log(datatype1);
                                if(datatype1===tempdataType){
                                    $scope.datatype=tempdataType;
                                }

                            }

                        sharedProperties.setProperty($scope.datatype);
                    }

               //     console.log($scope.entities);


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


                });
                // .error(function (e) {
                //     alert("failed");
                //     $scope.iserror=true;
                //     $scope.error=e;


                // });

//click value to textbox

       $scope.updateVars = function (event) {
        var appElement = document.querySelector('[ng-model=query]');
    var $scope = angular.element(appElement).scope();
     $scope.query = angular.element(event.target).text();
    // $scope.$apply(function() {
    //   $scope.query = angular.element(event.target).text();
    // });

        
         console.log("test");
        console.log(angular.element(event.target).text());
         console.log("testingFact");
    };
    //click value to textbox
        $scope.getGuidName=function getGuidName(val){
            $http.get('/api/metadata/entities/definition/'+val)
                .success(function (data) {
                    $scope.iserror1=false;
                    if(!$scope.isUndefined(data.results)){
                        $scope.gname=angular.fromJson(data.results);
                        console.log(angular.fromJson(data.results));
                        // $scope.gname=data.results.name;
                    }

                })
                .error(function (e) {
                    $scope.iserror1=true;
                    $scope.error1=e;
                });
            //return $scope.gname;
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


DgcControllers.controller("DefinitionController", ['$scope','$http', '$stateParams', 'sharedProperties', function($scope, $http, $stateParams, sharedProperties)
    {

					$scope.guidName="";
					$scope.ids=[];
					$scope.isUndefined = function (strval) {
						return (typeof strval === "undefined");
					}
					
					$scope.isString=function isString(value){								
					 return typeof value === 'string' || getType(value)==='[object Number]';
					}
					
					var getType = function (elem) {
					return Object.prototype.toString.call(elem);
					};
					
					$scope.isObject=function isObject(value){
					 return typeof value === 'object';
					}
//onclick to textbox

       $scope.updateDetailsVariable = function (event) {
        var appElement = document.querySelector('[ng-model=query]');
    var $scope = angular.element(appElement).scope();
     $scope.query = angular.element(event.target).text();
    // $scope.$apply(function() {
    //   $scope.query = angular.element(event.target).text();
    // });

        
         console.log("test");
        console.log(angular.element(event.target).text());
         console.log("testing");
    };
//onclick to textbox
					$scope.getGuidName=function getGuidName(val){
					$http.get('/api/metadata/entities/definition/'+val)
						.success(function (data) {
						$scope.iserror1=false;
							if(!$scope.isUndefined(data.results)){								
							$scope.gname=angular.fromJson(data.results);
							//console.log(angular.fromJson(data.results));
                               // $scope.gname=data.results.name;
							}

						})
						   .error(function (e) {
							$scope.iserror1=true;
							$scope.error1=e;
						});
				return true;
					}
		
        $scope.Name=$stateParams.Id;
        $scope.searchqry=sharedProperties.getQuery();
        $scope.datatype1=sharedProperties.getProperty();

        $http.get('/api/metadata/entities/definition/'+$stateParams.Id)
                .success(function (data) {
                    $scope.iserror1=false;
                $scope.details=  angular.fromJson(data.results);
                if(!$scope.isUndefined( $scope.details)) {
                 //   console.log($scope.details['name']);
                    $scope.getSchema($scope.details['name']);
                    $scope.getLinegae($scope.details['name']);
                }
            })
               .error(function (e) {
                $scope.iserror1=true;
                $scope.error1=e;
            });


        $scope.getSchema= function (tableName) {

            $http.get('/api/metadata/lineage/hive/schema/'+tableName)
                .success(function (data) {
                    $scope.iserror1=false;
                    $scope.schema=  angular.fromJson(data.results.rows);
                  //  console.log(tableName);


                })
                .error(function (e) {
                    $scope.iserror1=true;
                    $scope.error1=e;
                });
        }

        $scope.guidName1=[];
        var getLienageGuidName=function (val){

            $http.get('/api/metadata/entities/definition/'+val)
                .success(function (data) {
                    $scope.iserror1=false;
                    if(!$scope.isUndefined(data.results)){

                        var data1=angular.fromJson(data.results);

                        $scope.guidName1.push({"id" : val,"Name" : data1['name']});
                       // console.log( $scope.guidName1);
                      //  return  $scope.guidName1;
                        //console.log(angular.fromJson(data.results));
                        // $scope.gname=data.results.name;
                    }

                })
                .error(function (e) {
                    $scope.iserror1=true;
                    $scope.error1=e;
                });
            return  $scope.guidName1;
        }

        $scope.getLinegae= function (tableName) {

            $scope.width = 700;
            $scope.height = 500;

            $http.get('/api/metadata/lineage/hive/outputs/'+tableName)
                .success(function (data) {
                    $scope.iserror1=false;
                    $scope.lineage=  angular.fromJson(data.results.rows);

                    $scope.vts = [];
                    $scope.edges1 = [];
                    $scope.listguid = [];
                    angular.forEach($scope.lineage, function(lineage1){
                    var level = 0;
                    angular.forEach(lineage1.path, function(item, index){
                      //  if ($scope.listguid.indexOf(index) == -1) {
                       //     $scope.listguid.push(index);

                        $scope.vts.push({"Name": item.guid,"Id" :index,"hasChild":"True","type":item.typeName});
                        $scope.edges1.push({source: index, target: (index+1)});

                       // }
                    });

                  });


                    var newarr = [];
                    var unique = {};

                    angular.forEach($scope.edges1, function(item) {
                        if (!unique[item.source]) {
                            newarr.push(item);
                            unique[item.source] = item;
                            //console.log(newarr);
                        }
                    });

                    var newarrvts = [];
                    var uniquevts = {};

                    angular.forEach($scope.vts, function(item) {
                        if (!uniquevts[item.Name]) {
                            newarrvts.push(item);
                            uniquevts[item.Name] = item;
                            getLienageGuidName(item.Name);
                            //console.log(newarr);
                        }
                    });

                   // console.log($scope.guidName1);

                    $scope.ed2=newarr;
                    $scope.newvts=newarrvts;

                    var edges2 = [];
                    $scope.ed2.forEach(function(e) {
                        var sourceNode = $scope.newvts.filter(function(n) { return n.Id === e.source; })[0],
                            targetNode = $scope.newvts.filter(function(n) { return n.Id === e.target; })[0];

                        if((sourceNode!=undefined) && (targetNode!=undefined)){
                            edges2.push({source: sourceNode, target: targetNode});
                        }
                    });

                    var ed1 = [];
                    edges2.forEach(function(e) {
                        var sourceNode = $scope.newvts.filter(function(n) { return n.Id === e.source; })[0],
                            targetNode = $scope.newvts.filter(function(n) { return n.Id === e.target; })[0];
                        ed1.push({source: sourceNode, target: targetNode});
                    });



                    var vtsarray2 = $scope.guidName1;

                    //console.log(getType($scope.guidName1));
                    $scope.newvts.forEach(function(e) {
                        angular.forEach(vtsarray2, function(item1){

                           if(item1.id === e.Name){
                               console.log(item1.Name);
                           }
                           console.log(vtsarray2);
                       });

                       // console.log($scope.guidName1);
                        //vtsarray2.push({"Name": item.guid,"Id" :index,"hasChild":"True","type":item.typeName});

                    });


                    //Width and height
                    var w = 700;
                    var h = 500;
                    var force = d3.layout.force()
                        .nodes($scope.newvts)
                        .links(edges2)
                        .size([w, h])
                        .linkDistance([400])
                        .charge([-250])
                        .start();

                    var colors = d3.scale.category10();

                    //Create SVG element
                    var svg = d3.select("svg")
                        .attr("width", w)
                        .attr("height", h);

                    var tip = d3.tip()
                        .attr('class', 'd3-tip')
                        .offset([-10, 0])
                        .html(function(d) {
                            return "<pre class='alert alert-success' style='max-width:400px;'>" + d.values + "</pre>";
                        });
                    //svg.call(tip);
                    //Create edges as lines
                    var edges = svg.selectAll("line")
                        .data(edges2)
                        .enter()
                        .append("line")
                        .style("stroke", "#23A410")
                        .style("stroke-width", 3);

                    var node = svg.selectAll(".node")
                        .data($scope.newvts)
                        .enter().append("g")
                        .attr("class", "node")
                        .call(force.drag);

                    svg.append("svg:pattern").attr("id","processICO").attr("width",1).attr("height",1)
                        .append("svg:image").attr("xlink:href","img/process.png").attr("x",-5.5).attr("y",-4).attr("width",42).attr("height",42);
                    svg.append("svg:pattern").attr("id","textICO").attr("width",1).attr("height",1)
                        .append("svg:image").attr("xlink:href","img/tableicon.png").attr("x",2).attr("y",2).attr("width",25).attr("height",25);

// define arrow markers for graph links

                    node.append("circle")
                        .attr("r", function(d, i) {
                            if(d.hasChild=="True"){
                                return 15;
                            }else{
                                return 15;
                            }
                            return 10;
                        })
                        .attr("cursor","pointer")
                        .style("fill", function(d, i) {
                            if(d.type=="LoadProcess"){
                                return "url('#processICO')";
                            }else{
                                return "url('#textICO')";
                            }
                            return colors(i);
                        })
                        .attr("class","circle");
                    //.call(force.drag);

                    //Add text
                    node.append("text")
                        .attr("x", 12)
                        .attr("dy", ".35em")
                        .text(function(d) { return d.Name;         });

                    //Every time the simulation "ticks", this will be called
                    force.on("tick", function() {

                        edges.attr("x1", function(d) { return d.source.x; })
                            .attr("y1", function(d) { return d.source.y; })
                            .attr("x2", function(d) { return d.target.x; })
                            .attr("y2", function(d) { return d.target.y; });





                        //node.attr("cx", function(d) { return d.x; })
                        //.attr("cy", function(d) { return d.y; });
                        node
                            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
                    })

                    function mouseover(d) {
                        d3.select(this).select("circle").transition()
                            .duration(750)
                            .attr("r", 16);
                    }

                    function mouseout() {
                        d3.select(this).select("circle").transition()
                            .duration(750)
                            .attr("r", 10);
                    }


                })
                .error(function (e) {
                    $scope.iserror1=true;
                    $scope.error1=e;
                });


        }




      //  console.log( $scope.vts);

        $scope.reverse = function(array) {
            var copy = [].concat(array);
            return copy.reverse();
        }

        // function back()
        //  {
        //   $window.history.back();
        //   myModule.run(function ($rootScope, $location) {

        //       var history = [];

        //       $rootScope.$on('$routeChangeSuccess', function() {
        //           history.push($location.$$path);
        //       });

        //       $rootScope.back = function () {
        //           var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
        //           $location.path(prevUrl);
        //       };

        //   });
        //  }




    }]
);


DgcControllers.controller("GuidController", ['$scope','$http', '$filter','$stateParams', 'sharedProperties', function($scope, $http, $filter, $stateParams, sharedProperties)
    {



$scope.getGuidName=function getGuidName(val){
  
        $scope.gnew=[];
                    $http.get('/api/metadata/entities/definition/'+val)
                        .success(function (data) {
                        $scope.iserror1=false;
                            if(!$scope.isUndefined(data.results)){  
                                           
                            $scope.gname=angular.fromJson(data.results);
                             var data1=angular.fromJson(data.results);
                             //$scope.gnew({"id" : val,"name" : data1['name']});

                           $scope.gnew= $scope.gname.name;
                           // $scope.$watch($scope.gnew, true);
                            console.log(angular.fromJson(data.results));
                            console.log(  $scope.gnew);
                       
                               
      
 



}
                               //dddd
                         

                        })
                           .error(function (e) {
                            $scope.iserror1=true;
                            $scope.error1=e;
                        });

                //return $scope.gnew;
                    }


 }]
);



