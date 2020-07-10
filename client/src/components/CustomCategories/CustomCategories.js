import React from 'react';
import {groceryCategories} from '../../utils/utils';
import './CustomCategories.scss';

class CustomCategories extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <div className ="customCategoriesWrapper">
                <h3>Categories</h3>
                {this.props.categories.map(cat => {
                    return(
                        <div key={cat}>{cat}</div>
                    )
                })}
            </div>
        )
    }
}

export default CustomCategories;