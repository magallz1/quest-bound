import { useEffect } from 'react';

interface UseMouseListenerProps {
  disabled?: boolean;
  onMouseUp?: (e: MouseEvent) => void;
  onMouseMove?: (e: MouseEvent) => void;
  onMouseDown?: (e: MouseEvent) => void;
  onPointerDown?: (e: MouseEvent) => void;
  onPointerUp?: (e: PointerEvent) => void;
  onPointerMove?: (e: MouseEvent) => void;
  onMouseWheel?: (e: WheelEvent) => void;
  onContextMenu?: (e: MouseEvent) => void;
}

export const useMouseListeners = ({
  disabled,
  onMouseUp,
  onMouseMove,
  onMouseDown,
  onPointerDown,
  onPointerUp,
  onPointerMove,
  onMouseWheel,
  onContextMenu,
}: UseMouseListenerProps) => {
  /**
   * This hook can't hold state! It will cause all sorts of render problems.
   *
   * If you need to react to mouse coords, follow pattern in planes use-mouse-position.ts
   * Update coordinates as refs, the provide getters to access them.
   */

  useEffect(() => {
    const mouseUpListener = (e: MouseEvent) => {
      if (!disabled) onMouseUp?.(e);
    };

    const mouseDownListener = (e: MouseEvent) => {
      if (!disabled) onMouseDown?.(e);
    };

    const mouseWheelListener = (e: WheelEvent) => {
      if (!disabled) onMouseWheel?.(e);
    };

    const mouseMoveListener = (e: MouseEvent) => {
      if (!disabled) onMouseMove?.(e);
    };

    const contextMenuListener = (e: MouseEvent) => {
      if (!disabled) onContextMenu?.(e);
    };

    document.addEventListener('mousedown', mouseDownListener);
    document.addEventListener('mouseup', mouseUpListener);
    document.addEventListener('mousemove', mouseMoveListener);

    const onPointerUpEvent = (e: PointerEvent) => {
      onPointerUp?.(e);
    };

    if (onPointerUp) document.addEventListener('pointerup', onPointerUpEvent);

    if (onPointerDown) document.addEventListener('pointerdown', onPointerDown);

    if (onPointerMove) document.addEventListener('pointermove', onPointerMove);

    if (onMouseWheel) document.addEventListener('wheel', mouseWheelListener);

    if (onContextMenu) document.addEventListener('contextmenu', contextMenuListener);

    return () => {
      document.removeEventListener('mousedown', mouseDownListener);
      document.removeEventListener('mouseup', mouseUpListener);
      document.removeEventListener('mousemove', mouseMoveListener);

      if (onPointerDown) document.removeEventListener('pointerdown', onPointerDown);

      if (onPointerUp) document.removeEventListener('pointerup', onPointerUpEvent);

      if (onPointerMove) document.removeEventListener('pointermove', onPointerMove);

      if (onMouseWheel) document.removeEventListener('wheel', mouseWheelListener);

      if (onContextMenu) document.removeEventListener('contextmenu', contextMenuListener);
    };
  }, [onMouseUp, onMouseMove, onMouseWheel, disabled]);
};
