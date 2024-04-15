import Utils from '../utils.js'
import NotesApi from '../data/remote/note-api.js'
import { gsap } from 'gsap'

const home = () => {
  const searchFormElement = document.querySelector('#searchForm')

  const addNoteFormElement = document.querySelector('#addNoteForm')

  const noteListContainerElement = document.querySelector('#noteListContainer')
  const noteLoadingElement =
    noteListContainerElement.querySelector('.search-loading')
  const noteSearchErrorElement =
    noteListContainerElement.querySelector('note-search-error')
  const noteListElement = noteListContainerElement.querySelector('note-list')
  const noteListArchiveElement =
    noteListContainerElement.querySelector('note-list-archive')

  let notesData = []

  // Add note
  addNoteFormElement.addEventListener('submit', (event) => {
    event.preventDefault()

    const newNoteName = document.querySelector('#newNoteName').value.trim()
    const newNoteDescription = document
      .querySelector('#newNoteDescription')
      .value.trim()

    const noteValidation = document.getElementById('noteNameValidation')

    if (newNoteName.trim() === '') {
      noteValidation.textContent = 'judul harus diisi!'
      noteValidation.style.color = 'white'
      return
    } else if (newNoteName.length < 3) {
      noteValidation.textContent = 'Judul min 3 karakter!'
      noteValidation.style.color = '#E72929'
      noteValidation.style.fontWeight = '500'
      return
    } else {
      noteValidation.textContent = ''
    }

    const newNote = {
      title: newNoteName,
      body: newNoteDescription,
    }

    NotesApi.createNote(newNote)
      .then(() => {
        notesData.push(newNote)
        alert('Catatan berhasil ditambahkan')
        document.querySelector('#newNoteName').value = ''
        document.querySelector('#newNoteDescription').value = ''
        displayResult(notesData)
        showNote()
        addNoteFormElement.reset()
      })
      .catch((error) => {
        console.error('Error adding note:', error)
      })
  })

  // Searching
  const search = () => {
    const searchTerm = document.querySelector('#name').value.toLowerCase()
    showLoading()

    const filteredRegularNotes = notesData
      .filter((note) => !note.isArchived) // Exclude archived notes
      .filter((note) => note.title.toLowerCase().includes(searchTerm))

    const filteredArchivedNotes = notesData
      .filter((note) => note.isArchived) // Include only archived notes
      .filter((note) => note.title.toLowerCase().includes(searchTerm))

    const allFilteredNotes = filteredRegularNotes.concat(filteredArchivedNotes)

    if (allFilteredNotes.length === 0) {
      const errorElement = document.createElement('note-search-error')
      noteListContainerElement.appendChild(errorElement)
    } else {
      displayResult(allFilteredNotes)
      showNoteList()
    }
  }

  const showNote = () => {
    showLoading()

    Promise.all([NotesApi.getAll(), NotesApi.getArchived()])
      .then(([allNotes, archivedNotes]) => {
        const searchTerm = document.querySelector('#name').value.toLowerCase()
        notesData = searchTerm ? [] : allNotes.concat(archivedNotes)

        displayResult(notesData)
      })
      .catch((error) => {
        noteSearchErrorElement.textContent = error.message
        showSearchError()
      })
      .finally(() => {
        showNoteList()
      })
  }

  // Display Note
  const displayResult = (notesData) => {
    const existingNoteElements = {} // Track existing notes in the DOM

    // Clear existing notes from the DOM
    ;[noteListElement, noteListArchiveElement].forEach((element) => {
      element.innerHTML = '' // Clear all child elements
    })

    const noteElements = notesData.map((note) => {
      const existingElement = existingNoteElements[note.id]
      if (existingElement) {
        return existingElement
      }

      const newElement = note.isArchived
        ? document.createElement('note-archive')
        : document.createElement('note-item')
      newElement.note = note
      existingNoteElements[note.id] = newElement
      return newElement
    })

    noteElements.forEach((element) => {
      const parentElement = element.note.isArchived
        ? noteListArchiveElement
        : noteListElement
      parentElement.appendChild(element)
    })
  }

  const showLoading = () => {
    Array.from(noteListContainerElement.children).forEach((element) => {
      Utils.hideElement(element)
    })
    Utils.showElement(noteLoadingElement)
  }

  const showNoteList = () => {
    Array.from(noteListContainerElement.children).forEach((element) => {
      Utils.hideElement(element)
    })
    Utils.showElement(noteListElement)
    Utils.showElement(noteListArchiveElement)
  }

  const showSearchError = () => {
    Array.from(noteListContainerElement.children).forEach((element) => {
      Utils.hideElement(element)
    })
    Utils.showElement(noteSearchErrorElement)
  }

  searchFormElement.addEventListener('submit', (event) => {
    event.preventDefault()
    search()
  })

  showNote()
}

export default home
