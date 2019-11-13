import DragManger from '../../common/dragManager';
import './CalendarView.scss';
import { SCHEDULE_PAGE_TYPE } from '../../containers/SchedulePage/constants';

export default class CalendarDragManager extends DragManger {
  constructor(onDraggedListener, dataHandler) {
    super();
    this.onDraggedListener = onDraggedListener;
    this.dataHandler = dataHandler;
  }

  setShots = shots => {
    this.shots = shots;
  };

  enableShotDragging = (shotCards, droppableSlots) => {
    this.shotCards = Array.from(shotCards || []);
    this.droppableSlots = Array.from(droppableSlots || []);

    this.shotCards.map(item => {
      item.addEventListener('drag', this.dragHandler);
      item.addEventListener('dragstart', this.dragStartHandler);
      item.addEventListener('dragleave', this.dragLeaveHandler);
      item.addEventListener('dragenter', this.dragEnterHandler);
      item.addEventListener('dragover', this.dragOverHandler);
      item.addEventListener('drop', this.dropHandler);
      item.addEventListener('dragend', this.dragEndHandler);
    });

    this.droppableSlots.map(item => {
      item.addEventListener('dragleave', this.dragLeaveHandler);
      item.addEventListener('dragenter', this.dragEnterHandler);
      item.addEventListener('dragover', this.dragOverHandler);
      item.addEventListener('drop', this.dropHandler);
      item.addEventListener('dragend', this.dragEndHandler);
    });
  };

  dragStartHandler = event => {
    super.dragStartHandler(event);
    this.dataHandler.setDraggedShotInfo(
      event.target.id,
      SCHEDULE_PAGE_TYPE.CALENDAR,
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
      event.target.classList.add('droppable-timeslot');
    }
  };

  dragLeaveHandler = event => {
    this.preventDefaultAndStopPropagation(event);
    if (event.target.getAttribute('data-droppable') === 'true') {
      event.target.classList.remove('droppable-timeslot');
    }
  };

  dropHandler = event => {
    this.preventDefaultAndStopPropagation(event);
    this.dataHandler.setDraggedShotDestination(SCHEDULE_PAGE_TYPE.CALENDAR);
    this.dataHandler.setDroppedOverShotId(event.target.id);
    if (event.target.getAttribute('data-droppable') === 'true') {
      this.insertNodeAtPosition(event.target);
    }
    return false;
  };

  insertNodeAtPosition = droppedOverNode => {
    this.isDropOverAnotherCard()
      ? this.handleDropOverCard(droppedOverNode)
      : this.handleDropOverSlot(droppedOverNode);
  };

  isDropOverAnotherCard = () =>
    this.dataHandler.getDroppedOverShotInfo().id !== '';

  handleDropOverCard = droppedOverNode => {
    if (
      this.dataHandler.getDraggedShotDetail().id !==
      this.dataHandler.getDroppedOverShotInfo().id
    ) {
      this.timeSlot = droppedOverNode.parentElement.dataset.hour;
      this.onDraggedListener(
        this.dataHandler.getDraggedShotDetail(),
        this.timeSlot,
      );
    }
  };

  handleDropOverSlot = droppedOverNode => {
    this.timeSlot = droppedOverNode.dataset.hour;
    this.onDraggedListener(
      this.dataHandler.getDraggedShotDetail(),
      this.timeSlot,
    );
  };

  shotCardDragEnd = () => {
    const draggedShot = this.dataHandler.getDraggedShotDetail();
    if (
      draggedShot.source === SCHEDULE_PAGE_TYPE.CALENDAR &&
      draggedShot.destination === SCHEDULE_PAGE_TYPE.BUNDLING
    ) {
      this.onDraggedListener(this.dataHandler.getDraggedShotDetail(), null);
    }
    this.dataHandler.clearAll();
  };
}
