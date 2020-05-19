import React from 'react';
import moment from 'moment-timezone';
import ListItem from '../ListItem/ListItem';
import './List.css';

moment().tz("America/Los_Angeles").format();

class List extends React.Component{
    constructor(props){
        super(props);
    }

    formatTime(date){
        console.log(date);
        let millis = Date.parse(date);
        return moment(millis).tz("America/Los_Angeles").format("ddd, MMM Do, h:mm a")
    }

    populateListItems(){
        return this.props.list.items.map(item => {
            console.log(item);
            return (
                <ListItem key={item._id} content={item.content} datetime={this.formatTime(item.date)}/>
            )
        })
    }

    render(){
        return (
            <div className="listWrapper">
                <div className="title">
                    ourList
                </div>

                <div className="list">
                    {this.props.list ? this.populateListItems() : 'loading...'}
                </div>

                <div className="listFooter">
                    Footer
                </div>
            </div>
        );
    }
}

export default List;