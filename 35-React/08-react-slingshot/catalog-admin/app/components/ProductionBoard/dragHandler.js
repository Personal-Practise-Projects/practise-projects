import React from 'react';
// Import Component Specific Styling
export const DRAG_ELEMENT_TYPE = {
  DEFAULT: 'DEFAULT',
  ONLY_DROPPABLE: 'ONLY_DROPPABLE',
  ONLY_DRAGGABLE: 'ONLY_DRAGGABLE',
};
export default class ProductionBoardDragManager {
  constructor(onDraggedListener, shotDict) {
    this.onDraggedListener = onDraggedListener;
    this.shotDict = shotDict;
  }

  setShotDict(shotDict) {
    this.shotDict = shotDict;
  }

  preventDefaultAndStopPropagation = event => {
    event.preventDefault();
    event.stopPropagation();
  };

  enableShotDragging = (type, elements) => {
    const _this = this;
    switch (type) {
      case DRAG_ELEMENT_TYPE.ONLY_DROPPABLE:
        [].forEach.call(elements, item => {
          item.addEventListener('dragleave', _this.dragLeaveHandler);
          item.addEventListener('dragenter', _this.dragEnterHandler);
          item.addEventListener('dragover', _this.dragOverHandler);
          item.addEventListener('drop', _this.dropHandler);
          item.addEventListener('dragend', _this.dragEndHandler);
        });
        break;
      case DRAG_ELEMENT_TYPE.DEFAULT:
        [].forEach.call(elements, item => {
          item.addEventListener('drag', _this.dragHandler);
          item.addEventListener('dragstart', _this.dragStartHandler);
          item.addEventListener('dragenter', _this.dragEnterHandler);
          item.addEventListener('dragover', _this.dragOverHandler);
          item.addEventListener('dragleave', _this.dragLeaveHandler);
          item.addEventListener('drop', _this.dropHandler);
          item.addEventListener('dragend', _this.dragEndHandler);
        });
        break;
    }
  };

  disableShotDragging = elements => {
    const _this = this;
    [].forEach.call(elements, item => {
      item.removeEventListener('drag', _this.dragHandler);
      item.removeEventListener('dragstart', _this.dragStartHandler);
      item.removeEventListener('dragenter', _this.dragEnterHandler);
      item.removeEventListener('dragover', _this.dragOverHandler);
      item.removeEventListener('dragleave', _this.dragLeaveHandler);
      item.removeEventListener('drop', _this.dropHandler);
      item.removeEventListener('dragend', _this.dragEndHandler);
    });
  };

  dragHandler = event => {
    this.preventDefaultAndStopPropagation(event);
    return false;
  };

  dragStartHandler = event => {
    this.draggingNode = event.target;
    console.log(this.draggingNode);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', this.draggingNode);
    // event.dataTransfer.setDragImage(event.target, 40, 40);
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
      this.dropSurroundingArea(true, event.target);
    } else if (event.target.getAttribute('data-droppable') === 'child') {
      const node = event.target.parentNode;
      this.dropSurroundingArea(true, node);
    }
  };

  dragLeaveHandler = event => {
    this.preventDefaultAndStopPropagation(event);
    if (event.target.getAttribute('data-droppable') === 'true') {
      const node = event.target;
      this.dropSurroundingArea(false, node);
    } else if (event.target.getAttribute('data-droppable') === 'child') {
      const node = event.target.parentNode;
      this.dropSurroundingArea(false, node);
    }
  };

  dropHandler = event => {
    this.preventDefaultAndStopPropagation(event);

    if (
      event.target.getAttribute('data-droppable') === 'true' &&
      event.target !== this.draggingNode
    ) {
      const droppedOverNode = event.target;
      const droppedNode = this.draggingNode;
      this.insertNodeBetweenSwimlanes(droppedNode, droppedOverNode);
    } else if (event.target.getAttribute('data-droppable') === 'child') {
      const droppedOverNode = event.target.parentNode;
      const droppedNode = this.draggingNode;
      this.insertNodeBetweenSwimlanes(droppedNode, droppedOverNode);
    }
    return false;
  };

  dragEndHandler = event => {
    this.preventDefaultAndStopPropagation(event);

    [].forEach.call(
      document.querySelectorAll('.swimlane-content .shot-card'),
      item => {
        item.classList.remove('droppable-swimlane');
        item.classList.remove('droppable-swimlane-block');
      },
    );

    [].forEach.call(document.querySelectorAll('.swimlane-content'), item => {
      item.classList.remove('droppable-swimlane');
      item.classList.remove('droppable-swimlane-block');
    });
    // On drag ends set dragging element null
    this.draggingNode = null;
  };

  insertNodeBetweenSwimlanes = (droppedNode, droppedOverSwimlane) => {
    // If card in dropping in same swimlane ignore the event
    if (droppedNode.parentElement === droppedOverSwimlane) {
      return;
    }
    // Insert child at first position in swimlane
    const oldSwimlane = droppedNode.parentNode;
    this.insertCardInNonEmptySwimlane(droppedOverSwimlane, droppedNode);
    this.checkDroppedSwimlaneWasEmpty(droppedOverSwimlane);
    this.checkOldSwimlaneGetEmpty(oldSwimlane);
  };

  insertCardInNonEmptySwimlane(droppedOverSwimlane, droppedNode) {
    const toSwimlane = droppedOverSwimlane.dataset.swimlane;
    const acceptedSwimlane = droppedOverSwimlane.dataset.acceptedSwimlane;

    const fromSwimlane = droppedNode.parentElement.dataset.swimlane;
    if ((acceptedSwimlane || '').includes(fromSwimlane)) {
      const droppedShot = this.shotDict[droppedNode.dataset.cardIdent];
      const toStatus = droppedNode.parentElement.dataset.toStatus;
      this.onDraggedListener(droppedShot, toStatus, fromSwimlane, toSwimlane);
    }
  }

  checkDroppedSwimlaneWasEmpty = swimlane => {
    if (swimlane.children.length >= 1) {
      swimlane.lastChild.classList.remove('d-flex');
      swimlane.lastChild.classList.add('d-none');
    }
  };

  checkOldSwimlaneGetEmpty = swimlane => {
    /**
     * If old swimlane is having only one child which is empty view then make that empty view visible
     * as not child is present in this swimlane now
     */
    if (swimlane.children.length === 1) {
      swimlane.children[0].classList.remove('d-none');
      swimlane.children[0].classList.add('d-flex');
    }
  };

  dropSurroundingArea = (add, node) => {
    if (add) {
      if (node.dataset.acceptedSwimlane === '') {
        node.classList.add('droppable-swimlane-block');
      } else {
        node.classList.add('droppable-swimlane');
      }
    } else {
      node.classList.remove('droppable-swimlane');
      node.classList.remove('droppable-swimlane-block');
    }
  };
}
