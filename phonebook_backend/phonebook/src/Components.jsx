


const DeleteButton = ({ onClick }) => {
    return (
        <>
            <button onClick={onClick}>Delete</button>
        </>
    )
}


const Search = ({ value, onChange }) => {
    return (
        <>
            search for: <input value={value}
                onChange={onChange} />
        </>
    )
}

const Form = ({ name, number, onSubmit, onNameChange, onNumberChange }) => {
    return (
        <form onSubmit={onSubmit}>
            <div className="field">
                name: <input value={name}
                    onChange={onNameChange} />
            </div>
            <div className="field">
                number: <input value={number}
                    onChange={onNumberChange} />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

const Person = ({ name, number, onClick }) => {
    return (
        <li>{name} {number} <DeleteButton onClick={onClick} /> </li>
    )
}

const Notification = ({ message }) => {
    if (message === null) {
        return null
    }
    return (
        <div className='message'>
            {message}
        </div>
    )
}

const ErrorMessage = ({ message }) => {
    if (message === null) {
        return null
    }
    return (
        <div className='error'>
            {message}
        </div>
    )
}



export { Person, Form, Search, DeleteButton, Notification, ErrorMessage }