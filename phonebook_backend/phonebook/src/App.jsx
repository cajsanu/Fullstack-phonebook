import { useState, useEffect } from 'react'
import { Search, Form, Person, Notification, ErrorMessage } from "./Components"
import personRequests from "./requests/persons"


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [search, setSearch] = useState("")
  const [found, setFound] = useState([])
  const [notification, setNotification] = useState(null)
  const [error, setErrorMessage] = useState(null)
  const showAll = search === ""

  const getPersons = () => {
    personRequests
      .getAll()
      .then(data => {
        console.log('promise fulfilled', data)
        setPersons(data)
      })
  }
  useEffect(getPersons, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    const names = persons.map(person => person.name)

    if (newName === "" || newNumber === "") {
      alert("empty field")
      return
    }

    if (names.includes(newName)) {
      if (window.confirm(`${newName} is already added to phonebook. Do you want to update the number?`)) {
        const personObject = persons.find(p => p.name === newName)
        const newObject = { ...personObject, number: newNumber }
        personRequests
          .updateNumber(newObject.id, newObject)
          .then(newNumber => {
            setNotification(`Updated number of ${newObject.name}`)
            setTimeout(() => {
              setNotification(null)
            }, 5000)
            setPersons(persons.map(p => p.name !== newName ? p : newObject))
          })
          .catch(error => {setErrorMessage("The preson has already been removed")})
          setTimeout(() => {
            setErrorMessage(null)
            getPersons
          }, 5000)
      }
    } else {
      const newPerson = { name: newName, number: newNumber }
      personRequests
        .postNew(newPerson)
        .then(newP => {
          setPersons((oldValues) => oldValues.concat(newP))
          setNotification(`Added ${newPerson.name}`)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
      setNewName("")
      setNewNumber("")
    }
  }


  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    const newSearch = event.target.value
    setSearch(newSearch);

    let localFound = []

    for (const person of persons) {
      if ((person.name.toLowerCase()).includes(newSearch)) {
        localFound = localFound.concat(person)
      }
    }
    setFound(localFound)
  }

  const handleDelete = (person) => {
    if (window.confirm(`Are yopu sure you want to delete ${person.name}`))
      personRequests
        .deletePerson(person.id)
        .then(getPersons)
  }


  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notification} />
      <ErrorMessage message={error} />
      <Search value={search}
        onChange={handleSearchChange} />
      <h2>Add new entry</h2>
      <Form name={newName} number={newNumber}
        onSubmit={handleSubmit}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <ul>
        {showAll ?
          persons.map(person => <Person
            key={person.name}
            name={person.name}
            number={person.number}
            onClick={() => handleDelete(person)} />) :
          found.map(person => <Person
            key={person.name}
            name={person.name}
            number={person.number}
            onClick={() => handleDelete(person)} />)
        }
      </ul>
    </div>
  )
}

export default App
