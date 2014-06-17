import { bind } from '../src/utils';

describe('Utils', function () {
  describe('bind', function () {
    it('binds context to the function', function () {
      var obj = { name: 'Shusaku' };
      function sayName() { return this.name; }
      var func = bind(obj, sayName);
      expect(func()).to.eq('Shusaku');
    });

    it('passes arguments to the function', function () {
      function add(a, b) { return a + b; }
      var func = bind({}, add);
      expect(func(2, 3)).to.eq(5);
    });
  });
});
