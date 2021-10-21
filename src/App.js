import React, { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert";

// save list in local storage to persist memory after reload
const getLocalStorage = () => {
  let list = localStorage.getItem("list");

  if (list) {
    return JSON.parse(localStorage.getItem("list"));
  } else {
    return [];
  }
};

function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    msg: "",
    type: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      // display alert
      showAlert(true, "danger", "please enter value");
    }
    // if an item is being edited
    else if (name && isEditing) {
      setList(
        list.map((item) => {
          // figure out which item is being edited by comparing to edit id in current state
          if (item.id === editID) {
            // spread operator copies list then adds new name to the end of the list
            return { ...item, title: name };
          }
          // return the other items unchanged
          return item;
        })
      );
      // reset name, end editing, and display success message
      setName("");
      setEditID(null);
      setIsEditing(false);
      showAlert(true, "success", "value changed");
    }
    //  no items are being edited and the new item is added to the list
    else {
      showAlert(true, "success", "Item added to the list");
      // create an id from the current date and time to get unique value
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      setName("");
    }
  };

  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, type, msg });
  };

  const clearList = () => {
    showAlert(true, "danger", "List Cleared");
    setList([]);
  };

  const removeItem = (id) => {
    showAlert(true, "danger", "item removed");
    // find the item to remove and filter it out
    setList(list.filter((item) => item.id !== id));
  };

  const editItem = (id) => {
    // find the item being edited
    const specificItem = list.find((item) => {
      return item.id === id;
    });
    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
  };

  // add list to local storage whenever list changes
  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>
        {/* conditional rendering of alert modal based on state variable */}
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3>Grocery Bud</h3>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="ex.eggs"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="submit-btn">
            {/* set button content based on whether and item is being edited or not */}
            {isEditing ? "edit" : "submit"}
          </button>
        </div>
      </form>
      <div className="grocery-container">
        {/* if list is not empty display list */}
        {list.length > 0 && (
          <List items={list} removeItem={removeItem} editItem={editItem} />
        )}
        {list.length > 0 && (
          <button className="clear-btn" onClick={clearList}>
            clear items
          </button>
        )}
      </div>
    </section>
  );
}

export default App;
