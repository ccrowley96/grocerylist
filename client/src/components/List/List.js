import React from 'react';
import moment from 'moment-timezone';
import ListItem from '../ListItem/ListItem';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import AddModal from '../AddModal/AddModal';
import isMobile from 'ismobilejs';
import './List.scss';

moment().tz("America/Los_Angeles").format();

class List extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            confirmOpen: false,
            addOpen: false
        };
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
            <div className={`listWrapper${isMobile().any ? ' mobile' : ''}`}>
                <div className="title">
                    ourList
                </div>

                {this.renderList()}

                <ConfirmModal 
                    open={this.state.confirmOpen} 
                    triggerClose={() => this.setState({confirmOpen: false})}
                    confirm={() => {
                        this.clearList();
                        this.setState({confirmOpen: false});
                    }}
                />

                {this.state.addOpen ? 
                    <AddModal
                        triggerClose={() => this.setState({addOpen: false})}
                        addItem={(item) => this.addItem(item)}
                    /> : null
                }

                

                <div className="listFooter">
                    <div className="footerDiv">
                        <button onClick={() => this.setState({confirmOpen: true})} className="clearList">Clear List</button>
                    </div>
                    <div className="footerDiv">
                        <button onClick={() => this.setState({addOpen: true})} className="addItem">Add Item</button>
                    </div>
                </div>
            </div>
        );
    }

    async addItem(item){
        console.log('trying to add item: ', item);
        await fetch('/api/list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        });

        this.setState({addOpen: false});

        this.props.fetchNewList();
    }

    async clearList(){
        await fetch('/api/list', {method: 'DELETE'});
        //Update list
        this.props.fetchNewList();
    }
}

export default List;