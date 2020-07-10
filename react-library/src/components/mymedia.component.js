import React from 'react';

class Media extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        //console.log('MyMedia Render: '+this.props.media.title)
        let media = this.props.media;
        let media_type = media.director? 'movies': media.author ?'books':'videogames'
        return (
            <>
                <tr>
                    <td>{this.props.media.title}</td>
                    <td><button className='btn btn-primary'
                        onClick={this.props.handleRenew}
                        id={media_type+'_'+this.props.media._id}>
                            Renew</button></td>
                    <td><button className='btn btn-danger'
                        onClick={this.props.handleCheckIn}
                        id={media_type+'_'+this.props.media._id}>
                            Check In</button></td>
                </tr>
            </>
        )
    }
}

export default Media;