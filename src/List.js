import React from 'react';
import './App.css'

const List = ({ list, onRemoveItem }) =>
  list.map(item => (
    <Item
      key={item.objectID}
      item={item}
      onRemoveItem={onRemoveItem}
    />
  ));

const Item = ({ item, onRemoveItem }) => (
  <div className="item">
    <span style={{ width: '40%'}}>
      <a href={item.url}>{item.title}</a>
    </span>
    <span style={{ width: '30%'}}>{item.author}</span>
    <span style={{ width: '10%'}}>{item.num_comments}</span>
    <span style={{ width: '10%'}}>{item.points}</span>
    <span style={{ width: '10%'}}>
      <button type="button" onClick={() => onRemoveItem(item)} className="button buttonSmall">
        Dismiss
      </button>
    </span>
  </div>
);

export default List;
