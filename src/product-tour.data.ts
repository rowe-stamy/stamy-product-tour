export type TourStepXPos = 'outerLeft' | 'outerRight' | 'innerLeft' | 'innerRight';
export type TourStepYPos = 'outerTop' | 'outerBottom' | 'innerTop' | 'innerBottom';

export type ProductStepPosition = {
  x: TourStepXPos;
  y: TourStepYPos;
  padding?: number;
  paddingX?: number;
  paddingY?: number;
  elementId?: string;
};

export type ProductTourActionType =
  | 'InitialAction'
  | 'CreateProductTours'
  | 'StartProductTour'
  | 'ProductTourStepIsReady'
  | 'SetProductTourNextStep'
  | 'SetProductTourPrevStep'
  | 'CancelProductTour'
  | 'CheckCanContinueProductTour';

export interface ProductTourAction {
  type: ProductTourActionType;
}

export type ProductTourStepDescription = { [key in string]: string };

export type ProductTourStepDefinition = {
  step: string;
  text: ProductTourStepDescription;
  scrollContainerClassName?: string;
  pos?: ProductStepPosition;
  awaitedElementId?: string;
  calllback?: () => void;
  canProceed?: () => boolean;
};

export type ProductTour = {
  definitions: ProductTourStepDefinition[];
  scrollContainerClassName: string;
  cleanUp?: () => void;
};

export type InitialAction = ProductTourAction;
export interface CreateProductTours extends ProductTourAction {
  productTours: { [key in string]: ProductTour };
}
export interface StartProductTour extends ProductTourAction {
  scenario: string;
}
export type ProductTourStepIsReady = ProductTourAction;
export type SetProductTourNextStep = ProductTourAction;
export type SetProductTourPrevStep = ProductTourAction;
export type CancelProductTour = ProductTourAction;
export type CheckCanContinueProductTour = ProductTourAction;

export interface ProductTourState {
  scenario: string;
  lastStep: string | null;
  lastStepIndex: number;
  currentStep: string | null;
  currentStepIndex: number;
  canContinue: boolean;
  attachmentFunctions: { [key in string]?: { handler: () => void; isAttached: boolean } };
  productTours: { [key in string]: ProductTour };
}

export interface ProductTourStore {
  state: ProductTourState;
  action: ProductTourAction;
}

export const intitialProductTourState: ProductTourState = {
  lastStep: null,
  lastStepIndex: 0,
  currentStep: null,
  currentStepIndex: 0,
  scenario: null,
  canContinue: false,
  attachmentFunctions: {},
  productTours: {}
};
