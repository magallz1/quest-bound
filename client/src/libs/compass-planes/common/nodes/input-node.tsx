import { AttributeContext, InputComponentData, SheetComponent } from '@/libs/compass-api';
import { SheetAttributeControl } from '@/libs/compass-core-composites';
import {
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';
import debounce from 'lodash.debounce';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useNodeId } from 'reactflow';
import { CSSProperties } from 'styled-components';
import ResizableNodeWrapper from '../../common/components/resizable-node-wrapper';
import { useEditorStore } from '../editor-store';
import { useNodeSize, useSubscribeComponentChanges } from '../hooks';
import { getBorderStyles } from '../utils';

export const InputNode = () => {
  const getComponent = useEditorStore((state) => state.getComponent);
  const viewMode = useEditorStore((state) => state.viewMode);
  const sheetId = useEditorStore((state) => state.sheetId);
  const updateComponent = useEditorStore((state) => state.updateComponent);

  const nodeId = useNodeId();
  const component = getComponent(nodeId);

  const { height, width } = useNodeSize(component?.id);

  const key = useSubscribeComponentChanges(nodeId);

  const _data = JSON.parse(component?.data ?? '{}') as InputComponentData;
  const _style = JSON.parse(component?.style ?? '{}') as CSSProperties;

  const [css, setCss] = useState<CSSProperties>(_style);
  const [data, setData] = useState<InputComponentData>(_data);

  const { getAttribute } = useContext(AttributeContext);

  const placeholderAttribute = getAttribute(data.attributeId);

  const assignedAttribute = getAttribute(data.attributeId);
  const inputType = assignedAttribute?.type?.toLowerCase() ?? data.type;

  const initialValue = inputType === 'number' ? '0' : '';
  const value = assignedAttribute?.value ?? data.value ?? initialValue;

  const [tempValue, setTempValue] = useState(value);

  useEffect(() => {
    if (value !== tempValue) setTempValue(value);
  }, [value]);

  // Don't render the entire component on key change, as it would cause the input to lose focus.
  useEffect(() => {
    const component = getComponent(nodeId);
    const style = JSON.parse(component?.style ?? '{}') as CSSProperties;
    const data = JSON.parse(component?.data ?? '{}') as InputComponentData;

    setCss(style);
    setData(data);
  }, [key]);

  const debouncedUpdate = useMemo(
    () =>
      debounce((value: string) => {
        updateComponent({
          sheetId,
          update: {
            id: component?.id ?? '',
            data: JSON.stringify({ ...data, value }),
          },
        });
      }, 500),
    [],
  );

  const handleChange = (value: string) => {
    setTempValue(value);
    debouncedUpdate(value);
  };

  const placeholder =
    placeholderAttribute?.name ??
    (data.value || (data.type === 'text' ? 'Text Input' : 'Number Input'));

  const style: CSSProperties = {
    pointerEvents: viewMode ? undefined : 'none',
    ...css,
    ...getBorderStyles(css),
    height,
    width,
  };

  if (!component) return null;

  return (
    <ResizableNodeWrapper component={component} className='input-node'>
      {assignedAttribute ? (
        <SheetAttributeControl
          enableLogic
          viewMode={viewMode}
          attributeId={assignedAttribute.id}
          hideWheel={data.hideWheel}
          ignoreLabel
          style={style}
        />
      ) : data.type === 'number' && !data.hideWheel ? (
        <NumberInput value={tempValue} onChange={(value) => handleChange(value)}>
          <NumberInputField sx={style} placeholder={placeholder} />

          <NumberInputStepper style={{ pointerEvents: viewMode ? undefined : 'none' }}>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      ) : (
        <Input
          placeholder={placeholder}
          type={data.type === 'number' ? 'number' : 'text'}
          value={tempValue}
          style={{
            ...style,
            paddingLeft: '10px',
            paddingRight: '10px',
          }}
          onChange={(e) => handleChange(e.target.value)}
        />
      )}
    </ResizableNodeWrapper>
  );
};

export const PrimitiveInputNode = ({ component }: { component: SheetComponent }) => {
  const data = JSON.parse(component.data) as InputComponentData;
  const css = JSON.parse(component.style);

  return (
    <Input
      value={data.value}
      onChange={() => {}}
      style={{
        ...css,
        ...getBorderStyles(css),
        height: component.height,
        width: component.width,
        pointerEvents: 'none',
        paddingLeft: '10px',
        paddingRight: '10px',
      }}
    />
  );
};
