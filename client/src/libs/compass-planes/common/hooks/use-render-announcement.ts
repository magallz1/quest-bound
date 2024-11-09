import { ComponentData, SheetComponent } from '@/libs/compass-api';
import { emitter } from '@/libs/compass-web-utils';
import { useEffect, useRef, useState } from 'react';
import { useEditorStore } from '../editor-store';

export const useRenderAnnouncement = (component?: SheetComponent) => {
  const { viewMode } = useEditorStore();
  if (!component) return { shouldRender: true };

  const data = JSON.parse(component.data) as ComponentData;
  const { announcementId } = data;

  const [shouldRender, setShouldRender] = useState(!(announcementId && viewMode));
  const subscribbedToAnnouncement = useRef(false);

  useEffect(() => {
    setShouldRender(!(announcementId && viewMode));
  }, [viewMode]);

  useEffect(() => {
    if (!announcementId || subscribbedToAnnouncement.current) return;
    emitter.on(`announcement:${announcementId}`, (msg: string) => {
      setShouldRender(true);
      setTimeout(() => {
        setShouldRender(false);
      }, 5000);
    });
    subscribbedToAnnouncement.current = true;
  }, [announcementId]);

  return {
    shouldRender,
  };
};
