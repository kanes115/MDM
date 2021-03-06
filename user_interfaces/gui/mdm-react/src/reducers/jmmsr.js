import _ from 'lodash';
import * as actionTypes from '../actions';
import * as deploymentActionTypes from '../actions/graph/deployment';
import * as metricsActionTypes from '../actions/metrics';

import { system } from '../utils/jmmsr/schema';

const initialState = {
  activeSystemId: '',
  downloadingSystem: true,
  fileLoader: {
    error: null,
    file: null,
    loading: false,
    progress: 0,
    valid: false,
    validating: false,
    validationError: null,
  },
  form: {
    formObject: null,
    formOpen: false,
    formType: '',
  },
  metricsPanel: {
    panelOpen: false,
  },
  stoppedSystemInfoOpen: false,
  systems: {},
};

const jmmsr = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.OPEN_FORM:
      return {
        ...state,
        form: {
          ...state.form,
          formObject: action.payload.object,
          formOpen: true,
          formType: action.payload.formType,
        },
      };
    case actionTypes.CLOSE_FORM:
      return {
        ...state,
        form: {
          ...state.form,
          formObject: null,
          formOpen: false,
          formType: '',
        },
      };

    case actionTypes.GET_ACTIVE_SYSTEM: {
      return {
        ...state,
        downloadingSystem: true,
      };
    }

    case actionTypes.ACTIVE_SYSTEM_RECEIVED: {
      const isUp = _.get(action, 'payload.isUp', false);
      const activeSystemId = _.get(action, 'payload.systemName');
      const activeSystem = _.get(action, 'payload.system', {});
      const collectedData = _.get(action, 'payload.collectedData', []);

      if (isUp) {
        const machines = _.get(action, 'payload.system.machines', []);
        const newMachines = machines.map((machine) => {
          const machineDataIndex = _.findIndex(
            collectedData,
            data => data.machine.id === machine.id,
          );

          return {
            ...machine,
            resources: {
              ...(_.get(collectedData, `${machineDataIndex}.machine.resources`, {})),
            },
          };
        });
        _.set(activeSystem, 'machines', newMachines);

        return {
          ...state,
          downloadingSystem: false,
          activeSystemId,
          form: {
            ...state.form,
            formObject: null,
            formOpen: false,
            formType: '',
          },
          systems: {
            ...state.systems,
            [activeSystemId]: activeSystem,
          },
        };
      }
      return {
        ...state,
        downloadingSystem: false,
      };
    }

    case actionTypes.CREATE_NEW_SYSTEM: {
      const newSystems = { ...state.systems };
      const createdSystem = _.cloneDeep(system);
      _.set(createdSystem, 'name', action.payload.systemId);
      _.set(newSystems, action.payload.systemId, createdSystem);

      return {
        ...state,
        activeSystemId: action.payload.systemId,
        form: {
          ...state.form,
          formObject: null,
          formOpen: false,
          formType: '',
        },
        systems: newSystems,
      };
    }

    case actionTypes.CREATE_NEW_SERVICE:
      return {
        ...state,
        form: {
          ...state.form,
          formObject: null,
          formOpen: false,
          formType: '',
        },
        systems: {
          ...state.systems,
          [state.activeSystemId]: {
            ...state.systems[state.activeSystemId],
            services: [
              ...state.systems[state.activeSystemId].services,
              _.cloneDeep(action.payload.service),
            ],
          },
        },
      };
    case actionTypes.CREATE_NEW_CONNECTION:
      return {
        ...state,
        form: {
          ...state.form,
          formObject: null,
          formOpen: false,
          formType: '',
        },
        systems: {
          ...state.systems,
          [state.activeSystemId]: {
            ...state.systems[state.activeSystemId],
            connections: [
              ...state.systems[state.activeSystemId].connections,
              _.cloneDeep(action.payload.connection),
            ],
          },
        },
      };
    case actionTypes.CREATE_NEW_MACHINE: {
      const newMachine = _.cloneDeep(_.get(action, 'payload.machine'));
      newMachine.id = (new Date()).getTime();

      return {
        ...state,
        form: {
          ...state.form,
          formObject: null,
          formOpen: false,
          formType: '',
        },
        systems: {
          ...state.systems,
          [state.activeSystemId]: {
            ...state.systems[state.activeSystemId],
            machines: [
              ...state.systems[state.activeSystemId].machines,
              newMachine,
            ],
          },
        },
      };
    }
    case actionTypes.UPDATE_SYSTEM_CONFIG:
      return {
        ...state,
        form: {
          ...state.form,
          formObject: null,
          formOpen: false,
          formType: '',
        },
        systems: {
          ...state.systems,
          [state.activeSystemId]: {
            ...state.systems[state.activeSystemId],
            config: {
              ...state.systems[state.activeSystemId].config,
              ...action.payload.config,
            },
          },
        },
      };
    case actionTypes.UPDATE_MACHINE: {
      const machines = [...state.systems[state.activeSystemId].machines];
      const updatedMachineId = _.get(action, 'payload.newMachine.id');
      const index = _.findIndex(machines, machine => machine.id === updatedMachineId);

      machines[index] = _.get(action, 'payload.newMachine');

      return {
        ...state,
        form: {
          ...state.form,
          formObject: null,
          formOpen: false,
          formType: '',
        },
        systems: {
          ...state.systems,
          [state.activeSystemId]: {
            ...state.systems[state.activeSystemId],
            machines,
          },
        },
      };
    }
    case actionTypes.UPDATE_SERVICE: {
      const services = [...state.systems[state.activeSystemId].services];
      const connections = [...state.systems[state.activeSystemId].connections];
      const newServiceName = _.get(action, 'payload.newService.name');
      const oldServiceName = _.get(action, 'payload.oldService.name');
      const index = _.findIndex(services, service => service.name === oldServiceName);

      services[index] = _.get(action, 'payload.newService');
      const newConnections = _.map(
        connections,
        (connection) => {
          const newConnection = { ...connection };
          if (newConnection.service_from === oldServiceName) {
            newConnection.service_from = newServiceName;
          }
          if (newConnection.service_to === oldServiceName) {
            newConnection.service_to = newServiceName;
          }
          return newConnection;
        },
      );

      return {
        ...state,
        form: {
          ...state.form,
          formObject: null,
          formOpen: false,
          formType: '',
        },
        systems: {
          ...state.systems,
          [state.activeSystemId]: {
            ...state.systems[state.activeSystemId],
            services,
            connections: newConnections,
          },
        },
      };
    }
    case actionTypes.UPDATE_CONNECTION: {
      const connections = [...state.systems[state.activeSystemId].connections];
      const newConnection = _.get(action, 'payload.newConnection');
      const oldConnection = _.get(action, 'payload.oldConnection');
      const index = _.findIndex(connections, con => _.isEqual(con, oldConnection));

      connections[index] = newConnection;

      return {
        ...state,
        form: {
          ...state.form,
          formObject: null,
          formOpen: false,
          formType: '',
        },
        systems: {
          ...state.systems,
          [state.activeSystemId]: {
            ...state.systems[state.activeSystemId],
            connections,
          },
        },
      };
    }

    case actionTypes.DELETE_MACHINE: {
      const deletedMachine = _.get(action, 'payload.machine');

      const activeSystem = { ...state.systems[state.activeSystemId] };
      const newMachines = [...activeSystem.machines];
      const newServices = [...activeSystem.services];

      const index = _.findIndex(newMachines, machine => _.isEqual(machine, deletedMachine));
      if (index !== -1) {
        newMachines.splice(index, 1);
        _.forEach(
          newServices,
          (service) => {
            const newAvailableMachines = _.filter(
              _.get(service, 'requirements.available_machines', []),
              availableMachine => availableMachine === _.get(deletedMachine, 'id'),
            );
            _.set(service, 'requirements.available_machines', newAvailableMachines);
          },
        );

        return {
          ...state,
          systems: {
            ...state.systems,
            [state.activeSystemId]: {
              ...state.systems[state.activeSystemId],
              machines: newMachines,
              services: newServices,
            },
          },
        };
      }
      return state;
    }

    case actionTypes.DELETE_SERVICE: {
      const deletedService = _.get(action, 'payload.service');
      const deletedServiceName = _.get(deletedService, 'name');

      const activeSystem = { ...state.systems[state.activeSystemId] };
      const newServices = [...activeSystem.services];

      const index = _.findIndex(
        newServices,
        service => _.isEqual(_.get(service, 'name'), deletedServiceName),
      );
      if (index !== -1) {
        newServices.splice(index, 1);
        const newConnections = _.filter(
          activeSystem.connections,
          connection => (
            (_.get(connection, 'service_from') !== deletedServiceName)
            && (_.get(connection, 'service_to') !== deletedServiceName)
          ),
        );

        return {
          ...state,
          systems: {
            ...state.systems,
            [state.activeSystemId]: {
              ...state.systems[state.activeSystemId],
              services: newServices,
              connections: newConnections,
            },
          },
        };
      }
      return state;
    }

    case actionTypes.DELETE_CONNECTION: {
      const deletedConnection = _.get(action, 'payload.connection');

      const activeSystem = { ...state.systems[state.activeSystemId] };
      const newConnections = [...activeSystem.connections];

      const index = _.findIndex(
        newConnections,
        connection => _.isEqual(connection, deletedConnection),
      );
      if (index !== -1) {
        newConnections.splice(index, 1);

        return {
          ...state,
          systems: {
            ...state.systems,
            [state.activeSystemId]: {
              ...state.systems[state.activeSystemId],
              connections: newConnections,
            },
          },
        };
      }
      return state;
    }

    case deploymentActionTypes.SYSTEM_DATA_COLLECTED: {
      const { activeSystemId } = state;
      const machines = _.get(state, `systems.${activeSystemId}.machines`);
      const { payload: { collectedData } } = action;

      const newMachines = machines.map(machine => ({
        ...machine,
        resources: {
          ...(_.get(collectedData, `${machine.id}.resources`)),
        },
      }));
      console.log('!!!', newMachines)

      return {
        ...state,
        systems: {
          ...state.systems,
          [activeSystemId]: {
            ...state.systems[activeSystemId],
            machines: newMachines,
          },
        },
      };
    }

    case actionTypes.START_FILE_PROCESSING: {
      return {
        ...state,
        fileLoader: {
          ...state.fileLoader,
          error: null,
          file: null,
          loading: true,
          progress: 0,
          valid: false,
          validating: false,
          validationError: null,
        },
      };
    }
    case actionTypes.FILE_PROCESSING_PROGRESS: {
      const event = _.get(action, 'payload.progressEvent');
      const lengthComputable = _.get(event, 'lengthComputable', false);
      const loaded = _.get(event, 'loaded', 0);
      const total = _.get(event, 'total', 0);

      if (lengthComputable) {
        return {
          ...state,
          fileLoader: {
            ...state.fileLoader,
            progress: loaded / total,
          },
        };
      }

      return state;
    }
    case actionTypes.FILE_PROCESSING_SUCCESS: {
      const event = _.get(action, 'payload.successEvent');
      const result = _.get(event, 'target.result', '');
      const file = JSON.parse(result);

      return {
        ...state,
        fileLoader: {
          ...state.fileLoader,
          error: null,
          file,
          loading: false,
          progress: 1,
          validating: true,
        },
      };
    }
    case actionTypes.FILE_PROCESSING_ERROR: {
      const event = _.get(action, 'payload.errorEvent');

      return {
        ...state,
        fileLoader: {
          ...state.fileLoader,
          error: event,
          file: null,
          loading: false,
          progress: 1,
        },
      };
    }

    case actionTypes.SYSTEM_CHECK_SUCCESS: {
      const body = _.get(action, 'payload.body');
      const file = _.get(state, 'fileLoader.file');
      const valid = _.get(body, 'is_ok', false);

      if (valid) {
        return {
          ...state,
          systems: {
            ...state.systems,
            [state.activeSystemId]: file,
          },
          fileLoader: {
            ...state.fileLoader,
            valid,
            validating: false,
            validationError: null,
          },
        };
      }
      return {
        ...state,
        fileLoader: {
          ...state.fileLoader,
          valid,
          validating: false,
          validationError: body,
        },
      };
    }

    case metricsActionTypes.MACHINE_METRICS_RECEIVED: {
      const systemId = state.activeSystemId;
      const activeSystem = state.systems[systemId];
      const machines = _.get(action, 'payload.eventBody.machines', []);

      if (systemId && activeSystem) {
        return {
          ...state,
          systems: {
            ...state.systems,
            [systemId]: {
              ...activeSystem,
              live_metrics: {
                ...state.systems[systemId].live_metrics,
                machines,
              },
            },
          },
        };
      }
      return state;
    }

    case metricsActionTypes.SERVICE_METRICS_RECEIVED: {
      const systemId = state.activeSystemId;
      const activeSystem = state.systems[systemId];
      const services = _.get(action, 'payload.eventBody.services', []);

      if (systemId && activeSystem) {
        return {
          ...state,
          systems: {
            ...state.systems,
            [systemId]: {
              ...activeSystem,
              live_metrics: {
                ...state.systems[systemId].live_metrics,
                services,
              },
            },
          },
        };
      }
      return state;
    }

    case metricsActionTypes.SERVICE_DOWN_RECEIVED: {
      const systemId = state.activeSystemId;
      const activeSystem = state.systems[systemId];
      const serviceName = _.get(action, 'payload.eventBody.service_name');
      const exitStatus = _.get(action, 'payload.eventBody.exit_status', null);

      const services = [..._.get(state, `systems.${systemId}.live_metrics.services`, [])];
      const downServiceIndex = _.findIndex(
        services,
        service => service.service_name === serviceName,
      );

      if (downServiceIndex !== -1) {
        _.set(services, `${downServiceIndex}.is_down`, true);
        if (exitStatus !== null) {
          _.set(services, `${downServiceIndex}.exit_status`, exitStatus);
        }
      }

      if (systemId && activeSystem) {
        return {
          ...state,
          systems: {
            ...state.systems,
            [systemId]: {
              ...activeSystem,
              live_metrics: {
                ...state.systems[systemId].live_metrics,
                services,
              },
            },
          },
        };
      }
      return state;
    }

    case actionTypes.OPEN_METRICS_PANEL: {
      return {
        ...state,
        metricsPanel: {
          ...state.metricsPanel,
          panelOpen: true,
          panelType: '',
        },
      };
    }

    case actionTypes.CLOSE_METRICS_PANEL: {
      return {
        ...state,
        metricsPanel: {
          ...state.metricsPanel,
          panelOpen: false,
          panelType: '',
        },
      };
    }

    case actionTypes.CLEAR_MODEL: {
      const clearedSystem = _.cloneDeep(system);
      const systemName = _.get(state, `systems.${state.activeSystemId}.name`, 'default');
      _.set(clearedSystem, 'name', systemName);

      return {
        ...state,
        systems: {
          ...state.systems,
          [state.activeSystemId]: clearedSystem,
        },
      };
    }

    case deploymentActionTypes.SYSTEM_DEPLOYMENT_SUCCESS: {
      const decision = _.get(action, 'payload.body.decision', []);
      const services = _.get(state, `systems.${state.activeSystemId}.services`, []);
      const serviceToMachine = _.reduce(
        decision,
        (accumulator, decisionObject) => {
          accumulator[decisionObject.service] = decisionObject.machine;
          return accumulator;
        },
        {},
      );

      const newServices = _.map(
        services,
        service => ({
          ...service,
          requirements: {
            ...(_.get(service, 'requirements', {})),
            available_machines: [serviceToMachine[service.name]],
          },
        }),
      );

      return {
        ...state,
        systems: {
          ...state.systems,
          [state.activeSystemId]: {
            ...state.systems[state.activeSystemId],
            services: newServices,
          },
        },
      };
    }

    case deploymentActionTypes.SYSTEM_STOPPED: {
      const stoppedServices = _.get(action, 'payload.body.stopped_services', []);
      const machineLiveMetrics = _.get(state, `systems.${state.activeSystemId}.live_metrics.machines`, []);

      const newMachineMetrics = machineLiveMetrics.map((machineMetrics) => ({
        ...machineMetrics,
        is_down: true,
      }));
      const newServiceMetrics = stoppedServices.map(stoppedService => ({
        ...stoppedService,
        is_down: true,
      }));

      return {
        ...state,
        stoppedSystemInfoOpen: true,
        systems: {
          ...state.systems,
          [state.activeSystemId]: {
            ...state.systems[state.activeSystemId],
            live_metrics: {
              ...state.systems[state.activeSystemId].live_metrics,
              machines: newMachineMetrics,
              services: newServiceMetrics,
            },
          },
        },
      };
    }

    case actionTypes.CLOSE_STOPPED_SYSTEM_INFO: {
      return {
        ...state,
        stoppedSystemInfoOpen: false,
      };
    }

    default:
      return state;
  }
};

export default jmmsr;
