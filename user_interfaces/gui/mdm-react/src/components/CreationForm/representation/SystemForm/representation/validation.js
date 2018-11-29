import _ from 'lodash';

export default function validateSystemName(systemName) {
  return _.get(systemName, 'length', 0) === 0 ? 'System name must not be empty' : null;
}
