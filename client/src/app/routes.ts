export const APP_ROUTE_PATHS = {
  root: ``,
  uiDemo: `ui`,
  learn: `learn/:chatbotId`,
  assistant: `assistant`,
};

export const APP_ROUTE_BUILDER = {
  root: () => [`/`],
  uiDemo: () => [`/ui-demo`],
  learn: (chatbotId: string) => [`/learn/${chatbotId}`],
  assistant: () => [`/assistant`],
};
