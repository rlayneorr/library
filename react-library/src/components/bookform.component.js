import React, { Component } from 'react';
import { connect } from 'react-redux';
import BookService from '../services/book.service';

class BookForm extends Component {

    bookService = new BookService();
    
    constructor(props) {
        super(props);
        this.handleBookFieldChange = this.handleBookFieldChange.bind(this);
        this.addBook = this.addBook.bind(this);
        console.log('Mounting: Constructor')
    }

    handleBookFieldChange(event) {
        let book = Object.assign({}, this.props.book);
        book[event.target.name] = event.target.value;
        this.props.dispatch({type: 'handleBookFieldChange', book: book})
    }
    addBook(e) {
        e.preventDefault()
        console.log('addBook prior bookService')
        this.bookService.addBook(this.props.book).then(
            (resp) => {
                console.log('addBook function')
                this.props.dispatch({type: 'handleBookFieldChange', book: {title: '', author: '', isbn:'', genre: '' }})
            }
        )

    }
    render() {
        const FIELDS = ['title', 'author', 'isbn', 'genre'];
        return (
            <>
            <div className='container border'>
                <h1>Add a book to the library</h1>
                <form>
                    {
                    FIELDS.map((name) => {
                        return (
                            <div key={name}>
                                <label htmlFor={'b_' + name}>{name}</label>
                                <input type='text' className='form-control' name={name}
                                        id={'b_' + name} value={this.props.book[name]}
                                        onChange={(e) => this.handleBookFieldChange(e) }/>
                            </div>
                        )
                    })
                    }
                    <button className='btn btn-primary' 
                        onClick={ (e) => this.addBook(e) } >Submit</button>
                </form>
            </div>
            </>
        );
    }
}

function mapStateToProps(state){
    const {book} = state;
    return {book: book}
}

export default connect(mapStateToProps)(BookForm);