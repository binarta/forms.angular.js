describe('forms', function () {
    var scope;

    beforeEach(module('forms'));
    beforeEach(inject(function($rootScope) {
        scope = $rootScope.$new();
    }));

    describe('field directive', function() {
        var directive;

        beforeEach(inject(function($injector, topicRegistry) {
            directive = FormsFieldDirectiveFactory(topicRegistry);
        }));

        it('restricted to', function() {
            expect(directive.restrict).toEqual('EAC');
        });

        it('transclude', function() {
            expect(directive.transclude).toEqual(true);
        });

        it('template', function() {
            expect(directive.template).toEqual('<div>' +
                '<div ng-hide="editable" ng-transclude></div>' +
                '<div ng-show="editable">' +
                '<div ng-hide="editing" class="editable" ng-click="edit()" ng-transclude></div>' +
                '<div ng-show="editing" ng-include="onEditTemplate"/>' +
                '</div>' +
                '</div>');
        });

        it('scope', function() {
            expect(directive.scope).toEqual({
                it:'=',
                name:'@',
                onEditTemplate:'@'
            });
        });

        describe('when linked', function() {
            beforeEach(function() {
                scope.it = 'item';
                directive.link(scope);
            });

            it('editable mode disabled', function() {
                expect(scope.editable).toEqual(false);
            });

            it('editing mode disabled', function() {
                expect(scope.editing).toEqual(false);
            });

            it('on edit has no effect', function() {
                scope.edit();
                expect(scope.editing).toEqual(false);
            });

            describe('on toggle.edit.mode notification received', function() {
                var topics;

                beforeEach(inject(function(topicRegistryMock) {
                    topics = topicRegistryMock;
                    topics['edit.mode'](true);
                }));

                it('editable mode enabled', function() {
                    expect(scope.editable).toEqual(true);
                });

                describe('and on edit', function() {
                    beforeEach(function() {
                        scope.edit();
                    });

                    it('editing mode enabled', function() {
                        expect(scope.editing).toEqual(true);
                    });

                    it('and on form.field.updated notification received disable editing mode', function() {
                        topics['form.field.updated'](scope.it);
                        expect(scope.editing).toEqual(false);
                        topics['form.field.updated'](scope.it);
                        expect(scope.editing).toEqual(false);
                    });
                });
            });
        });
    });
});
