import React from 'react'
import { Link } from 'react-router'

export default class About extends React.Component {
	render() {
		console.log('About props',this.props);
		return(
			<div>
				<h2>About</h2>
				<Link to="/about/123">123</Link>
				{this.props.children}
			</div>
		)
	}
}
