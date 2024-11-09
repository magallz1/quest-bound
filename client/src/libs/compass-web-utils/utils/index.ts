import { v4 } from 'uuid';

/**
 * Returns functions to log, warn or error in the console.
 *
 * Warns and errors will always print.
 *
 * Hide logs by setting a local storage variable `debug.log.<label.toLowerCase()>` to 'true'.
 *
 * Hide all logs by setting a local storage variable `debug.log.all` to 'true'.
 *
 * Hide logs for a specific label by setting a local storage variable `debug.log.<label.toLowerCase()>` to 'false'.
 */
export function debugLog(label: string, subLabel?: string) {
  const print = (type: 'log' | 'warn' | 'error') => {
    const debugAll = localStorage.getItem('debug.log.all') === 'true';
    const ignoreDebugScoped = localStorage.getItem(`debug.log.${label.toLowerCase()}`) === 'false';
    const debugScoped = localStorage.getItem(`debug.log.${label.toLowerCase()}`) === 'true';

    const msg = subLabel ? `[${label}][${subLabel}]: ` : `[${label}]: `;

    switch (type) {
      case 'log':
        return (...args: any[]) => {
          // Only hide messages for logs
          if ((debugAll && !ignoreDebugScoped) || (!debugAll && debugScoped)) {
            console.debug(msg, ...args);
          }
        };
      case 'warn':
        return (...args: any[]) => console.warn(msg, ...args);
      case 'error':
        return (...args: any[]) => console.error(msg, ...args);
    }
  };

  return {
    log: print('log'),
    warn: print('warn'),
    error: print('error'),
  };
}

const debug = debugLog('Utils');

/**
 * Returns a unique UUID with option context string attached
 */
export function generateId(context?: string): string {
  const id = v4();
  return context ? `${context}-${id}` : id;
}

/**
 * Returns Base64 image from image file.
 */
export const toBase64 = (file: File, stripMetaData?: boolean): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () =>
      resolve(
        stripMetaData
          ? reader.result?.toString().replace(/^data:(.*,)?/g, '') || ''
          : reader.result?.toString() || '',
      );
    reader.onerror = (error) => reject(error);
  });
};

interface isEventOriginatorProps {
  e: Event | React.MouseEvent | React.PointerEvent;
  /**
   * Propagates to all ancestors until an element with this ID is found.
   */
  targetId: string;
  /**
   * Stops propagation if an element with this ID is found.
   */
  blockPropagationKeys?: string[];
}

/**
 * Returns whether an event was originated by an element which includes target ID.
 *
 * Bubbles up until an element which includes the block ID is found.
 *
 * Provide either a partial className or full ID of an element.
 */
export const isEventOriginator = ({
  e,
  targetId,
  blockPropagationKeys,
}: isEventOriginatorProps) => {
  try {
    const elementIsTarget = (element: Element, targetId: string): boolean => {
      return element.id === targetId;
    };

    const elementIsBlocked = (element: Element, blockKeys: string[]): boolean => {
      let blocked = false;

      blockKeys.forEach((blockKey) => {
        if (element.className?.includes?.(blockKey)) blocked = true;
      });

      return blocked;
    };

    let found = false;
    let blocked = false;
    let element: Element | null = e.target as Element;

    while (!found && !blocked && !!element) {
      found = elementIsTarget(element, targetId);
      blocked = !!blockPropagationKeys?.length && elementIsBlocked(element, blockPropagationKeys);

      if (found || blocked) break;
      element = element.parentElement;
    }

    return found;
  } catch (e: any) {
    debug.log('Error in isEventOriginator: ', e.message);
    return false;
  }
};

/**
 * Rounds a value to the nearest target.
 */
export function roundTo(target: number, value: number, forceCeil = false) {
  const roundingFunc = value < 0 || forceCeil ? Math.ceil : Math.floor;

  return target * roundingFunc(value / target);
}

type Coordinates = {
  x: number;
  y: number;
};

/**
 * Returns if the delta between two given coordinates is less than or equal to a given threshold (defaults to 5px).
 */
export function isWithinThreshold(
  pointerDownLocation: Coordinates,
  pointerUpLocation: Coordinates,
  threshold = 5,
) {
  if (!pointerDownLocation) return false;

  const { x, y } = pointerDownLocation;

  if (Math.abs(pointerUpLocation.x - x) > threshold) return false;
  if (Math.abs(pointerUpLocation.y - y) > threshold) return false;
  return true;
}

/**
 * Returns if the given URL is valid.
 */
export function isValidUrl(url?: string | null): boolean {
  if (!url) return false;

  return url.slice(0, 4) === 'http';
}

export function stringIsNumber(value: string) {
  return /^-?[0-9]*$/.test(value);
}
