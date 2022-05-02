import { AttachmentFunctions, ProductStepPosition, ProductTour, TourStepXPos, TourStepYPos } from './model';

export const calculateXPos = (
  rectTarget: { left: number; right: number },
  rectTourStep: { width: number },
  xPos: TourStepXPos,
  padding: number
): number => {
  switch (xPos) {
    case 'innerLeft':
      return rectTarget.left + padding;
    case 'outerLeft':
      return rectTarget.left - rectTourStep.width - padding;
    case 'innerRight':
      return rectTarget.right - rectTourStep.width - padding;
    case 'outerRight':
      return rectTarget.right + padding;
    default:
      return rectTarget.left;
  }
};

export const calculateYPos = (
  rectTarget: { top: number; bottom: number },
  rectTourStep: { height: number },
  yPos: TourStepYPos,
  padding: number
): number => {
  switch (yPos) {
    case 'innerTop':
      return rectTarget.top + padding;
    case 'innerBottom':
      return rectTarget.bottom - rectTourStep.height - padding;
    case 'outerTop':
      return rectTarget.top - rectTourStep.height - padding;
    case 'outerBottom':
      return rectTarget.bottom + padding;
    default:
      return rectTarget.top;
  }
};

export const calculateBestXPos = (constaints: {
  minWidth: number;
  marginLeft: number;
  marginRight: number;
}): TourStepXPos => {
  const { minWidth, marginLeft, marginRight } = constaints;
  if (minWidth < marginLeft && minWidth < marginRight) {
    return 'outerLeft';
  } else if (minWidth < marginLeft && minWidth >= marginRight) {
    return 'outerLeft';
  } else if (minWidth >= marginLeft && minWidth < marginRight) {
    return 'outerRight';
  } else if (minWidth >= marginLeft && minWidth >= marginRight) {
    return 'innerLeft';
  }
  return 'outerLeft';
};

export const calculateBestYPos = (constaints: {
  minHeight: number;
  marginBottom: number;
  marginTop: number;
}): TourStepYPos => {
  const { minHeight, marginBottom, marginTop } = constaints;
  if (minHeight < marginBottom && minHeight < marginTop) {
    return 'innerTop';
  } else if (minHeight < marginBottom && minHeight >= marginTop) {
    return 'outerBottom';
  } else if (minHeight >= marginBottom && minHeight < marginTop) {
    return 'outerTop';
  } else if (minHeight >= marginBottom && minHeight >= marginTop) {
    return 'outerTop';
  }
  return 'innerTop';
};

export const placeTourStep = (step: string, pos: ProductStepPosition) => {
  const tourStep = document.getElementById('tourStep');
  const target = document.getElementById(step);
  if (!tourStep || !target) {
    return;
  }
  const rectTourStep = tourStep.getBoundingClientRect();
  const rectTarget = target.getBoundingClientRect();
  const paddingX = pos.paddingX || pos.padding || 0;
  const paddingY = pos.paddingY || pos.padding || 0;
  tourStep.style.left = calculateXPos(rectTarget, rectTourStep, pos.x, paddingX) + 'px';
  tourStep.style.top = calculateYPos(rectTarget, rectTourStep, pos.y, paddingY) + 'px';
};

export const placeTourStepBest = (step: string, padding: number) => {
  const tourStep = document.getElementById('tourStep');
  const target = document.getElementById(step);
  if (!tourStep || !target) {
    return;
  }
  const rectTarget = target.getBoundingClientRect();
  const rectStep = tourStep.getBoundingClientRect();
  const marginRight = window.innerWidth - rectTarget.left - rectTarget.width;
  const marginLeft = rectTarget.left;
  const marginBottom = window.innerHeight - rectTarget.top - rectTarget.height;
  const marginTop = rectTarget.top - window.innerHeight;
  const minWidth = rectStep.width + padding;
  const minHeight = rectStep.height + padding;
  const xPos = calculateBestXPos({ minWidth, marginLeft, marginRight });
  const yPos = calculateBestYPos({ minHeight, marginBottom, marginTop });
  placeTourStep(step, { x: xPos, y: yPos, padding });
};

export const adjustToScrollPosition = (step: string, position?: ProductStepPosition) => {
  const targetId = position?.elementId || step;
  const targetElement = document.getElementById(targetId);
  if (!targetElement) {
    return;
  }
  if (position) {
    placeTourStep(targetId, position);
  } else {
    placeTourStepBest(targetId, 10);
  }
};

export const waitForElement = (step: string, callback: () => void) => {
  const handleFound = (observer: MutationObserver) => {
    observer.disconnect();
    callback();
  };
  const findNode = (n: NodeListOf<ChildNode>, observer: MutationObserver) => {
    n.forEach(c => {
      if ((c as any)?.id === step) {
        handleFound(observer);
      } else {
        findNode(c.childNodes, observer);
      }
    });
  };
  new MutationObserver((mutationsList, observer) => {
    mutationsList.forEach(l => {
      l.addedNodes.forEach(n => {
        if ((n as any)?.id === step) {
          handleFound(observer);
        } else {
          findNode(n.childNodes, observer);
        }
      });
    });
  }).observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true
  });
};

export const addHighlightElement = (step: string | null) => {
  if (!step) {
    return;
  }
  const el = document.getElementById(step);
  if (!el) {
    return;
  }
  el.classList.add('highlight-tour-step');
};

export const removeHighlightElement = (step: string | null) => {
  if (!step) {
    return;
  }
  const el = document.getElementById(step);
  if (!el) {
    return;
  }
  el.classList.remove('highlight-tour-step');
};

export const attachElement = (
  step: string,
  scrollContainerClassName?: string,
  attachmentFunctions?: AttachmentFunctions
) => {
  if (!step || !attachmentFunctions) {
    return;
  }
  const attachmentFunc = attachmentFunctions[step];
  if (!attachmentFunc) {
    return;
  }
  if (attachmentFunc.isAttached) {
    return;
  }
  const el = scrollContainerClassName ? document.getElementsByClassName(scrollContainerClassName)[0] : window;
  if (!el) {
    return;
  }
  attachmentFunc.isAttached = true;
  el.addEventListener('scroll', attachmentFunc?.handler);
};

export const dettachElement = (
  step: string | null,
  scrollContainerClassName?: string,
  attachmentFunctions?: AttachmentFunctions
) => {
  if (!step || !attachmentFunctions) {
    return;
  }
  const attachmentFunc = attachmentFunctions[step];
  if (!attachmentFunc) {
    return;
  }
  const el = scrollContainerClassName ? document.getElementsByClassName(scrollContainerClassName)[0] : window;
  if (!el) {
    return;
  }
  el.removeEventListener('scroll', attachmentFunc?.handler);
};

export const buildAttachmentFunctions = (
  definitions: { step: string; pos?: ProductStepPosition }[]
): AttachmentFunctions => {
  const cp: AttachmentFunctions = {};
  definitions.reduce((p, c) => {
    cp[c.step] = {
      handler: () => adjustToScrollPosition(c.step, c.pos),
      isAttached: false
    };
    return cp;
  }, cp);
  return cp;
};

export const getNextStep = (definitions: { step: string }[], currentIndex: number): string | null => {
  if (!definitions) {
    return null;
  }
  if (currentIndex + 1 >= definitions.length) {
    return null;
  }

  return definitions[currentIndex + 1].step;
};

export const getPrevStep = (definitions: { step: string }[], currentIndex: number): string | null => {
  if (!definitions) {
    return null;
  }
  if (currentIndex - 1 < 0) {
    return null;
  }

  return definitions[currentIndex - 1].step;
};

export const canContinue = (scenario: ProductTour, currentStepIndex: number): boolean => {
  if (!scenario) {
    return false;
  }
  const nextStep = getNextStep(scenario.definitions, currentStepIndex);
  if (nextStep == null) {
    return true;
  }
  const el = document.getElementById(nextStep);
  if (!el) {
    return false;
  }
  const definition = scenario.definitions[currentStepIndex];
  if (definition?.canProceed) {
    return definition.canProceed();
  }
  return !!el;
};
