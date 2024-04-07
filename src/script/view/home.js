import Utils from "../utils.js";
import NotesData from "../data/local/notesData.js";

const home = () => {
  const searchFormElement = document.querySelector("#searchForm");

  const addNoteFormElement = document.querySelector("#addNoteForm");
  const notesData = NotesData.getAll();

  const noteListContainerElement = document.querySelector("#noteListContainer");
  const noteLoadingElement =
    noteListContainerElement.querySelector(".search-loading");
  const noteListElement = noteListContainerElement.querySelector("note-list");
  const newNoteNameElement = document.querySelector("#newNoteName");
  const newNoteDescriptionElement = document.querySelector(
    "#newNoteDescription"
  );
  // Add note
  addNoteFormElement.addEventListener("submit", (event) => {
    event.preventDefault();

    const newNoteName = document.querySelector("#newNoteName").value;
    const newNoteDescription = document.querySelector(
      "#newNoteDescription"
    ).value;

    const noteValidation = document.getElementById("noteNameValidation");

    if (newNoteName.trim() === "") {
      noteValidation.textContent = "judul harus diisi!";
      noteValidation.style.color = "white";
      return;
    } else if (newNoteName.length < 3) {
      noteValidation.textContent = "Judul min 3 karakter!";
      noteValidation.style.color = "#E72929";
      noteValidation.style.fontWeight = "500";
      return;
    } else {
      noteValidation.textContent = "";
    }

    const newNote = {
      title: newNoteName,
      body: newNoteDescription,
      createAt: new Date(),
      isArchieved: false,
    };

    notesData.push(newNote);

    alert("Catatan berhasil ditambahkan");
    newNoteNameElement.value = "";
    newNoteDescriptionElement.value = "";

    displayResult(notesData);

    const listItemElement = document.createElement("div");
    listItemElement.classList.add("card");
    listItemElement.innerHTML = `
      <div class="note-info">
        <div class="note-info__title">
          <h2>${newNote.title}</h2>
        </div>
        <div class="note-info__description">
          <p>${newNote.body}</p>
        </div>
      </div>
    `;
  });

  // Searching
  const search = () => {
    const searchTerm = document.querySelector("#name").value.toLowerCase();
    showLoading();

    const filteredResults = NotesData.getAll().filter((note) => {
      return note.title.toLowerCase().includes(searchTerm);
    });
    displayResult(filteredResults);

    showNoteList();
  };

  const showNote = () => {
    showLoading();

    const result = NotesData.getAll();
    displayResult(result);

    showNoteList();
  };

  // Display Note
  const displayResult = (notesData) => {
    const noteItemElements = notesData.map((note) => {
      const noteItemElement = document.createElement("note-item");
      noteItemElement.note = note;
      return noteItemElement;
    });

    Utils.emptyElement(noteListElement);
    noteListElement.append(...noteItemElements);
  };

  const showLoading = () => {
    Array.from(noteListContainerElement.children).forEach((element) => {
      Utils.hideElement(element);
    });
    Utils.showElement(noteLoadingElement);
  };

  const showNoteList = () => {
    Array.from(noteListContainerElement.children).forEach((element) => {
      Utils.hideElement(element);
    });
    Utils.showElement(noteListElement);
  };

  searchFormElement.addEventListener("submit", (event) => {
    event.preventDefault();
    search();
  });

  showNote();
};

export default home;
