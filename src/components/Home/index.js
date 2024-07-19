import React, { Component } from "react";
import Cookies from "js-cookie";
import { Redirect } from "react-router-dom";
import { FaRegLightbulb } from "react-icons/fa";
import { MdOutlineArchive, MdDelete, MdOutlineColorLens } from "react-icons/md";
import { MdOutlineUnarchive } from "react-icons/md";
import Header from "../Header"

 
import "./index.css";

class Home extends Component {
  state = {
    isNoteWriting: false,
    title: "",
    noteContent: "",
    notes: [],
    activeNotes:'notes',
    searchResults:[]
  };

  componentDidMount() {
    this.loadNotesFromLocalStorage();
  }

  onChangeSearchInput = (event) => {
    const {notes} = this.state
    const value = event.target.value
    const searchResults = value.length!==0 ? notes.filter((note) => note.title.includes(event.target.value)) :[]
    console.log(event.target.value)
 
    this.setState({searchResults})
  }

  loadNotesFromLocalStorage = () => {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    this.setState({ notes });
  };

  saveNotesToLocalStorage = (notes) => {
    localStorage.setItem("notes", JSON.stringify(notes));
  };

  onClickNewNote = () => {
    this.setState((prevState) => ({
      isNoteWriting: !prevState.isNoteWriting,
    }));
  };

  onChangeNoteContent = (event) => {
    this.setState({ noteContent: event.target.value });
  };

  onChangeTitle = (event) => {
    this.setState({ title: event.target.value });
  };

  onSaveNote = () => {
    const { title, noteContent, notes } = this.state;
    if (title.trim() === "" || noteContent.trim() === "") return;

    const newNote = {
      id: new Date().getTime(),
      title,
      content: noteContent,
      timestamp: new Date().toLocaleString(),
      isArchived: false,
      deletedAt:null,
      isDeleted:false
    };

    const updatedNotes = [...notes, newNote];
    this.setState({ notes: updatedNotes, title: "", noteContent: "", isNoteWriting: false });
    this.saveNotesToLocalStorage(updatedNotes);
  };

  onArchiveNote = (id) => {
    const { notes } = this.state;
    const updatedNotes = notes.map((note) => 
    {
      if(note.id === id)
      {
        return {
          ...note,
          isArchived:true
        }
      }
      return note
    });

    this.setState({ notes: updatedNotes });
    this.saveNotesToLocalStorage(updatedNotes)
  };


  onClickArchives = () => {
    this.setState({activeNotes:'archives'})
  }

  onClickBin = () => {
    this.setState({activeNotes:'bin'})
  }

  onClickNotes = () => {
    this.setState({activeNotes:'notes'})
  }

  renderSideBar = () => (
    <div className="side-bar">
      <div className="side-item" onClick={this.onClickNotes}>
        <FaRegLightbulb size={22} />
        <p className="side-item-text">Note</p>
      </div>
      <div className="side-item" onClick={this.onClickArchives}>
        <MdOutlineArchive size={22} />
        <p className="side-item-text">Archive</p>
      </div>
      <div className="side-item" onClick={this.onClickBin}>
        <MdDelete size={22} />
        <p className="side-item-text">Bin</p>
      </div>
    </div>
  );

  onClickDeleteNote = (noteId) => {
    const updatedNotes = this.state.notes.map((note) => {
      if (note.id === noteId) {
        return { ...note, deletedAt: new Date().toISOString(),isDeleted:true };
      }
      return note;
    });
    this.setState({ notes: updatedNotes })
    this.saveNotesToLocalStorage(updatedNotes)
  };

  getDeletedNotes = () => {
    const { notes } = this.state;
    const now = new Date();
    return notes.filter((note) => {
      if (note.deletedAt) {
        const deletedAt = new Date(note.deletedAt);
        const diffInDays = (now - deletedAt) / (1000 * 60 * 60 * 24);
        return diffInDays <= 30;
      }
      return false;
    });
  };  


  renderDeletedNotes = () => {
    const deletedNotes = this.getDeletedNotes();
    return (
      <div className="deleted-notes-section">
        <h2>Deleted Notes</h2>
        <div className="deleted-notes-card">
        {deletedNotes.length > 0 ? (
          deletedNotes.map((note) => (
            <div key={note.id} className="note">
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <p>Deleted At: {new Date(note.deletedAt).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p>No notes deleted in the last 30 days.</p>
        )}
        </div>
      </div>
    );
  };
  
  

  renderNotes = () => {
    const { notes } = this.state;
 
  
    const updatedNotes = notes.filter((note) => note.isArchived === false && note.isDeleted === false)

    console.log(updatedNotes)

    

    return updatedNotes.map((note) => (
      <div key={note.id} className="note">
        <h3>{note.title}</h3>
        <p>{note.content}</p>
        <p className="timestamp">{note.timestamp}</p>
        <div className="note-actions">
          <MdOutlineArchive
            size={20}
            className="feature-icon"
            onClick={() => this.onArchiveNote(note.id)}
          />
          <MdDelete size={20} className="feature-icon" onClick={() => this.onClickDeleteNote(note.id)} />
        </div>
      </div>
    ));
  };

  writeNote = () => {
    const { isNoteWriting } = this.state;

    return (
      <div className="new-note-card">
        {isNoteWriting ? (
          <div className="new-title-content-card">
            <input
              type="text"
              className="note-text note-title"
              placeholder="Title"
              value={this.state.title}
              onChange={this.onChangeTitle}
            />
            <textarea
              rows="4"
              cols="50"
              className="note-text"
              placeholder="Take a note..."
              value={this.state.noteContent}
              onChange={this.onChangeNoteContent}
            ></textarea>

            <div className="note-bottom-card">
              <div className="note-features">
                <MdOutlineArchive size={20} className="feature-icon" />
                <MdOutlineColorLens size={20} className="feature-icon" />
                <button type="button" className="features-btn">
                  Add Label
                </button>
                <button type="button" className="features-btn" onClick={this.onSaveNote}>
                  Save
                </button>
              </div>
              <button
                type="button"
                onClick={this.onClickNewNote}
                className="features-btn"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="new-note" onClick={this.onClickNewNote}>
            Take a note...
          </div>
        )}
      </div>
    );
  };


  onUnArchiveNote = (id) => {
    const { notes } = this.state;
    const updatedNotes = notes.map((note) => 
    {
      if(note.id === id)
      {
        return {
          ...note,
          isArchived:false
        }
      }
      return note
    });

    this.setState({ notes: updatedNotes });
    this.saveNotesToLocalStorage(updatedNotes)
  }


  renderArchives = (note) => (
    <div key={note.id} className="note">
        <h3>{note.title}</h3>
        <p>{note.content}</p>
        <p className="timestamp">{note.timestamp}</p>
        <div className="note-actions">
          <MdOutlineUnarchive
            size={20}
            className="feature-icon"
            onClick={() => this.onUnArchiveNote(note.id)}
          />
          <MdDelete size={20} className="feature-icon" onClick={() => this.onClickDeleteNote(note.id)} />
        </div>
      </div>
  )


  renderSearchResults = () => {
    const {searchResults} = this.state
    console.log(searchResults)

    return searchResults.map((note) => (
      <div key={note.id} className="note">
        <h3>{note.title}</h3>
        <p>{note.content}</p>
        <p className="timestamp">{note.timestamp}</p>
        <div className="note-actions">
          <MdOutlineArchive
            size={20}
            className="feature-icon"
            onClick={() => this.onArchiveNote(note.id)}
          />
          <MdDelete size={20} className="feature-icon" onClick={() => this.onClickDeleteNote(note.id)} />
        </div>
      </div>
    ));

  }

  renderACtiveNotes = () => {
    const {activeNotes,notes} = this.state 

    switch (activeNotes) {
      case 'notes':
        return this.renderNotes()
      case 'archives':
        const archivenotes = notes.filter(note => note.isArchived === true && note.isDeleted === false)

        return (
          <>
            {archivenotes.map((each) => this.renderArchives(each))}
          </>
        )
      case 'bin':
        return this.renderDeletedNotes()
    }
  }

  render() {
    const { isNoteWriting,activeNotes,searchResults } = this.state;

    console.log(isNoteWriting);
    const jwtToken = Cookies.get("jwt_token");

    if (!jwtToken) {
      return <Redirect to="/login" />;
    }

    return (
      <div>
        <Header onChangeSearchInput = {this.onChangeSearchInput}/>
        <div className="main-card">
          {this.renderSideBar()}
          {searchResults.length !== 0? 
          (<div className="saved-notes-card">
            {this.renderSearchResults()}
          </div>) : 
          (<div className="notes-container">
            {activeNotes === "notes" &&  this.writeNote()}
            <div className="saved-notes-card">
              {this.renderACtiveNotes()}
            </div>
          </div>)}
        </div>
      </div>
    );
  }
}

export default Home;
