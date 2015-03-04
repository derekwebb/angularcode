var module = angular.module('bookModule', []);

module.service('Book', ['$rootScope', function($rootScope) {
  var service = {
    books: [
      { title: 'Magician', author: 'Raymond E. Feist' },
      { title: 'The Hobbit', author: 'J.R.R Tolkien' }
    ],

    addBook: function(book) {
      service.books.push(book);
      $rootScope.$broadcast('books.updated');
    }
  };

  return service;
}]);


// Ctrl fn
var ctrl = ['$scope', 'Book', function($scope, Book) {
  $scope.$on('books.updated', function(event) {
    $scope.books = Book.books;
  });

  $scope.addBook = function() {
    Book.addBook({title: 'Star Wars', author: 'George Lucas'});
  };

  $scope.books = Book.books;
}];
// Initialize the controller
module.controller('books.list', ctrl);
