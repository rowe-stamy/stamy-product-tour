import { calculateXPos } from '../service';

describe('calculateXPos', () => {
  it('should calculate outer right position', () => {
    const result = calculateXPos(
      {
        left: 0,
        right: 100
      },
      {
        width: 100
      },
      'outerRight',
      0
    );
    expect(result).toBe(100);
  });

  it('should calculate outer right position with padding', () => {
    const result = calculateXPos(
      {
        left: 0,
        right: 100
      },
      {
        width: 100
      },
      'outerRight',
      10
    );
    expect(result).toBe(110);
  });

  it('should calculate inner right position', () => {
    const result = calculateXPos(
      {
        left: 0,
        right: 100
      },
      {
        width: 75
      },
      'innerRight',
      0
    );
    expect(result).toBe(25);
  });

  it('should calculate inner right position with padding', () => {
    const result = calculateXPos(
      {
        left: 0,
        right: 100
      },
      {
        width: 75
      },
      'innerRight',
      10
    );
    expect(result).toBe(15);
  });

  it('should calculate outer left position', () => {
    const result = calculateXPos(
      {
        left: 0,
        right: 100
      },
      {
        width: 100
      },
      'outerLeft',
      0
    );
    expect(result).toBe(-100);
  });

  it('should calculate outer left position with padding', () => {
    const result = calculateXPos(
      {
        left: 0,
        right: 100
      },
      {
        width: 100
      },
      'outerLeft',
      10
    );
    expect(result).toBe(-110);
  });

  it('should calculate inner left position', () => {
    const result = calculateXPos(
      {
        left: 10,
        right: 100
      },
      {
        width: 70
      },
      'innerLeft',
      0
    );
    expect(result).toBe(10);
  });

  it('should calculate inner left position with padding', () => {
    const result = calculateXPos(
      {
        left: 10,
        right: 100
      },
      {
        width: 70
      },
      'innerLeft',
      10
    );
    expect(result).toBe(20);
  });
});
