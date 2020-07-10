import React from 'react'
import PropTypes from 'prop-types'

/** Movie class to handle movie components. */
class Movie extends React.Component {

    /** Props are instantiated to create a controlled object. */
    PropTypes = {
        title: PropTypes.string.isRequired,
        genre: PropTypes.string.isRequired,
        director: PropTypes.string.isRequired,
        rating: PropTypes.string.isRequired,
        length: PropTypes.number.isRequired,
    }

    /** componentDidMount records when construction occurs. */
    componentDidMount() {
        console.log('Mounting Movie')
    }

    /** componentDidUpdate records when update occurs. */
    componentDidUpdate() {
        console.log('Updating Movie')
    }

    /** renders the videogame component.
     * @return {JSX} Returns an HTML template for videogames
     */
    render() {
        console.log('Movie Render: '+this.props.movie.title)
        return (
            <>
                <tr>
                    <td>{this.props.movie.title}</td>
                    <td>{this.props.movie.genre}</td>
                    <td>{this.props.movie.director}</td>
                    <td>{this.props.movie.rating}</td>
                    <td>{this.props.movie.length}</td>
                </tr>
            </>
        )
    }
}

export default Movie;