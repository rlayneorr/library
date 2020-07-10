import React from 'react'

class Book extends React.Component {

    componentDidMount() {
        console.log('Mounting Book')
    }

    componentDidUpdate() {
        console.log('Updating Book')
    }

    render() {
        console.log('Book Render: '+this.props.book.title)
        return (
            <>
                <tr>
                    <td>{this.props.book.title}</td>
                    <td>{this.props.book.author}</td>
                </tr>
            </>
        )
    }
}

export default Book;