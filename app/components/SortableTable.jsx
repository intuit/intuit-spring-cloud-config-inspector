import React from "react";
import Sortable from 'sortablejs';

export default class SortableTable extends React.Component {

  sortableContainersDecorator = (componentBackingInstance) => {
    // check if backing instance not null
    if (componentBackingInstance) {
      let options = {
        handle: ".group-title" // Restricts sort start click/touch to the specified element
      };
      Sortable.create(componentBackingInstance, options);
    }
  };

  sortableGroupDecorator = (componentBackingInstance) => {
    // check if backing instance not null
    if (componentBackingInstance) {
      let options = {
        draggable: "div", // Specifies which items inside the element should be sortable
        group: "shared"
      };
      Sortable.create(componentBackingInstance, options);
    }
  };

  render() {
    return (
      <div className="container" ref={this.sortableContainersDecorator}>
        <div className="group">
          <h2 className="group-title">Group 1</h2>
          <div className="group-list" ref={this.sortableGroupDecorator}>
            <div>Swap them around</div>
            <div>Swap us around</div>
            <div>Swap things around</div>
            <div>Swap everything around</div>
          </div>
        </div>
        <div className="group">
          <h2 className="group-title">Group 2</h2>
          <div className="group-list" ref={this.sortableGroupDecorator}>
            <div>Swap them around</div>
            <div>Swap us around</div>
            <div>Swap things around</div>
            <div>Swap everything around</div>
          </div>
        </div>
      </div>
    );
  }
}
