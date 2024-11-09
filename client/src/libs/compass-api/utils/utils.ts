/**
 * Inserts the child ID in the sorted child ID array. If childIndex is -1, removes the child ID.
 * Pass Infinity for index to place new ID at the end.
 */
export function insertPageAt(childIds: string[], newChildId: string, index: number) {
  const pageOrder = childIds.filter((id) => id !== newChildId);

  if (index >= 0) {
    pageOrder.splice(index, 0, newChildId);
  }

  return [...new Set(pageOrder)];
}

/**
 * Removes __typename from GraphQL response
 */
export function convertRawResponse<T>(raw: Record<any, any>) {
  const copy = { ...raw };
  delete copy.__typename;
  return copy as T;
}
