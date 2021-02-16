import React from 'react';
import './App.css'
import { sortBy } from 'lodash';

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENT: list => sortBy(list, 'num_comments'),
  POINT: list => sortBy(list, 'points')
};



//List Component
const List = ({ list, onRemoveItem }) => {

  const [sort, setSort] = React.useState({
    sortKey: 'NONE',
    isReverse: false
  });

 

  const handleSort = sortKey => {
    const isReverse = sort.sortKey === sortKey && !sort.isReverse;
    setSort({sortKey, isReverse});
  }

  const sortFunction = SORTS[sort.sortKey];
  const sortedList = sort.isReverse
  ? sortFunction(list).reverse()
  : sortFunction(list);




  {/* List Element Structure */}

  return (
    <div>
      <div style={{ display: 'flex'}}>
        <span style={{ width: '40%'}}>
          <button type="button" onClick={() => handleSort('TITLE')} className="button">
            Title
          </button>
        </span>
        <span style={{ width: '30%'}}>
          <button type="button" onClick={() => handleSort('AUTHOR')} className="button">
            Author
          </button>
        </span>
        <span style={{ width: '10%'}}>
          <button type="button" onClick={() => handleSort('COMMENT')} className="button">
            Comments
          </button>
        </span>
        <span style={{ width: '10%'}}>
          <button type="button" onClick={() => handleSort('POINT')} className="button">
            Points
          </button>
        </span>
        <span style={{ width: '10%'}}>Actions</span>
      </div>
    
      {/* Get item element for every entry in sortedList */}
      {sortedList.map(item => (
        <Item
          key={item.objectID}
          item={item}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </div>
  );
}



{/**Item Element Structure */}

const Item = ({ item, onRemoveItem }) => (
  <div style={{ display: 'flex' }} className="item">
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
