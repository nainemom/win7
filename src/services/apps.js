import appsMeta from '../apps/AppsMeta';

export function fetchApp(name, isSystemApp) {
  if (isSystemApp) {
    return import('./../apps/System32/' + name + '.vue');
  } else {
    return import('./../apps/ProgramFiles/' + name + '.vue');
  }
}
