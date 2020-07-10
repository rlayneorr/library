import React, { Component } from 'react';
import VideoGameService from '../services/videogame.service';
import { connect } from 'react-redux';

class VideogameForm extends Component {
    videogameService = new VideoGameService();
    constructor(props) {
        super(props);
        this.handleFieldChange = this.handleFieldChange.bind(this);
        console.log('Mounting: Constructor')
    }
    handleFieldChange(event) {
        let media = {}
        if (this.props.media) {
            media = Object.assign({}, this.props.media);
        }
        media[event.target.name]= event.target.value;
        this.props.dispatch( {type: 'handleFieldChange', media: media});
    }
    addVideogame() {
        console.log('Submit the form');
        console.log(this.props.media)
        const videogame = Object.assign({}, this.props.media);
        console.log(videogame)
        this.videogameService.addVideoGame(videogame).then( () => {
            this.props.dispatch(
                { type:'addVideoGame',
                  media: { title: '', developer: '', platform: '', rating: '', genre: '' }
                });
        });

    }
    render() {
        const FIELDS = ['title', 'developer', 'platform', 'rating', 'genre'];
        return (
            <>
                <div className='container border'>
                    <h1>Add a videogame to the library</h1>
                        {
                            FIELDS.map((name) => {
                                return (
                                    <div key={name}>
                                        <label htmlFor={'vg_' + name}>{name}</label>
                                        <input type='text' className='form-control' name={name}
                                            id={'vg_' + name} value={this.props.media[name]}
                                            onChange={(e) => this.handleFieldChange(e)} />
                                    </div>
                                )
                            })
                        }
                        <button className='btn btn-primary'
                            onClick={() => this.addVideogame()} >Submit</button>
                </div>
            </>
        );
    }
}

function mapStateToProps(state) {
    const {addVideoGame} = state
    return {media: addVideoGame}
}

export default connect(mapStateToProps)(VideogameForm);