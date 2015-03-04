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

  // Form fields
  var elements = [ 'author', 'title'];

  // Update the books on the scope
  $scope.$on('books.updated', function(event) {
    $scope.books = Book.books;
  });

  $scope.addBook = function(form) {
    Book.addBook({title: $scope.form.title, author: $scope.form.author});
    $scope.resetForm(form);
  };

  $scope.resetForm = function resetForm(form) {
    // Reset form state
    form.$setPristine();
    form.$setUntouched();

    // Clear fields
    elements.forEach(function(value, index, array) {
      $scope.form[value] = '';
    });
  };

  $scope.books = Book.books;
}];
// Initialize the controller
module.controller('books.list', ctrl);
