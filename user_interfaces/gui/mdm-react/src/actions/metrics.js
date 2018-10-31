export const MACHINE_METRICS_RECEIVED = 'MACHINE_METRICS_RECEIVED';

export function machineMetricsReceived(eventBody) {
  return {
    type: MACHINE_METRICS_RECEIVED,
    payload: {
      eventBody,
    },
  };
}
