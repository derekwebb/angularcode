(function(angular) {
  'use strict';
  angular.module('myApp', [])
    .controller('TodoCtrl', ['$scope', function($scope) {

      // An array of Todos
      $scope.todos = [
        { text: "Learn AngularJS", done: false }, 
        { text: "Build an app", done: false }
      ];

      // Get # of todos
      $scope.getTotalTodos = function() {
        return $scope.todos.length;
      };
      
      // Count completed todos
      $scope.getCompletedTodos = function() {
        var completed = 0;
        angular.forEach($scope.todos, function(value, key) {
          if (value.done) completed++;
        });
        return completed;
      };

      // Clear completed todos
      $scope.clearCompleted = function() {
        $scope.todos = _.filter($scope.todos, function(todo) {
          return  !todo.done;
        });
      };

      // Add a new todo
      $scope.addTodo = function() {
        if ($scope.formTodoText) {
          $scope.todos.push({ text: $scope.formTodoText, done: false });
          $scope.formTodoText = '';
          $scope.msg = '';
          $scope.danger = false;
        }
        else {
          $scope.msg = 'You must add a Todo message!';
          $scope.danger = true;
        }
      };

      // Handle click of text that displays after the input checkbox
      $scope.todoClick = function(todo) {
        todo.done = true;
      };
    }]);
} (window.angular));