angular.module('FilterInControllerModule', [])
  .controller('FilterController', ['filterFilter', function(filterFilter) {
    this.filterStr = 'a';
    this.array = [
      {name: 'Tobias'},
      {name: 'John'},
      {name: 'Jack'},
      {name: 'Derek'},
      {name: 'Desmond'},
      {name: 'Allan'},
      {name: 'Margie'}
    ];

    var that = this;
    this.filterMyArray = function() {
      return filterFilter(that.array, that.filterStr);
    };

    this.addName = function() {
      this.array.push({name: that.newName});
      that.newName = '';
    };

    this.removeName = function(index) {
      this.array.splice(index, 1);
    };
  }]);  