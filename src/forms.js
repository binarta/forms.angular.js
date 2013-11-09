angular.module('forms', ['notifications'])
    .directive('formsField', ['topicRegistry', FormsFieldDirectiveFactory]);

function FormsFieldDirectiveFactory(topicRegistry) {
    return {
        restrict: 'EAC',
        transclude: true,
        template: '<div>' +
            '<div ng-hide="editable" ng-transclude></div>' +
            '<div ng-show="editable">' +
            '<div ng-hide="editing" class="editable" ng-click="edit()" ng-transclude></div>' +
            '<div ng-show="editing" ng-include="onEditTemplate"/></div>' +
            '</div>',
        scope: {
            it: '=',
            name: '@',
            onEditTemplate: '@'
        },
        link: function (scope) {
            scope.editable = false;
            scope.editing = false;

            scope.edit = function () {
                if (scope.editable) scope.editing = !scope.editing;
            };

            topicRegistry.subscribe('edit.mode', function () {
                scope.editable = !scope.editable
            });
            topicRegistry.subscribe('form.field.updated', function (it) {
                console.log('form.field.updated');
                console.dir(it);
                if (scope.it == it) scope.editing = !scope.editing;
            });
        }
    };
}