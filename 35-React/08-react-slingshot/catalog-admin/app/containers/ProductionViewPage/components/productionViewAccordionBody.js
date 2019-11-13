import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import {
  customParser,
  referenceImagesParser,
  setupParser,
  shotDataParser,
  talentParser,
} from '../parser';
import ComponentRenderFactory from '../../../components/ComponentFactory';
import ProductionViewController from '../controller';
import { DETAILS_VIEW_EVENT } from '../../../components/ShotDetailsView/constants';
import { getShotColorFromStatus } from '../../../helpers/common';
import { closeContentWidget, openContentWidget } from '../../BasePage/actions';
import { largeSlideConfig, smallSlideConfig } from '../config';
import Slider from '../../../components/Slider';
import Notes from './Notes';
import ItemsRepeat from '../../../components/ItemsRepeat';
import { TitledDescriptionIcon } from '../../../components/Slider/Slides/TitledDescriptionIcon';
import { ImageWithText } from '../../../components/Slider/Slides/ImageWithText';
import { fetchComments, updateShots } from '../actions';
import CommentHistory from '../../../components/CommentSection/CommentHistory';
import { REFRESH } from '../../../common/constants';
import { isPhotoshootDone } from '../helper';

class ProductionViewAccordionBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      shotDetails: shotDataParser(this.props.shot),
    };
    this.dataHandler = new ProductionViewController(
      props,
      this.props.shot,
      this.eventListener,
    );
    this.parsedImageReferences = referenceImagesParser(
      this.props.shot.image_references,
    );
    this.parsedPropList = customParser(this.props.shot.prop_list);
    this.shotSetup = setupParser(this.props.shot);
    this.parsedProductList = customParser(this.props.shot.product_list);
    this.mappedTalent = talentParser(this.props.shot.mapped_talent);

    this.props.fetchComments(this.props.shot.id);
    this.props.shot.commentController.getData(this.setComments);
  }

  static getDerivedStateFromProps(nextProps) {
    return {
      shotDetails: shotDataParser(nextProps.shot),
    };
  }

  render() {
    const photoshootDone = isPhotoshootDone(this.props.shot.shot_info.status);
    return (
      <div
        className={classNames('custom-accordion-body', {
          'photoshoot-done': photoshootDone,
        })}
      >
        <div className="left-children">
          {this.parsedImageReferences.length !== 0 && (
            <Slider
              title="References"
              noOfSlides={2}
              slidesData={this.parsedImageReferences}
              outerClass="reference-images"
              {...largeSlideConfig}
            />
          )}
          {this.parsedPropList.length !== 0 && (
            <Slider
              title="Props"
              slidesData={this.parsedPropList}
              noOfSlides={5}
              {...smallSlideConfig}
            />
          )}
          <div className="setup">
            <h1>Setup</h1>
            <div className="field-container">
              <ItemsRepeat items={this.shotSetup}>
                {(item, index) => (
                  <TitledDescriptionIcon
                    key={index}
                    slide={item}
                    dataHandler={this.dataHandler}
                  />
                )}
              </ItemsRepeat>
            </div>
          </div>
        </div>
        <div className="right-children">
          <div className="header">
            <div className="header-left">
              <h1 className="heading">Details</h1>
              <div className="wrapper">
                {this.state.shotDetails.dueDate && (
                  <div className="due-date" title="Due Date">
                    <i className="icon icon-calendar" />
                    <div className="text">{this.state.shotDetails.dueDate}</div>
                  </div>
                )}
                <span
                  className={`status ${getShotColorFromStatus(
                    this.state.shotDetails.shotStatusValue,
                  )}`}
                >
                  {this.state.shotDetails.shotStatusTitle}
                </span>
              </div>
            </div>
            <div className="header-right">
              {this.props.headers &&
                this.props.headers.map((header, index) =>
                  ComponentRenderFactory.component(
                    header,
                    index,
                    this.dataHandler,
                  ),
                )}
            </div>
          </div>
          <div className="body">
            {this.state.shotDetails.shotNotes && (
              <Notes
                title="Shot Notes"
                description={this.state.shotDetails.shotNotes}
              />
            )}
            {this.state.shotDetails.propNotes && (
              <Notes
                title="Prop Notes"
                description={this.state.shotDetails.propNotes}
              />
            )}
            {this.state.shotDetails.productStyling && (
              <Notes
                title="Product Styling"
                description={this.state.shotDetails.productStyling}
              />
            )}
            {this.parsedProductList.length !== 0 && (
              <div className="product-list">
                <h1 className="heading">Products</h1>
                <div className="list">
                  <ItemsRepeat items={this.parsedProductList}>
                    {(item, index) => (
                      <div className="item" key={index}>
                        <ImageWithText slide={item} {...smallSlideConfig} />
                      </div>
                    )}
                  </ItemsRepeat>
                </div>
              </div>
            )}
            {this.state.shotDetails.talentNotes && (
              <Notes
                title="Talent Notes"
                description={this.state.shotDetails.talentNotes}
              />
            )}
            {this.mappedTalent.length ? (
              <div className="talent-wrapper">
                <h1>Talent</h1>
                <ItemsRepeat items={this.mappedTalent}>
                  {(item, index) =>
                    item[Object.keys(item)[0]].length !== 0 && (
                      <Slider
                        key={index}
                        title={Object.keys(item)[0]}
                        slidesData={item[Object.keys(item)[0]]}
                        noOfSlides={1}
                        {...smallSlideConfig}
                      />
                    )
                  }
                </ItemsRepeat>
              </div>
            ) : (
              ''
            )}
            {this.state.shotDetails.apparelNotes && (
              <Notes
                title="Model Apparel, Hair Style, Nails Notes"
                description={this.state.shotDetails.apparelNotes}
              />
            )}
            {this.state.shotDetails.locationName && (
              <Notes
                title="Location"
                description={this.state.shotDetails.locationName}
              />
            )}
            {this.state.shotDetails.locationNotes && (
              <Notes
                title="Location Notes"
                description={this.state.shotDetails.locationNotes}
              />
            )}
            {this.state.comments.length > 0 && (
              <div className="comments-wrapper">
                <h2 className="heading">Comments</h2>
                <CommentHistory
                  dataHandler={this.props.shot.commentController}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  setComments = comments => {
    this.setState({
      comments,
    });
  };

  eventListener = args => {
    switch (args.event) {
      case DETAILS_VIEW_EVENT.OPEN_IMAGE_WIDGET:
        this.props.openContentWidget(args.uploadWidget);
        this.setState({});
        break;
      case DETAILS_VIEW_EVENT.CLOSE_IMAGE_WIDGET:
        this.props.closeContentWidget();
        this.setState({});
        break;
      case REFRESH:
        this.setState({});
        break;
      default:
        break;
    }
  };
}

ProductionViewAccordionBody.propTypes = {
  item: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  headers: state.common.shot.productionView,
  shot: state.productionView.shotsDict[ownProps.item.id],
});

const mapDispatchToProps = {
  openContentWidget,
  closeContentWidget,
  fetchComments,
  updateShots,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductionViewAccordionBody);
