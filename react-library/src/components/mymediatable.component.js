import React from 'react';
import Media from './mymedia.component';
import RenewService from '../services/renew.service';
import { connect } from 'react-redux';

class MyMediaTable extends React.Component {
    renewService = new RenewService();
    constructor(props) {
        console.log('Mounting: Constructor MediaTable')
        super(props);
    }

    handleCheckInMedia(event) {
        let media = event.target.id.split('_')[0]
        let id = event.target.id.split('_')[1]
        this.renewService.checkinMedia(id, media, this.props.user).then(
            res => {
                this.renewService.getMedia(this.props.user.username).then(res => {
                    this.setState( {media: res.data})
                })
            }
        )
    }
    handleRenewMedia(event) {
        let media = event.target.id.split('_')[0]
        let id = event.target.id.split('_')[1]
        this.renewService.renewMedia(id, media, this.props.user).then(
            res => {
                this.renewService.getMedia(this.props.user.username).then(res => {
                    this.setState( {media: res.data})
                })
            }
        )
    }

    render() {
        //console.log('render(): MediaTable')
        let media = this.props.media;
        return (
            <>
            <h1>{this.props.user ? this.props.user.username : 'Blank'}</h1>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Renew</th>
                            <th>Checkin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            media ?
                            media.map((media) => {
                                return <Media key={media._id} media={media}
                                handleCheckIn={(e)=>this.handleCheckInMedia(e)}
                                handleRenew={(e)=>this.handleRenewMedia(e)}
                                ></Media>
                            })
                            : <tr></tr>
                        }
                        
                    </tbody>
                </table>
            </>
        )
    }
}

function mapStateToProps(state) {
    const {user, media} = state;
    return {user: user, media: media}
}
export default connect(mapStateToProps)(MyMediaTable);