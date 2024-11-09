import { useParams } from 'react-router-dom';
import {
  Attribute,
  attributes,
  AttributesQuery,
  AttributesQueryVariables,
  attributesWithLogic,
  AttributeType,
} from '../../gql';
import { useQuery } from '../../utils';
import { useError } from '../metrics';

export const useAttributes = (
  skip?: boolean,
  type?: AttributeType,
  fetchLogic?: boolean,
  overrideRulesetId?: string,
) => {
  const { rulesetId: _rulesetId } = useParams();
  const rulesetId = overrideRulesetId ?? _rulesetId;

  const query = fetchLogic ? attributesWithLogic : attributes;

  const { data, loading, error } = useQuery<AttributesQuery, AttributesQueryVariables>(query, {
    variables: {
      rulesetId: rulesetId ?? '',
      type,
    },
    skip: !rulesetId || skip,
  });

  useError({
    error,
    message: 'Failed to load attributes',
  });

  const dataAttributes = (data?.attributes ?? []) as Attribute[];
  const sortedAttributes: Attribute[] = [];

  const addedAttributeIds = new Set<string>();

  const lastNode = dataAttributes.find((n) => n.sortChildId === null);
  let prevNode = lastNode;

  while (!!prevNode) {
    sortedAttributes.unshift(prevNode);
    addedAttributeIds.add(prevNode.id);
    prevNode = dataAttributes.find((n) => n.sortChildId === prevNode?.id);
  }

  // TODO: Attributes are sometimes lost when improper sortChildIds are set
  // This will add them to the end of the list for a better UX until this is solved
  dataAttributes.forEach((n) => {
    if (!addedAttributeIds.has(n.id)) {
      sortedAttributes.push({
        ...n,
        sortChildId: null,
      });
    }
  });

  const filteredAttributes = !!type
    ? sortedAttributes.filter((a) => a.type === type)
    : sortedAttributes;

  return {
    attributes: filteredAttributes,
    loading,
    error,
  };
};
