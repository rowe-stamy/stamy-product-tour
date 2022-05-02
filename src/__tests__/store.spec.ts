import { CreateProductTours, intitialProductTourState, ProductTour, StartProductTour } from '../model';
import { productTourStore } from '../store';

const createCopy = <T extends unknown>(obj: T): T => JSON.parse(JSON.stringify(obj)) as T;

describe('store', () => {
  let state = intitialProductTourState;
  beforeEach(() => {
    state = createCopy(intitialProductTourState);
  });

  it('should handle InitialAction', () => {
    productTourStore.state = state;
    productTourStore.dispatch({
      type: 'InitialAction'
    });
    expect(productTourStore.state).toBe(productTourStore.state);
  });

  it('should fail to start missing product tour', () => {
    productTourStore.state = state;
    productTourStore.dispatch({
      type: 'StartProductTour',
      scenario: 'test'
    } as StartProductTour);
    expect(productTourStore.state.scenario).toBeFalsy();
  });

  it('should create product tours and start', () => {
    productTourStore.state = state;
    const testProductTour: ProductTour = {
      scrollContainerClassName: '',
      definitions: [
        {
          step: 'element-1',
          text: {
            en: 'start'
          }
        }
      ]
    };
    productTourStore.dispatch({
      type: 'CreateProductTours',
      productTours: {
        test: testProductTour
      }
    } as CreateProductTours);
    productTourStore.dispatch({
      type: 'StartProductTour',
      scenario: 'test'
    } as StartProductTour);
    expect(productTourStore.state.scenario).toBe('test');
  });
});
