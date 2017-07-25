import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import ReactDom from 'react-dom'

/*class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}*/

/*const App = React.createClass({
	getDefaultProps(){
		return {
			title: 'this is title',
			text: 'this is text'
		}
	},
	render(){
		const {title, text} = this.props;
		return (
			<button type="button" title={title}>
				<span>{text}</span>
			</button>
		)
	}
})*/

class Chlid extends Component{
	constructor(props){
		super(props);
		this.state ={
			props: props
		}
	}
	
	componentWillReceiveProps(nextProps){
		console.log(nextProps);
		
		if('title' in nextProps){
			this.setState({
				props: {
					title: nextProps.title
				}
			})
		}
			
		
	}
	
	render(){
		return (
			<div title={this.state.props.title}>
				Child
			</div>
			
		)
	}
}

	
class App extends Component{
	constructor(props){
		super(props);
		this.handelClick = this.handelClick.bind(this)
		
		this.state ={
			name: 'bingbing',
			age: 29,
			props: props
		}
		
	}
	
	static defaultProps = {
		title: 'this is title',
		text: 'this is text'
	}
	
	static propTypes = {
		title: React.PropTypes.string
	}
	
	
	componentWillMount(){
		 
	}

	componentDidMount(){
		 const dom = ReactDom.findDOMNode(this)
		 console.log(dom);
		
		
		
		//console.log(this.refs);
		
		/* console.log( this.refs.button )
		console.log( ReactDom.findDOMNode(this.refs.button) )
		
		console.log( this.refs.chlid )
		console.log( ReactDom.findDOMNode(this.refs.chlid) ) */
		
		//console.log( ReactDom.findDOMNode(this.refs.button) )
	}
	
	handelClick(agr, proxy, event){
		//e.preventDefault();
		//e.currentTarget.remove();
		
		console.log(proxy._targetInst)
		
		
		
	}

	/*componentWillReceiveProps(nextProps){
		return false
	}*/
	shouldComponentUpdate(nextProps, nextState){
		return true;
	};
	
	

	render(){
		const {title, text} = this.props;
		return (
			<div>
				<button ref="button" type="button" title={this.state.props.title} onClick={this.handelClick.bind(this,'abc')}>
					<span>{text}</span>
				</button>
				<span>{this.state.name}</span>
				<br/>
				<Chlid ref="chlid" title={this.state.props.title} />
			</div>
			
		)
	}
	
}


export default App;






















