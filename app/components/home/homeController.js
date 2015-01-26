angular.module('ionicApp', ['ngResource']).factory('ChapterVerses', function($resource) {
	//return $resource('http://localhost:8080/QuranToolsApp/rest/chapters/:chapter_id/authors/:author_mask',
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
}).controller('MainCtrl', function($scope, ListAuthors, ChapterVerses) {

	//list translations
	$scope.list_translations = function() {
		$scope.verses = ChapterVerses.query({
			chapter_id : $scope.chapter_id,
			author_mask : $scope.author_mask
		});
	}

    //list authors
	$scope.list_authors = function() {
		$scope.authors = ListAuthors.query({
			id : $scope.id,
			name : $scope.name
		});

	}

    //selected authors
	$scope.setAuthors = function() {
		for (var index in $scope.authors) {
			if ($scope.author_mask & $scope.authors[index].id) {
				$scope.selection.push($scope.authors[index].id);
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
	$scope.selection = [];
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

