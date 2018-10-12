import _ from 'lodash';

export default function validateServiceName(serviceNames) {
  return name => (
    _.includes(serviceNames, name)
      ? 'Service name must be unique'
      : null
  );
}
