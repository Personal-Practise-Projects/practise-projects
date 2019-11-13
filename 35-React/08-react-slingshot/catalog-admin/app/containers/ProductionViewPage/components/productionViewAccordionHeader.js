import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import AnchorTag from '../../../form-components/AnchorTag';
import VerticalSeparator from '../../../components/VerticalSeparator';
import ItemsRepeat from '../../../components/ItemsRepeat';
import Img from '../../../components/Img';
import CopyToClipboard from '../../../components/CopyToClipboard';
import SelectItem from '../../../components/SelectItem';
import Carat from '../../../components/Carat';
import errorPlaceHolder from '../../../images/common/default_profile_thumbnail.svg';
import { StringHelper } from '../../../helpers/utils';
import { referenceImagesParser } from '../parser';
import { AvatarInfo } from '../../../components/AvatarInfo';
import { parseCategory } from '../../../helpers/shotHelpers';
import { getBrandRedirectionPath } from '../../../helpers/url';
import { getFirstLetterCapitalizedWithoutUnderscore } from '../../../helpers/common';

import {
  GLOBAL_EVENT_TYPE,
  PRODUCTION_BOARD_STATE,
} from '../../../common/constants';
import { isPhotoshootDone } from '../helper';

class ProductionViewAccordionHeader extends React.Component {
  render() {
    const { item, state } = { ...this.props };
    const shotData = item;
    const status = state;
    const { owner } = shotData.shot_info;
    const CONTENT_LIMIT = 3;
    const assigneeData = {
      profileImage: owner && owner.profile_picture_thumbnail.small,
      fieldTitle: status.expanded && 'Assignee',
      userName: status.expanded && owner && owner.name,
      title: !status.expanded && owner && owner.name,
    };

    const shotNumberLink = {
      title: shotData.shot_info.shot_number,
      link: StringHelper.format(
        'shots?q=##&shotId=##',
        shotData.content_request,
        shotData.id,
      ),
    };
    const photoshootDone =
      !status.expanded && isPhotoshootDone(this.props.shot.shot_info.status);

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        className={classNames('custom-accordion-header', {
          expanded: status.expanded,
          'grow-on-hover': !status.expanded,
          'photoshoot-done': photoshootDone,
        })}
        onClick={this.scrollView}
      >
        <div className="left-children">
          {this.props.allowBulk && (
            <SelectItem
              header={{ type: GLOBAL_EVENT_TYPE.SHOT }}
              item={item}
              isDisabled={item.disabled}
              parent={PRODUCTION_BOARD_STATE.SPRINT}
            />
          )}
          <div className="text-group">
            <AnchorTag
              className="heading"
              targetBlank
              message={getBrandRedirectionPath(shotData.brand)}
            />
            <div className="meta-info">
              <AnchorTag className="link-text" message={shotNumberLink} />
              <CopyToClipboard value={shotNumberLink.title} />
              <VerticalSeparator />
              <span className="category-text">
                {parseCategory(shotData.shot_info.category).title}
              </span>
              {!status.expanded && shotData.camera_angle && (
                <div className="camera-angle">
                  <VerticalSeparator />
                  <i className="icon icon-camera" />
                  <span
                    className="category-text"
                    title={`Camera Angle: ${getFirstLetterCapitalizedWithoutUnderscore(
                      shotData.camera_angle,
                    )}`}
                  >
                    {getFirstLetterCapitalizedWithoutUnderscore(
                      shotData.camera_angle,
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
          {!status.expanded && (
            <React.Fragment>
              <div className="reference-images">
                <ItemsRepeat
                  items={referenceImagesParser(shotData.image_references)}
                >
                  {(referenceItem, index) => (
                    <div
                      className="reference-image"
                      key={index}
                      title={referenceItem.text}
                    >
                      <Img
                        src={referenceItem.url}
                        alt="Reference Image"
                        errSrc={errorPlaceHolder}
                        className="image"
                      />
                    </div>
                  )}
                </ItemsRepeat>
              </div>
              {owner && <VerticalSeparator />}
            </React.Fragment>
          )}
        </div>
        <div className="right-children">
          {!status.expanded && (
            <div className="pills">
              <ItemsRepeat items={shotData.product_list} limit={CONTENT_LIMIT}>
                {/* eslint-disable-next-line no-shadow */}
                {(item, index) => (
                  <div className="pill" key={index} title={item.name}>
                    {item.name}
                  </div>
                )}
              </ItemsRepeat>
              {shotData.product_list.length > 3 && (
                <div className="pill more">
                  {StringHelper.format(
                    '+##',
                    shotData.product_list.length - CONTENT_LIMIT,
                  )}
                </div>
              )}
            </div>
          )}
          {owner && (
            <AvatarInfo message={assigneeData} className="assignee-wrapper" />
          )}
        </div>
        <Carat
          size="12px"
          color={shotData.color_tag}
          className="color-tag position-absolute position"
          radius="2px"
        />
      </div>
    );
  }

  // function for when the user clicks on the tab
  scrollView = event => {
    const { target } = event;
    window.setTimeout(() => target.scrollIntoView(), 0);
  };
}

PropTypes.ProductionViewAccordionHeader = {
  shot: PropTypes.object,
  allowBulk: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => ({
  shot: state.productionView.shotsDict[ownProps.item.id],
});

export default connect(mapStateToProps)(ProductionViewAccordionHeader);
