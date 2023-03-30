export const APP_ROUTE_PATHS = {
  root: ``,
  uiDemo: `ui`,
  learn: `learn/:topic`,
  assistant: `assistant`,
};

export const APP_ROUTE_BUILDER = {
  root: () => [`/`],
  uiDemo: () => [`/ui-demo`],
  learn: (topic: string) => [`/learn/${topic}`],
  assistant: () => [`/assistant`],
};
