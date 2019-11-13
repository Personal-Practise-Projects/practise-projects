import React, { Component } from 'react';

import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemState,
} from 'react-accessible-accordion';
import ItemsRepeat from '../ItemsRepeat';

import './CustomAccordion.scss';

export default class CustomAccordion extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      items,
      preExpanded,
      allowZeroExpanded,
      AccordianHeader,
      AccordianBody,
    } = this.props;
    return (
      <Accordion
        preExpanded={preExpanded}
        allowZeroExpanded={allowZeroExpanded}
      >
        <ItemsRepeat items={items}>
          {(item, index) => (
            <AccordionItem
              className="custom-accordion"
              uuid={index}
              key={index}
            >
              <AccordionItemHeading>
                <AccordionItemButton>
                  <AccordionItemState>
                    {state => <AccordianHeader item={item} state={state} allowBulk={this.props.allowBulk}/>}
                  </AccordionItemState>
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <AccordionItemState>
                  {state =>
                    state.expanded && (
                      <AccordianBody key={item.id} item={item} />
                    )
                  }
                </AccordionItemState>
              </AccordionItemPanel>
            </AccordionItem>
          )}
        </ItemsRepeat>
      </Accordion>
    );
  }
}
