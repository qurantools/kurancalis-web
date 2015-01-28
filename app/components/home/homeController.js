angular.module('ionicApp', ['ngResource'])
.filter('to_trusted', ['$sce', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }])
.factory('ChapterVerses', function($resource) {
	return $resource('https://securewebserver.net/jetty/qt/rest/chapters/:chapter_id/authors/:author_mask', {
		chapter_id : '@chapter_id',
		author_mask : '@author_mask'
	}, {
		query : {
			method : 'GET',
			params : {
				chapter_id : '@chapter_id',
				author_mask : '@author_mask'
			},
			isArray : true
		},
		post : {
			method : 'POST'
		},
		update : {
			method : 'PUT'
		},
		remove : {
			method : 'DELETE'
		}
	});
}).factory('ListAuthors', function($resource) {
	return $resource('https://securewebserver.net/jetty/qt/rest/authors', {
		query : {
			method : 'GET',
			isArray : true
		},
		post : {
			method : 'POST'
		},
		update : {
			method : 'PUT'
		},
		remove : {
			method : 'DELETE'
		}
	});
}).controller('MainCtrl', function($scope, $q, ListAuthors, ChapterVerses) {

	//list translations
	$scope.list_translations = function() {
		$scope.verses = ChapterVerses.query({
			chapter_id : $scope.chapter_id,
			author_mask : $scope.author_mask
		});
	}

    //list authors
	$scope.list_authors = function() {
		$scope.authorMap = new Object();

		$scope.authors = ListAuthors.query(
			{
				id : $scope.id,  //bunlari cikart
				name : $scope.name, //bunlar authorlarin tumu istenirken kullanilmiyor
				color : $scope.color  //soru varsa sor bana
			},

			function (data){
				var arrayLength = data.length;
					for (var i = 0; i < arrayLength; i++) {
						$scope.authorMap[data[i].id] = data[i];
					}
			}

		);




	}

    //selected authors
	$scope.setAuthors = function() {
		for (var index in $scope.authorMap) {
			if ($scope.author_mask & $scope.authorMap[index].id) {
				$scope.selection.push($scope.authorMap[index].id);
			}
		}
	}

/* init */
    //hide list of authors div
    $scope.showAuthorsList=false

    //list the authors on page load
	$scope.list_authors();

    //get author mask
	$scope.author_mask = 48;

	//selected authors
	$scope.selection = ["16","32"];

/* end of init */

	//toggle selection for an author id
	$scope.toggleSelection = function toggleSelection(author_id) {
		var idx = $scope.selection.indexOf(author_id);
		// is currently selected
		if (idx > -1) {
			$scope.selection.splice(idx, 1);
		}
		// is newly selected
		else {
			$scope.selection.push(author_id);
		}
		$scope.author_mask = 0;
		for (var index in $scope.selection) {
			$scope.author_mask = $scope.author_mask | $scope.selection[index];
		}
	};

});

