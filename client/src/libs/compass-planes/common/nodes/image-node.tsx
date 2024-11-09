import {
  ArchetypeContext,
  AttributeContext,
  ImageComponentData,
  SheetComponent,
  useCharacter,
} from '@/libs/compass-api';
import { isValidUrl } from '@/libs/compass-web-utils';
import { Image as ImageIcon } from '@mui/icons-material';
import { CSSProperties, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNodeId } from 'reactflow';
import ResizableNodeWrapper from '../../common/components/resizable-node-wrapper';
import { useEditorStore } from '../editor-store';
import { useNodeSize, useSubscribeComponentChanges } from '../hooks';
import { getBorderStyles } from '../utils';

export const ImageNode = () => {
  const getComponent = useEditorStore((state) => state.getComponent);

  const { streamedCharacter } = useContext(AttributeContext);
  const id = useNodeId();
  const component = getComponent(id);
  const key = useSubscribeComponentChanges(id);

  const { characterId } = useParams();
  const { character: _character } = useCharacter(characterId);
  const character = streamedCharacter || _character;

  const attributeContext = useContext(AttributeContext);
  const archetypeContext = useContext(ArchetypeContext);

  const { height, width } = useNodeSize(component?.id ?? '');

  const _data = JSON.parse(component?.data ?? '{}') as ImageComponentData;
  const style = JSON.parse(component?.style ?? '{}') as CSSProperties;

  const [css, setCss] = useState<CSSProperties>(style);
  const [data, setData] = useState<ImageComponentData>(_data);

  // Don't set the imageURL on every style change. Doing so causes the image to flicker.
  useEffect(() => {
    const component = getComponent(id);
    const style = JSON.parse(component?.style ?? '{}') as CSSProperties;
    const data = JSON.parse(component?.data ?? '{}') as ImageComponentData;

    setCss(style);
    setData(data);
  }, [key]);

  const getAttribute = attributeContext?.getAttribute;
  const assignedAttribute = getAttribute?.(data.attributeId);

  const attributeValueIsUrl = isValidUrl(assignedAttribute?.value);

  if (!component) return null;

  const entityImageSrc = archetypeContext?.archetype?.image?.src ?? character?.image?.src;
  const componentImageSrcs = component.images?.map((image) => image.src) || [];

  const imageSrc = data.useEntityImage
    ? entityImageSrc
    : attributeValueIsUrl
      ? assignedAttribute?.value
      : componentImageSrcs[0];

  return (
    <ResizableNodeWrapper component={component}>
      <PrimitiveImageNode
        css={css}
        component={{ ...component, height: parseFloat(height), width: parseFloat(width) }}
        imageUrl={imageSrc}
      />
    </ResizableNodeWrapper>
  );
};

export const PrimitiveImageNode = ({
  component,
  imageUrl,
  css,
}: {
  component: SheetComponent;
  imageUrl?: string | null;
  css?: CSSProperties;
}) => {
  const _css = JSON.parse(component.style) as CSSProperties;
  const data = JSON.parse(component.data) as ImageComponentData;

  const styles = (css ?? _css) as any;

  const imageSrc = imageUrl ?? data.url;

  const backgroundColor = !!imageSrc ? 'rgba(255,255,255, 0)' : '#42403D';
  const height = `${component.height}px`;
  const width = `${component.width}px`;

  const getBackgroundPosition = (align: string) => {
    switch (align) {
      case 'start':
        return 'top';
      case 'center':
        return 'center';
      case 'end':
        return 'bottom';
      default:
        return 'center';
    }
  };

  return (
    <div
      style={{
        height,
        width,
        ...css,
        ...getBorderStyles(styles),
        backgroundColor,
        backgroundImage: `url(${imageSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: getBackgroundPosition(styles.centerAlign),
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      aria-label={data.alt}
      key={`${imageSrc}-${data.url}`}>
      {!imageSrc && <ImageIcon />}
    </div>
  );
};
