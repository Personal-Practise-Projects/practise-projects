import styled from 'styled-components';

const Wrapper = styled.div`
  margin: ${props => props.margin || '2em auto'};
  width: ${props => props.width || '40px'};
  height: ${props => props.height || '40px'};
  position: relative;
`;

export default Wrapper;
