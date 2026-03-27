import type { DriveStep } from 'driver.js';

export const TOUR_TARGETS = {
  assistant: '[data-tour="assistant-mascot"]',
  headerLogo: '[data-tour="header-logo"]',
  headerNavigation: '[data-tour="header-navigation"]',
  headerSearch: '[data-tour="header-search"]',
  headerCart: '[data-tour="header-cart"]',
  headerAccount: '[data-tour="header-account"]',
  headerAuth: '[data-tour="header-auth"]',
  homeHero: '[data-tour="home-hero"]',
  homeProducts: '[data-tour="home-products"]',
  homeCategories: '[data-tour="home-categories"]',
  adminShell: '[data-tour="admin-shell"]',
  adminNavigation: '[data-tour="admin-navigation"]',
  adminContent: '[data-tour="admin-content"]',
  orderStatus: '[data-tour="order-status"]',
  orderTimeline: '[data-tour="order-timeline"]',
  orderSummary: '[data-tour="order-summary"]',
} as const;

type TourSide = 'left' | 'top' | 'right' | 'bottom' | 'over';
type TourAlign = 'start' | 'center' | 'end';

type TourStepInput = {
  element?: string | string[];
  title: string;
  description: string;
  side?: TourSide;
  align?: TourAlign;
};

const BASE_STEPS: TourStepInput[] = [
  {
    element: TOUR_TARGETS.assistant,
    title: 'Meet Your Assistant',
    description:
      'I stay here to guide visitors through the website. Click me any time to replay the tour.',
    side: 'left',
    align: 'end',
  },
  {
    element: TOUR_TARGETS.headerLogo,
    title: 'Brand Home',
    description: 'Use the logo to jump back to the homepage from anywhere in the site.',
    side: 'bottom',
  },
  {
    element: TOUR_TARGETS.headerNavigation,
    title: 'Main Navigation',
    description:
      'These links move across the main shopping sections such as Shop, Deals, Blog, and Contact.',
    side: 'bottom',
  },
  {
    element: TOUR_TARGETS.headerSearch,
    title: 'Quick Search',
    description:
      'Open the search modal from here. You can also use the keyboard shortcut shown in the tooltip.',
    side: 'bottom',
    align: 'end',
  },
  {
    element: TOUR_TARGETS.headerCart,
    title: 'Cart Access',
    description: 'This icon takes customers straight to the cart and shows the current item count.',
    side: 'bottom',
  },
  {
    element: [TOUR_TARGETS.headerAccount, TOUR_TARGETS.headerAuth],
    title: 'Account Area',
    description:
      'Signed-in users manage profile, orders, and settings here. Signed-out users can sign in from the same spot.',
    side: 'bottom',
    align: 'end',
  },
];

const HOME_STEPS: TourStepInput[] = [
  {
    element: TOUR_TARGETS.homeHero,
    title: 'Hero Section',
    description:
      'The hero introduces the current campaign and gives visitors a fast path into featured collections.',
    side: 'bottom',
  },
  {
    element: TOUR_TARGETS.homeProducts,
    title: 'Featured Products',
    description:
      'This section surfaces top products so visitors can start shopping without extra navigation.',
    side: 'top',
  },
  {
    element: TOUR_TARGETS.homeCategories,
    title: 'Browse by Category',
    description:
      'Categories help visitors narrow the catalog quickly and discover product groups that matter to them.',
    side: 'top',
  },
];

const ADMIN_STEPS: TourStepInput[] = [
  {
    element: TOUR_TARGETS.adminShell,
    title: 'Admin Control Hub',
    description:
      'This assistant switches into operations mode on admin routes and focuses on moderation, analytics, and workflow actions.',
    side: 'left',
  },
  {
    element: TOUR_TARGETS.adminNavigation,
    title: 'Admin Navigation',
    description:
      'Use these tabs to move between dashboard, users, account requests, products, orders, reviews, subscriptions, and notifications.',
    side: 'bottom',
  },
  {
    element: TOUR_TARGETS.adminContent,
    title: 'Management Workspace',
    description:
      'The main panel is where you review data and perform operational actions such as approving requests or processing orders.',
    side: 'top',
  },
];

const ORDER_STEPS: TourStepInput[] = [
  {
    element: TOUR_TARGETS.orderStatus,
    title: 'Order Snapshot',
    description:
      'This card shows the live order and payment status. After checkout, customers must wait for staff to process the order step by step.',
    side: 'bottom',
  },
  {
    element: TOUR_TARGETS.orderTimeline,
    title: 'How The Workflow Moves',
    description:
      'The usual path is: order placed, staff confirm address, then confirm the order, then packing, dispatch, delivery, and final payment confirmation when needed.',
    side: 'right',
  },
  {
    element: TOUR_TARGETS.orderSummary,
    title: 'What The Buyer Needs To Do',
    description:
      'After placing an order, the buyer mostly waits here and tracks progress. In-charge or employee roles handle confirmations and fulfillment behind the scenes.',
    side: 'left',
  },
];

const findExistingSelector = (selector: string | string[]) => {
  const selectors = Array.isArray(selector) ? selector : [selector];
  return selectors.find((value) => document.querySelector(value));
};

const toDriveStep = (step: TourStepInput): DriveStep | null => {
  if (!step.element) {
    return {
      popover: {
        title: step.title,
        description: step.description,
        side: step.side ?? 'bottom',
        align: step.align ?? 'center',
      },
    };
  }

  const selector = findExistingSelector(step.element);
  if (!selector) {
    return null;
  }

  return {
    element: selector,
    popover: {
      title: step.title,
      description: step.description,
      side: step.side ?? 'bottom',
      align: step.align ?? 'center',
    },
  };
};

export const getAssistantTourSteps = (pathname: string): DriveStep[] => {
  const allSteps = [
    ...BASE_STEPS,
    ...(pathname === '/' ? HOME_STEPS : []),
    ...(pathname.startsWith('/admin') ? ADMIN_STEPS : []),
    ...(pathname.includes('/orders/') ? ORDER_STEPS : []),
  ];
  return allSteps.map(toDriveStep).filter(Boolean) as DriveStep[];
};
