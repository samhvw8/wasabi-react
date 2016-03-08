import React from 'react'
import { Link } from 'react-router'

export default class About extends React.Component {
	render() {
		return(
			<div>
				<h2>DASHBOARD</h2>
				{this.props.children}
			</div>
		)
	}
}
