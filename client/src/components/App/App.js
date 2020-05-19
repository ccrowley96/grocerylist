import React from 'react';
import List from '../List/List'
import './App.css';

class App extends React.Component {
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
        console.log(list);
        this.setState({list})
      })
      .catch(err => {
        console.log(err);
      })
  }

  componentDidMount() {
    this.updateList();
  }

  render(){
    return(
      <div className = "appWrapper">
        <List list={this.state.list}/>
      </div>
    )
  }
}

export default App;
