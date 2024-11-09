import { AttributeContext, CheckboxComponentData, SheetComponent } from '@/libs/compass-api';
import { SheetAttributeControl } from '@/libs/compass-core-composites';
import { Image } from '@chakra-ui/react';
import {
  CheckBox,
  CheckBoxOutlineBlank,
  RadioButtonChecked,
  RadioButtonUnchecked,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import { useNodeId } from 'reactflow';
import ResizableNodeWrapper from '../../common/components/resizable-node-wrapper';
import { useEditorStore } from '../editor-store';
import { useNodeSize } from '../hooks';
import { getBorderStyles } from '../utils';

export const CheckboxNode = () => {
  const getComponent = useEditorStore((state) => state.getComponent);
  const viewMode = useEditorStore((state) => state.viewMode);

  const id = useNodeId();

  const component = getComponent(id);

  if (!component) return null;

  if (!viewMode) {
    return <EditCheckboxNode />;
  }

  return (
    <ResizableNodeWrapper component={component}>
      <ViewCheckboxNode />
    </ResizableNodeWrapper>
  );
};

export const PrimitiveCheckboxNode = ({ component }: { component: SheetComponent }) => {
  const data = JSON.parse(component.data) as CheckboxComponentData;
  const css = JSON.parse(component.style);

  const checked = data.value === 'true';

  const height = `${component.height}px`;
  const width = `${component.width}px`;

  const DefaultCheckedIcon = data.type === 'checkbox' ? CheckBox : RadioButtonChecked;
  const DefaultUncheckedIcon =
    data.type === 'checkbox' ? CheckBoxOutlineBlank : RadioButtonUnchecked;

  return (
    <Image
      id={`component-${component.id}`}
      src={checked ? data.imageIfChecked : data.imageIfUnchecked}
      objectFit={'contain'}
      sx={{
        height,
        width,
        backgroundColor: 'rgba(255,255,255,0)',
        opacity: css.opacity,
        ...getBorderStyles(css),
      }}
      fallback={
        checked ? (
          <DefaultCheckedIcon
            sx={{
              color: css.color,
              opacity: css.opacity,
              width,
              height: 'unset',
              ...getBorderStyles(css),
            }}
          />
        ) : (
          <DefaultUncheckedIcon
            sx={{
              color: css.color,
              opacity: css.opacity,
              width,
              height: 'unset',
              ...getBorderStyles(css),
            }}
          />
        )
      }
    />
  );
};

const EditCheckboxNode = () => {
  const { getComponent } = useEditorStore();
  const component = getComponent(useNodeId());
  const { height, width } = useNodeSize(component?.id ?? '');

  if (!component) return null;

  return (
    <ResizableNodeWrapper component={component}>
      <PrimitiveCheckboxNode
        component={{ ...component, height: parseFloat(height), width: parseFloat(width) }}
      />
    </ResizableNodeWrapper>
  );
};

const ViewCheckboxNode = () => {
  const { updateComponent } = useEditorStore();
  const { getComponent, sheetId } = useEditorStore();
  const component = getComponent(useNodeId());
  const { height, width } = useNodeSize(component?.id ?? '');
  const attributeContext = useContext(AttributeContext);

  if (!component) return null;

  const { data: rawData, style } = component;
  const data = JSON.parse(rawData) as CheckboxComponentData;
  const css = JSON.parse(style);

  const checked = data.value === 'true';

  const getAttribute = attributeContext?.getAttribute;

  const assignedAttribute = getAttribute?.(data.attributeId);

  const DefaultCheckedIcon = data.type === 'checkbox' ? CheckBox : RadioButtonChecked;
  const DefaultUncheckedIcon =
    data.type === 'checkbox' ? CheckBoxOutlineBlank : RadioButtonUnchecked;

  const src = checked ? data.imageIfChecked : data.imageIfUnchecked;

  const onChange = (value: string) => {
    updateComponent({
      sheetId,
      update: {
        id: component.id,
        data: JSON.stringify({
          ...data,
          value,
        }),
      },
    });
  };

  return assignedAttribute ? (
    <SheetAttributeControl
      enableLogic
      attributeId={assignedAttribute.id}
      ignoreLabel
      checkboxProps={{
        src: assignedAttribute.value === 'true' ? data.imageIfChecked : data.imageIfUnchecked,
        defaultCheckedIcon: (
          <DefaultCheckedIcon
            sx={{
              color: css.color,
              height: 'unset',
              width,
              ...getBorderStyles(css),
            }}
          />
        ),
        defaultUncheckedIcon: (
          <DefaultUncheckedIcon
            sx={{
              color: css.color,
              height: 'unset',
              width,
              ...getBorderStyles(css),
            }}
          />
        ),
        style: {
          height: 'unset',
          width,
          opacity: css.opacity,
          ...getBorderStyles(css),
        },
      }}
    />
  ) : (
    <motion.div
      key={checked.toString()}
      className='clickable'
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      onClick={() => {
        onChange(`${!checked}`);
      }}
      transition={{ duration: 0.25, type: 'spring' }}>
      <Image
        className='clickable'
        src={src}
        sx={{
          bgcolor: 'rgba(255,255,255,0)',
          height,
          width,
          opacity: css.opacity,
          ...getBorderStyles(css),
        }}
        fallback={
          checked ? (
            <DefaultCheckedIcon
              className='clickable'
              sx={{
                color: css.color,
                opacity: css.opacity,
                width,
                height: 'unset',
                ...getBorderStyles(css),
              }}
            />
          ) : (
            <DefaultUncheckedIcon
              className='clickable'
              sx={{
                color: css.color,
                opacity: css.opacity,
                width,
                height: 'unset',
                ...getBorderStyles(css),
              }}
            />
          )
        }
      />
    </motion.div>
  );
};
