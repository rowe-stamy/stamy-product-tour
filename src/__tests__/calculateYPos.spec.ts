import { calculateYPos } from '../service';

describe('calculateYPos', () => {
  it('should calculate outer top position', () => {
    const result = calculateYPos(
      {
        top: 0,
        bottom: 100
      },
      {
        height: 70
      },
      'outerTop',
      0
    );
    expect(result).toBe(-70);
  });

  it('should calculate outer top position with padding', () => {
    const result = calculateYPos(
      {
        top: 0,
        bottom: 100
      },
      {
        height: 70
      },
      'outerTop',
      10
    );
    expect(result).toBe(-80);
  });

  it('should calculate inner top position', () => {
    const result = calculateYPos(
      {
        top: 10,
        bottom: 100
      },
      {
        height: 70
      },
      'innerTop',
      0
    );
    expect(result).toBe(10);
  });

  it('should calculate inner top position with padding', () => {
    const result = calculateYPos(
      {
        top: 10,
        bottom: 100
      },
      {
        height: 70
      },
      'innerTop',
      10
    );
    expect(result).toBe(20);
  });

  it('should calculate outer bottom position', () => {
    const result = calculateYPos(
      {
        top: 0,
        bottom: 100
      },
      {
        height: 70
      },
      'outerBottom',
      0
    );
    expect(result).toBe(100);
  });

  it('should calculate outer bottom position with padding', () => {
    const result = calculateYPos(
      {
        top: 0,
        bottom: 100
      },
      {
        height: 70
      },
      'outerBottom',
      10
    );
    expect(result).toBe(110);
  });

  it('should calculate inner bottom position', () => {
    const result = calculateYPos(
      {
        top: 0,
        bottom: 100
      },
      {
        height: 70
      },
      'innerBottom',
      0
    );
    expect(result).toBe(30);
  });

  it('should calculate inner bottom position with padding', () => {
    const result = calculateYPos(
      {
        top: 0,
        bottom: 100
      },
      {
        height: 70
      },
      'innerBottom',
      10
    );
    expect(result).toBe(20);
  });
});
