import {
  PdfComponentData,
  RulebookDocumentPage,
  useRuleset,
  Viewport,
  viewportDimensions,
} from '@/libs/compass-api';
import { useDeviceSize } from '@/libs/compass-core-ui';
import { Box, Stack, Text } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNodeId } from 'reactflow';
import ResizableNodeWrapper from '../components/resizable-node-wrapper';
import { useEditorStore } from '../editor-store';
import { useNodeSize, useSubscribeComponentChanges } from '../hooks';
import { getBorderStyles } from '../utils';

export const PdfNode = () => {
  const { rulesetId } = useParams();
  const { details } = useRuleset(rulesetId);
  const { tablet, mobile } = useDeviceSize();

  const getComponent = useEditorStore((state) => state.getComponent);

  const id = useNodeId();

  const component = getComponent(id);

  const key = useSubscribeComponentChanges(id);

  const { height, width } = useNodeSize(component?.id);
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);

  const [containerWidth, setContainerWidth] = useState<number>(component?.width ?? 0);

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, {}, onResize);

  if (!component) return null;

  const css = JSON.parse(component.style);
  const data = JSON.parse(component.data) as PdfComponentData;

  const { autoScale } = data;
  const viewport = mobile ? Viewport.MOBILE : tablet ? Viewport.TABLET : Viewport.DESKTOP;

  const { documentFileId } = details;

  const pageNumber = data.pageNumber;

  const maxWidth = 1000;
  const autoWidth = viewportDimensions[viewport].width;

  return (
    <ResizableNodeWrapper component={component} key={key}>
      <Box
        sx={{
          ...css,
          height: autoScale ? viewportDimensions[viewport].height : height,
          width: autoScale ? viewportDimensions[viewport].width : width,
          overflow: 'hidden',
          fontStyle: css.fontStyle,
          ...getBorderStyles(css),
        }}>
        {!documentFileId ? (
          <Stack height='100%' width='100%' justifyContent='center' alignItems='center'>
            <Text textAlign='center'>
              Assign a document to the rulebook from the documents page
            </Text>
          </Stack>
        ) : (
          <div
            ref={setContainerRef}
            style={{
              height: autoScale ? viewportDimensions[viewport].height : height,
              width: autoScale ? viewportDimensions[viewport].width : width,
            }}>
            <RulebookDocumentPage
              pageNumber={pageNumber}
              width={
                autoScale
                  ? autoWidth
                  : containerWidth
                    ? Math.min(containerWidth, maxWidth)
                    : maxWidth
              }
            />
          </div>
        )}
      </Box>
    </ResizableNodeWrapper>
  );
};

function useResizeObserver(
  element: Element | null,
  options: ResizeObserverOptions | undefined,
  observerCallback: ResizeObserverCallback,
): void {
  useEffect(() => {
    if (!element || !('ResizeObserver' in window)) {
      return undefined;
    }

    const observer = new ResizeObserver(observerCallback);

    observer.observe(element, options);

    return () => {
      observer.disconnect();
    };
  }, [element, options, observerCallback]);
}
