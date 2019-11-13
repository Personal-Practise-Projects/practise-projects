import DragManger from '../../common/dragManager';
import './BundlingView.scss';
import { SCHEDULE_PAGE_TYPE } from '../../containers/SchedulePage/constants';

export default class BundlingDragManager extends DragManger {
  constructor(onDraggedListener, dataHandler) {
    super();
    this.onDraggedListener = onDraggedListener;
    this.dataHandler = dataHandler;
  }

  setShots(shots) {
    this.shots = shots;
  }

  enableShotDragging = () => {
    const shotCards = document.querySelectorAll(
      '.schedule-drawer-body .shot-card',
    );
    Array.from(shotCards).map(item => {
      item.addEventListener('drag', this.dragHandler);
      item.addEventListener('dragstart', this.dragStartHandler);
      item.addEventListener('dragenter', this.dragEnterHandler);
      item.addEventListener('dragover', this.dragOverHandler);
      item.addEventListener('dragleave', this.dragLeaveHandler);
      item.addEventListener('drop', this.dropHandler);
      item.addEventListener('dragend', this.dragEndHandler);
    });
  };

  dragStartHandler = event => {
    super.dragStartHandler(event);
    this.dataHandler.setDraggedShotInfo(
      event.target.id,
      SCHEDULE_PAGE_TYPE.BUNDLING,
    );
    return false;
  };

  dragOverHandler = event => {
    this.preventDefaultAndStopPropagation(event);
    event.dataTransfer.dropEffect = 'move';
    return false;
  };

  dragEnterHandler = event => {
    this.preventDefaultAndStopPropagation(event);
    if (event.target.getAttribute('data-droppable') === 'true') {
      event.target.classList.add('droppable-card');
    }
  };

  dragLeaveHandler = event => {
    this.preventDefaultAndStopPropagation(event);
    if (event.target.getAttribute('data-droppable') === 'true') {
      event.target.classList.remove('droppable-card');
    }
  };

  shotCardDragEnd = () => {
    const draggedShot = this.dataHandler.getDraggedShotDetail();
    if (
      draggedShot.source === SCHEDULE_PAGE_TYPE.BUNDLING &&
      draggedShot.destination === SCHEDULE_PAGE_TYPE.CALENDAR
    ) {
      this.onDraggedListener({}, draggedShot);
    }
    this.dataHandler.clearAll();
  };

  dropHandler = event => {
    this.preventDefaultAndStopPropagation(event);
    this.dataHandler.setDraggedShotDestination(SCHEDULE_PAGE_TYPE.BUNDLING);
    this.dataHandler.setDroppedOverShotId(event.target.id);

    const droppedShotDetail = this.dataHandler.getDraggedShotDetail();
    const droppedOverShot = this.dataHandler.getShot(
      this.dataHandler.getDroppedOverShotInfo().id,
      SCHEDULE_PAGE_TYPE.BUNDLING,
    );

    if (
      this.isDroppedAllowed(droppedShotDetail, droppedOverShot) &&
      event.target.getAttribute('data-droppable') === 'true'
    ) {
      this.insertNodeAtPosition(droppedShotDetail, droppedOverShot);
    }
    return false;
  };

  isDroppedAllowed = (droppedShotDetail, droppedOverShot) => {
    if (
      droppedShotDetail.source === SCHEDULE_PAGE_TYPE.BUNDLING &&
      droppedShotDetail.destination === SCHEDULE_PAGE_TYPE.BUNDLING &&
      droppedShotDetail.info.id !== droppedOverShot.id
    ) {
      return (
        droppedShotDetail.info.shot_info.status ===
        droppedOverShot.shot_info.status
      );
    }
    return true;
  };

  insertNodeAtPosition = (droppedShotDetail, droppedOverShot) => {
    const droppedShot = droppedShotDetail.info;
    const swappableCards = this.changeShotCardsPosition(
      droppedShot,
      droppedOverShot,
    );
    this.onDraggedListener(swappableCards, droppedShotDetail);
  };

  changeShotCardsPosition = (droppedShot, droppedOverShot) => {
    if (
      this.dataHandler.getDraggedShotDetail().source ===
      SCHEDULE_PAGE_TYPE.CALENDAR
    ) {
      return { insertBefore: droppedOverShot, toInsert: droppedShot };
    }
    if (droppedShot.order_rank < droppedOverShot.order_rank)
      return { insertBefore: droppedShot, toInsert: droppedOverShot };
    return { insertBefore: droppedOverShot, toInsert: droppedShot };
  };
}
