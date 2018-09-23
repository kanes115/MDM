import React from 'react';

import {EmptyState} from '../../../../components';

const ModelEmpty = () => (
  <EmptyState iconName="category">
    <div>System model is empty</div>
    <div>
      Use the button in bottom right corner to add elements
    </div>
  </EmptyState>
);

export default ModelEmpty;
