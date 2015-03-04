(function (angular) {
  'use strict';

  angular.module('dragModule', [])
    .directive('myDraggable', ['$document', function ($document) {
      return function (scope, element, attr) {
        console.log(element);
        
        var startX = 0, startY = 0, x = 0, y = 0;
        scope.current = { x: startX, y: startY };

        // Set dragabble style
        element.css({
          position: 'relative',
          border: '1px solid red',
          background: '#FF9999',
          cursor: 'move',
          display: 'inline-block',
          padding: '5px',
          color: 'darkred',
          fontWeight: 'bold'
        });

        function mousemove(event) {
          x = event.pageX - startX;
          y = event.pageY - startY;

          element.css({
            top: y + 'px',
            left: x + 'px'
          });

          scope.current.x = x;
          scope.current.y = y;
          scope.$apply();
        }

        function mouseup() {
          $document.off('mousemove', mousemove);
          $document.off('mouseup', mouseup);
        }

        element.on('mousedown', function (event) {
          // prevent default dragging of selected content
          event.preventDefault();
          startX = event.pageX - x;
          startY = event.pageY - y;
          $document.on('mousemove', mousemove);
          $document.on('mouseup', mouseup);
        });
      };
    }]);
}(window.angular));