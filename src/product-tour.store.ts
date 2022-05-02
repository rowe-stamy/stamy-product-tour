import { Observable, pipe, Subject, UnaryFunction } from 'rxjs';
import { filter, map, pairwise, startWith } from 'rxjs/operators';
import {
  addHighlightElement,
  adjustToScrollPosition,
  attachElement,
  buildAttachmentFunctions,
  canContinue,
  dettachElement,
  getNextStep,
  getPrevStep,
  removeHighlightElement,
  waitForElement
} from './product-tour.behavior';
import {
  CreateProductTours,
  intitialProductTourState,
  ProductTourAction,
  ProductTourActionType,
  ProductTourState,
  ProductTourStore,
  StartProductTour
} from './product-tour.data';

const filterChanged = <T>(initialValue: T): UnaryFunction<Observable<T>, Observable<T>> =>
  pipe(
    startWith(initialValue),
    pairwise(),
    filter(([p, c]) => p !== c),
    map(([, c]) => c)
  );

const reducers: {
  [key in ProductTourActionType]: (state: ProductTourState, action: ProductTourAction) => ProductTourState;
} = {
  InitialAction: (state, action) => state,
  CreateProductTours: (state, action: CreateProductTours) => {
    return {
      ...state,
      productTours: action.productTours
    };
  },
  StartProductTour: (state, action: StartProductTour) => {
    const productTour = state.productTours[action.scenario];
    if (!productTour) {
      return state;
    }
    if (productTour.definitions.length === 0) {
      return state;
    }
    return {
      ...state,
      lastStep: state.currentStep,
      scenario: action.scenario,
      currentStep: productTour.definitions[0].step,
      currentStepIndex: 0,
      canContinue: canContinue(productTour, 0),
      attachmentFunctions: buildAttachmentFunctions(productTour.definitions)
    };
  },
  ProductTourStepIsReady: state => {
    if (!state.currentStep) {
      return state;
    }
    removeHighlightElement(state.lastStep);
    addHighlightElement(state.currentStep);

    const productTour = state.productTours[state.scenario];
    const currentDefinition = productTour.definitions[state.currentStepIndex];
    adjustToScrollPosition(currentDefinition.step, currentDefinition.pos);

    attachElement(
      state.currentStep,
      currentDefinition?.scrollContainerClassName || productTour?.scrollContainerClassName,
      state.attachmentFunctions
    );

    if (state.lastStep) {
      const lastStepDefinition = productTour.definitions[state.lastStepIndex];
      dettachElement(
        state.lastStep,
        lastStepDefinition?.scrollContainerClassName || productTour?.scrollContainerClassName,
        state.attachmentFunctions
      );
    }

    if (currentDefinition.awaitedElementId) {
      waitForElement(currentDefinition.awaitedElementId, () =>
        productTourStore.dispatch({ type: 'CheckCanContinueProductTour' })
      );
    }

    if (currentDefinition.calllback) {
      currentDefinition.calllback();
    }
    return state;
  },
  SetProductTourNextStep: state => {
    const productTour = state.productTours[state.scenario];
    const nextStep = getNextStep(productTour.definitions, state.currentStepIndex);
    const currentStepIndex = nextStep == null ? 0 : state.currentStepIndex + 1;
    removeHighlightElement(state.currentStep);
    if (!nextStep && productTour?.cleanUp) {
      productTour.cleanUp();
    }
    return {
      ...state,
      lastStep: state.currentStep,
      lastStepIndex: state.currentStepIndex,
      currentStep: nextStep,
      currentStepIndex,
      canContinue: canContinue(productTour, currentStepIndex)
    };
  },
  SetProductTourPrevStep: state => {
    const productTour = state.productTours[state.scenario];
    const nextStep = getPrevStep(productTour.definitions, state.currentStepIndex);
    const currentStepIndex = nextStep == null ? 0 : state.currentStepIndex - 1;
    removeHighlightElement(state.currentStep);
    if (!nextStep && productTour?.cleanUp) {
      productTour.cleanUp();
    }
    return {
      ...state,
      lastStep: state.currentStep,
      lastStepIndex: state.currentStepIndex,
      currentStep: nextStep,
      currentStepIndex,
      canContinue: canContinue(productTour, currentStepIndex)
    };
  },
  CancelProductTour: state => {
    const productTour = state.productTours[state.scenario];
    if (productTour.cleanUp) {
      productTour.cleanUp();
    }
    removeHighlightElement(state.lastStep);
    removeHighlightElement(state.currentStep);
    productTour.definitions.forEach((d, i) =>
      dettachElement(
        d.step,
        d?.scrollContainerClassName || productTour.scrollContainerClassName,
        state.attachmentFunctions
      )
    );
    return {
      ...state,
      lastStep: state.currentStep,
      lastStepIndex: 0,
      currentStep: null,
      currentStepIndex: 0,
      attachmentFunctions: {}
    };
  },
  CheckCanContinueProductTour: state => {
    const productTour = state.productTours[state.scenario];
    return {
      ...state,
      canContinue: canContinue(productTour, state.currentStepIndex)
    };
  }
};

type ProductStoreWrapper = {
  state: ProductTourState;
  subject: Subject<ProductTourStore>;
  latestStore: { state: ProductTourState; action: ProductTourAction };
  dispatch: (action: ProductTourAction) => void;
  select: { state$: () => Observable<ProductTourState>; actions$: () => Observable<ProductTourAction> };
};

export const productTourStore: ProductStoreWrapper = {
  subject: new Subject<ProductTourStore>(),
  state: intitialProductTourState,
  latestStore: {
    state: intitialProductTourState,
    action: {
      type: 'InitialAction'
    }
  },

  dispatch: (action: ProductTourAction) => {
    productTourStore.state = reducers[action.type](productTourStore.state, action);
    productTourStore.latestStore = {
      state: productTourStore.state,
      action
    };
    productTourStore.subject.next({
      state: productTourStore.state,
      action
    });
  },
  select: {
    actions$: (): Observable<ProductTourAction> => productTourStore.subject.pipe(map(s => s.action)),
    state$: (): Observable<ProductTourState> =>
      productTourStore.subject.pipe(
        startWith(productTourStore.latestStore),
        map(s => s.state),
        filterChanged(intitialProductTourState)
      )
  }
};
