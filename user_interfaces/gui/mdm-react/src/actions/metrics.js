export const MACHINE_METRICS_RECEIVED = 'MACHINE_METRICS_RECEIVED';

export function machineMetricsReceived(eventBody) {
  return {
    type: MACHINE_METRICS_RECEIVED,
    payload: {
      eventBody,
    },
  };
}

export const SERVICE_METRICS_RECEIVED = 'SERVICE_METRICS_RECEIVED';

export function serviceMetricsReceived(eventBody) {
  return {
    type: SERVICE_METRICS_RECEIVED,
    payload: {
      eventBody,
    },
  };
}
