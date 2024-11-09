import { AttributeContext, SheetComponent, TextComponentData } from '@/libs/compass-api';
import { SheetAttributeControl } from '@/libs/compass-core-composites';
import { useKeyListeners, useReplaceVariableText } from '@/libs/compass-web-utils';
import { Stack } from '@chakra-ui/react';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNodeId } from 'reactflow';
import ResizableNodeWrapper from '../../common/components/resizable-node-wrapper';
import { Coordinates } from '../../types';
import { useEditorStore } from '../editor-store';
import { useNodeSize, useSubscribeComponentChanges } from '../hooks';

export const TextNode = () => {
  const getComponent = useEditorStore((state) => state.getComponent);
  const viewMode = useEditorStore((state) => state.viewMode);
  const sheetId = useEditorStore((state) => state.sheetId);
  const selectedComponentIds = useEditorStore((state) => state.selectedComponentIds);
  const updateComponent = useEditorStore((state) => state.updateComponent);

  const isSelected = (id: string) => selectedComponentIds.includes(id);

  const { attributes, getAttribute } = useContext(AttributeContext);

  const id = useNodeId();
  const key = useSubscribeComponentChanges(id);

  const component = getComponent(id);

  const _data = JSON.parse(component?.data ?? '{}') as TextComponentData;
  const _style = JSON.parse(component?.style ?? '{}');

  const [css, setCss] = useState(_style);
  const [textData, setData] = useState<TextComponentData>(_data);

  // Don't render the entire component on key change, as it would cause the element to lose focus.
  useEffect(() => {
    const component = getComponent(id);
    const style = JSON.parse(component?.style ?? '{}');
    const data = JSON.parse(component?.data ?? '{}') as TextComponentData;

    setCss(style);
    setData(data);
  }, [key]);

  const { height, width } = useNodeSize(component?.id);
  const mousePos = useRef<Coordinates>({ x: 0, y: 0 });
  const [editing, setEditing] = useState(false);
  const editRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing) {
      editRef.current?.select();
    }
  }, [editing]);

  const selected = isSelected(component?.id ?? '');

  useEffect(() => {
    if (!selected && editing) setEditing(false);
  }, [selected]);

  const mouseMoveToEditThreshold = 5;

  const assignedAttribute = getAttribute?.(textData.attributeId);
  const hasAction = Boolean(textData.actionId);

  const textValue = textData.value ?? '';
  const autoScale = textData.autoScale ?? false;

  const injectedText = useReplaceVariableText(textValue, attributes, textData.announcementId);

  useKeyListeners({
    disabled: !editing,
    blockPropagation: true,
    onKeyDown: (e) => {
      if (e.key === 'Enter' && !e.shift) {
        setEditing?.(false);
      }
    },
  });

  if (!component) return null;

  const updateTextValue = (val: string) => {
    updateComponent({
      sheetId,
      update: {
        id: component.id,
        data: JSON.stringify({
          ...textData,
          value: val || 'Text',
        }),
      },
    });
  };

  return (
    <ResizableNodeWrapper component={component}>
      <Stack
        className={hasAction && viewMode ? 'clickable' : editing ? 'nodrag' : ''}
        onPointerDown={(e) => {
          mousePos.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          if (
            Math.abs(mousePos.current.x - e.clientX) <= mouseMoveToEditThreshold ||
            Math.abs(mousePos.current.y - e.clientY) <= mouseMoveToEditThreshold
          ) {
            if (selected) setEditing(true);
          }
          mousePos.current = { x: 0, y: 0 };
        }}
        width={width}
        height={height}
        alignItems='start'
        justifyContent='start'
        spacing={2}
        sx={{ overflow: 'visible', bgcolor: 'transparent', flexWrap: 'wrap' }}>
        <section
          className='sheet-text-container'
          style={{
            display: 'flex',
            alignItems: css.centerAlign ?? 'center',
            justifyContent: css.textAlign ?? 'start',
            whiteSpace: 'pre-wrap',
            height: '100%',
            width: '100%',
          }}>
          <span
            id={component.id}
            className={autoScale ? 'auto-scale' : ''}
            style={{
              userSelect: 'none',
              WebkitUserSelect: 'none',
              overflowWrap: 'anywhere',
              opacity: css.opacity,
              color: css.color || 'text.primary',
              lineHeight: '100%',
              fontWeight: css.fontWeight,
              fontStyle: css.fontStyle,
              fontFamily: css.fontFamily,
              textDecoration: css.textDecoration,
              ...(!autoScale && {
                fontSize: css.fontSize,
              }),
            }}>
            {assignedAttribute ? (
              <SheetAttributeControl
                readOnly
                enableLogic
                alwaysShowSign={textData.alwaysShowSign}
                attributeId={assignedAttribute.id}
                ignoreLabel
              />
            ) : editing ? (
              <textarea
                ref={editRef}
                style={{
                  width: component.width,
                  height: component.height,
                  resize: 'none',
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  color: 'inherit',
                  fontSize: 'inherit',
                  fontWeight: 'inherit',
                  fontFamily: 'inherit',
                  opacity: 'inherit',
                }}
                defaultValue={injectedText}
                onChange={(e) => updateTextValue(e.target.value)}
              />
            ) : (
              <>{injectedText}</>
            )}
          </span>
        </section>
      </Stack>
    </ResizableNodeWrapper>
  );
};

export const PrimitiveTextNode = ({ component }: { component: SheetComponent }) => {
  const css = JSON.parse(component.style);
  const textData = JSON.parse(component.data) as TextComponentData;
  const textValue = textData.value;
  const autoScale = textData.autoScale ?? false;
  return (
    <Stack
      width={`${component.width}px`}
      height={`${component.height}px`}
      alignItems='start'
      justifyContent='start'
      spacing={2}
      sx={{ overflow: 'visible', bgcolor: 'transparent', flexWrap: 'wrap' }}>
      <section
        className='sheet-text-container'
        style={{
          display: 'flex',
          alignItems: css.centerAlign ?? 'center',
          justifyContent: css.textAlign ?? 'start',
          whiteSpace: 'pre-wrap',
          height: '100%',
          width: '100%',
        }}>
        <span
          id={component.id}
          className={autoScale ? 'auto-scale' : ''}
          style={{
            userSelect: 'none',
            WebkitUserSelect: 'none',
            overflowWrap: 'anywhere',
            opacity: css.opacity,
            color: css.color || 'text.primary',
            lineHeight: '100%',
            fontWeight: css.fontWeight,
            fontStyle: css.fontStyle,
            fontFamily: css.fontFamily,
            textDecoration: css.textDecoration,
            ...(!autoScale && {
              fontSize: css.fontSize,
            }),
          }}>
          <>{textValue}</>
        </span>
      </section>
    </Stack>
  );
};
