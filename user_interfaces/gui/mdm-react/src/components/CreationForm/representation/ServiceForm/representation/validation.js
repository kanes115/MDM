import _ from 'lodash';

export default function validateServiceName(serviceNames, originalName) {
  return name => (
    _.includes(serviceNames, name) && name !== originalName
      ? 'Service name must be unique'
      : null
  );
}
