import { getScssVariable, ScssVariable } from './scss-variables.generated';

export function isMobile() {
  return (
    window.innerWidth <
    parseInt(getScssVariable(ScssVariable.TB_BREAKPOINT_MD).split('px')[0])
  );
}
