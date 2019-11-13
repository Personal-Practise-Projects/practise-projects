import React, { Component } from 'react';
import TalentCard from './TalentCard';

const TalentGrid = (props) => {
  const { talents } = props;
  const classname = props.className ? props.className : '';
  return (
    <main className={`talent-grid ${classname}`}>
      <div className="wrapper">
        {talents.actor_info.map(
          (talent, index) => (
            <TalentCard featureReference={props.featureReference} talent={talent} key={index}/>
          ),
        )}
      </div>
    </main>
  );
};

export default TalentGrid;

