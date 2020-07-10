import React from 'react'
import PropTypes from 'prop-types'

/** VideoGame class to handle videogame components. */
class VideoGame extends React.Component {

    /** Props are instantiated to create a controlled object. */
    PropTypes = {
        title: PropTypes.string.isRequired,
        genre: PropTypes.string.isRequired,
        developer: PropTypes.string.isRequired,
        rating: PropTypes.string.isRequired,
        platform: PropTypes.string.isRequired,
    }

    /** componentDidMount records when construction occurs. */
    componentDidMount() {
        console.log('Mounting Videogame')
    }

    /** componentDidUpdate records when update occurs. */
    componentDidUpdate() {
        console.log('Updating Videogame')
    }

    /** renders the videogame component.
     * @return {JSX} Returns an HTML template for videogames
     */
    render() {
        console.log('Videogame Render: '+this.props.videogame.title)
        return (
            <>
                <tr>
                    <td>{this.props.videogame.title}</td>
                    <td>{this.props.videogame.genre}</td>
                    <td>{this.props.videogame.developer}</td>
                    <td>{this.props.videogame.rating}</td>
                    <td>{this.props.videogame.platform}</td>
                </tr>
            </>
        )
    }
}

export default VideoGame;