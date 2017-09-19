import React from 'react';
import io from 'socket.io-client';

const socket = io();

export default class ListItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      style: {
        'background-color': 'none',
      },
      clicks: [],
      state: 'none',
    };

    this.stateClick= this.stateClick.bind(this);
  }

  componentDidMount() {
    socket.on('result click', ({ key, value }) => {
      const colors = {
        'yes': 'lightgreen',
        'no': 'pink',
        'maybe': 'lightyellow',
      };
      if (this.props.listkey === key) {
        this.setState({
          style: { 'background-color': colors[value] },
        });
      }
    });
  }

  stateClick(e) {
    e.preventDefault();
    socket.emit('result click', { key: this.props.listkey, value: e.target.value });
  }

  render() {
    return (
    	<div className="yelp-list-entry-container" style={this.state.style} onClick={(e)=> this.props.handleClick(this.props.item)}>
  	    <div className="yelp-list-entry">
          <div className="media-left media-middle">
            <img className="listing-object" src={this.props.item.image_url} alt="" />
           </div>
          <div className="listing-body">
            <a href={`http://maps.google.com/?daddr=${this.props.item.name} ${this.props.item.location.address1} ${this.props.item.location.city}&saddr=${this.props.startPoint.lat || ''},${this.props.startPoint.lng || ''}`}>
  	          <div className="yelp-list-entry-name" >
                {this.props.listkey + 1 + '. ' + this.props.item.name}
              </div>
            </a>
            <div className="yelp-list-entry-rating">{this.props.item.rating}/5</div>
            <div className="yelp-list-entry-price">{this.props.item.price}</div>
          	<div className="yelp-list-entry-reviews">{this.props.item.review_count} Reviews</div>
          </div>
          <div className="yelp-list-entry-address">
            <div>
            	<div className="yelp-list-entry-address1">{this.props.item.location.address1}</div>
            	<div className="yelp-list-entry-city">{this.props.item.location.city + ', ' + this.props.item.location.zip_code}</div>
            	<div className="yelp-list-entry-phone">{this.props.item.phone}</div>
            </div>
            <div className="listItemBtns">
              <button
                className="listItemBtn"
                onClick={this.stateClick}
                value="yes"
              >
                Yes
              </button>
              <button
                className="listItemBtn"
                onClick={this.stateClick}
                value="no"
              >
                No
              </button>
              <button
                className="listItemBtn"
                onClick={this.stateClick}
                value="maybe"
              >
                Maybe
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
