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
        let millis = Date.parse(date);
        return moment(millis).tz("America/Los_Angeles").format("ddd, MMM Do, h:mm a")
    }

    populateListItems(){
        return this.props.list.items.map(item => {
            return (
                <ListItem 
                    key={item._id} 
                    itemID={item._id} 
                    content={item.content} 
                    datetime={this.formatTime(item.date)}
                    checked={item.checked}
                    fetchNewList={this.props.fetchNewList}
                />
            )
        })
    }

    renderList(){
        if(this.props.list){
            if(this.props.list.items.length == 0){
                return(
                    <div className={'emptyListPlaceholder'}>
                        No Items Found!
                    </div>
                )
            } else{
                return(
                    <div className="list">
                        {this.props.list ? this.populateListItems() : 'loading...'}
                    </div>
                );
            }
        }else{
            return null;
        }
    }

    render(){
        return (
            <div className={`listWrapper`}>
                <div className="title">
                    ourList
                </div>

                {this.renderList()}

                <div className="listFooter">
                    Footer
                </div>
            </div>
        );
    }
}

export default List;