import React from 'react';
import ListItem from './ListItem.jsx';
import _ from 'lodash';

const List = (props) => (
  <div>
    <div className="yelp-list">
      {props.items.map((item, index) =>
      	<ListItem 
          startPoint={props.startPoint} 
          listkey={index} 
          handleClick={props.handleClick} 
          item={item}
          key={_.uniqueId()}
        />
      )}
    </div>
  </div>
);

export default List;
