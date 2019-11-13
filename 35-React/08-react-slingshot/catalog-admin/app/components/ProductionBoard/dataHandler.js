import { SWIMLANE_META_INFO } from '../../common/constants';

export default class ProductionBoardDataHandler {
  constructor(props) {
    this.props = props;
  }

  getSwimlaneMetaInfoUrl = () => {
    const { extraInfo } = this.props;
    return `${SWIMLANE_META_INFO}${extraInfo.stage}`;
  };
}
