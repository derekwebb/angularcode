angular.module('FilterInControllerModule', [])
  .controller('FilterController', ['filterFilter', function(filterFilter) {
    this.array = [
      {name: 'Tobias'},
      {name: 'John'},
      {name: 'Jack'},
      {name: 'Derek'},
      {name: 'Desmond'},
      {name: 'Allan'},
      {name: 'Margie'}
    ];
    this.filteredArray = filterFilter(this.array, 'a');
  }]);  