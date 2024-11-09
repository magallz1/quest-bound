export function convertEntityId(rulesetId?: string) {
  const fromEntity = (entityId: string) => (rulesetId ? `${entityId}-${rulesetId}` : entityId);
  const toEntity = (fullId: string) => fullId.replace(`-${rulesetId}`, '');
  return {
    fromEntity,
    toEntity,
  };
}
