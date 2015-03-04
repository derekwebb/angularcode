
function MainCtrl() {
  this.items = [{
    name: 'Scuba Diving Kit',
    id: 1234556234
  },{
    name: 'Some other bullshit',
    id: 234859875
  },{
    name: 'More bullshit',
    id: 0094588540
  }];
}


var app = angular
  .module('app', [])
  .controller('MainCtrl', MainCtrl);
