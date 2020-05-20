import React from 'react';
import {formatTime} from '../../utils/utils';
import './Print.scss';

class Print extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            list: null
        }
    }

    updateList(){
        fetch(`/api/list`)
          .then(response => response.json())
          .then(list => {
            this.setState({list})
            console.log('fetched list: ', list)
          })
          .catch(err => {
            console.log(err);
          })
    }
    
    componentDidMount() {
        this.updateList();
    }

    render(){
        if(!this.state.list) return (<div>loading...</div>);
        if(this.state.list.items.length == 0) return(<div>No items found</div>)

        let categoryMap = {};
        for(let item of this.state.list.items){
            if(item.category in categoryMap){
                categoryMap[item.category].push(item);
            } else{
                categoryMap[item.category] = [item];
            }
        }

        let formatList = () => {
            return Object.keys(categoryMap).map(category => {
                return(
                    <div key={category} className="categoryWrapper">
                    <div className="categoryTitle">{category}</div>
                        <div className="categoryContent">
                            {categoryMap[category].map(item => {
                                return (<div key={item._id}>-{item.content}</div>)
                            })}
                        </div>
                    </div>
                )
            });
        }

        return(
            <div className="printWrapper">
                <div className="listTitle">   
                    Shopping List: <span className="dateTime">{formatTime(new Date(Date.now()))}</span>
                </div>
                <div className="printDataWrapper">
                    {formatList()}
                </div>
            </div>
        )
    }
}

export default Print;