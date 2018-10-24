import _ from 'lodash';

const requiredProperties = [
  'services',
  'machines',
  'connections',
  'config',
];

function verifyProperties(properties) {
  return _.filter(
    requiredProperties,
    requiredProperty => _.includes(properties, requiredProperty),
  );
}

function verifyProperty(value, verifier) {

}

export default function (jmmsr) {
  const properties = Object.keys(jmmsr);
  const missingProperties = verifyProperties(properties);

  if (_.isEmpty(missingProperties)) {
    return {
      error: true,
      reason: 'missing properties',
      payload: {
        missingProperties,
      },
    };
  }


}
