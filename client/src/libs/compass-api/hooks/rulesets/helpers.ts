import { Ruleset } from '../../gql';

export function buildFlatListOfModules(module: Ruleset, modules: Ruleset[]) {
  const deps = [module];

  for (const subModule of module.modules) {
    const subWithDeps = modules.find((mod) => mod.id === subModule.id);
    if (subWithDeps) {
      deps.push(...buildFlatListOfModules(subWithDeps, modules));
    }
  }

  return deps;
}

export function getModuleWithDependencies(moduleId: string, allModules: Ruleset[]) {
  const targetModule = allModules.find((mod) => mod.id === moduleId);
  if (!targetModule) return [];

  const dependencies = buildFlatListOfModules(targetModule, allModules);

  const depSet = new Set<string>();
  const dedupedDependencies: Ruleset[] = [];

  for (const dep of dependencies) {
    if (depSet.has(dep.id)) continue;
    dedupedDependencies.push(dep);
    depSet.add(dep.id);
  }

  return dedupedDependencies;
}
