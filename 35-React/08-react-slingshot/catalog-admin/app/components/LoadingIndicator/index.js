import React from 'react';

import Circle from './Circle';
import Wrapper from './Wrapper';

const LoadingIndicator = props => (
  <Wrapper {...props}>
    <Circle />
    <Circle rotate={30} delay={-1.1} {...props} />
    <Circle rotate={60} delay={-1} {...props} />
    <Circle rotate={90} delay={-0.9} {...props} />
    <Circle rotate={120} delay={-0.8} {...props} />
    <Circle rotate={150} delay={-0.7} {...props} />
    <Circle rotate={180} delay={-0.6} {...props} />
    <Circle rotate={210} delay={-0.5} {...props} />
    <Circle rotate={240} delay={-0.4} {...props} />
    <Circle rotate={270} delay={-0.3} {...props} />
    <Circle rotate={300} delay={-0.2} {...props} />
    <Circle rotate={330} delay={-0.1} {...props} />
  </Wrapper>
);

export default LoadingIndicator;
