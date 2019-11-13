export default class DragManager {
  /**
   * Drag event handler for bundling and calendar view
   */

  dragHandler = event => {
    this.preventDefaultAndStopPropagation(event);
    return false;
  };

  dragStartHandler(event) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', event.target);
    event.dataTransfer.setDragImage(event.target, 40, 40);
    return false;
  }

  dragEndHandler = event => {
    const shotCards = Array.from(document.querySelectorAll('.shot-card'));
    const droppableSlots = Array.from(document.querySelectorAll('.timeslot'));

    droppableSlots.map(item => {
      item.classList.remove('droppable-card', 'droppable-timeslot');
    });
    shotCards.map(item => {
      item.classList.remove('droppable-card');
    });

    this.preventDefaultAndStopPropagation(event);
    this.shotCardDragEnd();
  };

  /** */

  // prevent default event bubbling and default browser behaviour
  preventDefaultAndStopPropagation = event => {
    event.preventDefault();
    event.stopPropagation();
  };
}
