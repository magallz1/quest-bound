import { useAttribute, useCharts, useUpdateAttribute } from '@/libs/compass-api';
import { Loading, useDeviceSize } from '@/libs/compass-core-ui';
import { Logic, LogicEditor as PlanesLogicEditor } from '@/libs/compass-planes';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEvaluateLogic, useLogicState } from './attribute-store';
import { LogicEditorControls } from './components';

interface Props {
  isItem?: boolean;
  overrideAttributeId?: string;
  fullWidth?: boolean;
  onClose?: () => void;
}

export const AttributeLogicEditor = ({
  isItem,
  overrideAttributeId,
  fullWidth = false,
  onClose,
}: Props) => {
  const { rulesetId } = useParams();
  const { attributeId: _attributeId } = useParams();

  const attributeId = overrideAttributeId ?? _attributeId;

  const { desktop } = useDeviceSize();
  const { attribute, loading } = useAttribute(attributeId);
  const { charts } = useCharts(undefined, !attributeId);
  const { updateAttribute } = useUpdateAttribute(2000);
  const navigate = useNavigate();

  const [forcedLoading, setForcedLoading] = useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(!!attributeId);

  useEffect(() => {
    setOpen(!!attributeId);
  }, [attributeId]);

  const {
    injectedLogic,
    attributes,
    items,
    promoteToAttribute,
    createOperations,
    deleteOperations,
    updateOperation,
    updateOperations,
    setOperationOverride,
  } = useLogicState(attribute);

  const { evaluateLogic, deriveLogicResult } = useEvaluateLogic({
    charts,
    attributes,
    items,
    useTestValues: true,
  });

  const { evaluatedLogic, errors } = evaluateLogic(injectedLogic);
  const evaluatedLogicResult = deriveLogicResult(evaluatedLogic);

  const getOperation = (id: string) => evaluatedLogic.find((op) => op.id === id);
  const getAttribute = (id?: string | null) => attributes.find((attr) => attr.id === id);
  const getItem = (id?: string | null) => items.find((item) => item.id === id);

  const onNodesMove = (logic: Logic) => {
    updateAttribute({
      id: attribute?.id ?? '',
      logic: JSON.stringify(logic),
    });
  };

  return (
    <AnimatePresence>
      <motion.section
        style={{
          position: 'absolute',
          backgroundColor: '#2A2A2A',
          height: 'calc(100dvh - 140px)',
          width: 0,
          right: 10,
          zIndex: 3,
        }}
        initial={{ top: 140 }}
        animate={
          open
            ? {
                width: desktop ? `calc(100vw - ${fullWidth ? '15px' : '260px'})` : '98vw',
                border: '1px solid white',
              }
            : {}
        }
        exit={{ width: 0 }}
        transition={{ duration: 0.5 }}>
        {!!attributeId && (loading || forcedLoading) ? (
          <Loading />
        ) : (
          <>
            {!!attribute && (
              <PlanesLogicEditor
                onCloseEditor={() => {
                  if (!!overrideAttributeId) {
                    onClose?.();
                  } else {
                    navigate(
                      isItem ? `/rulesets/${rulesetId}/items` : `/rulesets/${rulesetId}/attributes`,
                    );
                  }
                }}
                key={attribute.id}
                attribute={attribute}
                logic={evaluatedLogic}
                errors={errors}
                editControls={
                  <LogicEditorControls
                    result={evaluatedLogicResult}
                    setForcedLoading={setForcedLoading}
                    attribute={attribute}
                  />
                }
                getOperation={getOperation}
                getAttribute={getAttribute}
                getItem={getItem}
                promoteToAttribute={promoteToAttribute}
                onChange={onNodesMove}
                onCreate={createOperations}
                onDeleteOperations={deleteOperations}
                onUpdateOperation={updateOperation}
                onUpdateOperations={updateOperations}
                overrideOperation={setOperationOverride}
              />
            )}
          </>
        )}
      </motion.section>
    </AnimatePresence>
  );
};
