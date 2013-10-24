describe('GOBAN.Utils', function () {
  describe('.bind', function () {
    it('binds context to the function', function () {
      var obj = { name: 'Shusaku' };
      function sayName() { return this.name; }
      var func = GOBAN.Utils.bind(obj, sayName);
      expect(func()).to.eq('Shusaku');
    });

    it('passes arguments to the function', function () {
      function add(a, b) { return a + b; }
      var func = GOBAN.Utils.bind({}, add);
      expect(func(2, 3)).to.eq(5);
    });
  });
});

describe('GOBAN.Point', function () {
  var point;

  beforeEach(function () {
    point = new GOBAN.Point(3, 4);
  });

  describe('new', function () {
    it('holds passed coordinates', function () {
      expect(point.x).to.eq(3);
      expect(point.y).to.eq(4);
    });
  });

  describe('#equals', function () {
    it('equals another point with the same coordinates', function () {
      expect(point.equals(new GOBAN.Point(3, 4))).to.be.true;
      expect(point.equals(new GOBAN.Point(5, 4))).to.be.false;
    });

    it('equals an object with the same x and y', function () {
      expect(point.equals({ x: 3, y: 4})).to.be.true;
      expect(point.equals({ x: 5, y: 4})).to.be.false;
    });
  });
});

describe('GOBAN.Board', function () {
  var board;

  beforeEach(function () {
    board = new GOBAN.Board();
  });

  describe('#put', function () {
    it('returns put position', function () {
      var point = new GOBAN.Point(3, 3);
      var res = board.put(point);
      expect(res.move).to.eq(point);
    });

    it('returns prisoners taken by the move', function () {
      var taken = new GOBAN.Point(3, 4);
      board.put(new GOBAN.Point(3, 3)); // B
      board.put(taken); // W
      board.put(new GOBAN.Point(4, 4)); // B
      board.put(new GOBAN.Point(4, 3)); // W
      board.put(new GOBAN.Point(3, 5)); // B
      board.put(new GOBAN.Point(5, 4)); // W
      var res = board.put(new GOBAN.Point(2, 4)); // B
      var prisoners = res.prisoners;
      expect(prisoners.length).to.eq(1);
      expect(prisoners[0].equals(taken)).to.be.true;
    });
  })
});
