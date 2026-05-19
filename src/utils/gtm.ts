import TagManager from "@sooro-io/react-gtm-module";

export function initializeGTM(gtmId: string): void {
  if (!gtmId) return;

  TagManager.initialize({ gtmId });
}

export function pushEvent(
  eventName: string,
  eventData: Record<string, any>,
): void {
  TagManager.dataLayer({
    dataLayer: {
      event: eventName,
      timestamp: new Date().toISOString(),
      ...eventData,
    },
  });
}
