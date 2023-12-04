import { useEffect, useState } from "react";
import boy from "./photo/boy.jpg";
import girl from "./photo/girl.png";
import "./index.css";

const dummyData = [
  {
    id: 34444456546,
    name: "Nischal Baniya",
    contact: 9863847607,
    description: "IT",
    gender: "male",
  },
  {
    id: 16546565656,
    name: "Suresh Bhattarai",
    contact: 987645375,
    description: "IT",
    gender: "male",
  },
  {
    id: 156565454456,
    name: "Samjana Thakuri",
    contact: 9876987564,
    description: "BHM",
    gender: "female",
  },
  {
    id: 156565454450,
    name: "Ashmita",
    contact: 9876987564,
    description: "BBA",
    gender: "female",
  },
];

const getLocalItems = () => {
  let lists = localStorage.getItem("userdatas");

  if (lists) {
    return JSON.parse(localStorage.getItem("userdatas"));
  } else {
    localStorage.setItem("userdatas", JSON.stringify(dummyData));
    window.location.reload();
    return;
  }
};

export default function App() {
  const [data, setData] = useState(getLocalItems());
  const [recentdata, setRecentdata] = useState({});
  const [update, setUpdate] = useState(false);
  const [effect, setEffect] = useState(false);

  let selectedData;

  function handleaddcontact(newcontact) {
    setData((cl) => [...cl, newcontact]);
  }

  function handleDeleteContact(id) {
    if (data.length > 1) {
      const confirm = window.confirm("Are you sure want to delete?");
      if (confirm) setData((cl) => cl.filter((nl) => nl.id !== id));
      else return;
    } else {
      alert("Data can not be empty");
    }
  }

  function handleUpdateAction(id) {
    setUpdate(!update);
    selectedData = data.find((cl) => cl.id === id);
    setRecentdata(selectedData);
  }

  function handleUpdateDataContact(id, data) {
    console.log(id, data);
    setData((cl) =>
      cl.map((nl) =>
        nl.id === id
          ? {
              ...nl,
              name: data.name,
              contact: data.contact,
              description: data.description,
              gender: data.gender,
            }
          : nl
      )
    );
  }

  function listopacity() {
    setEffect(!effect);
    setUpdate(!update);
  }

  console.log(effect);

  useEffect(
    function () {
      localStorage.setItem("userdatas", JSON.stringify(data));
    },
    [data]
  );

  return (
    <div>
      <Header />
      <Main>
        <Form
          addDataProps={handleaddcontact}
          actionProps={update}
          recentProps={recentdata}
          listopacityProps={listopacity}
          updateDataProps={handleUpdateDataContact}
        />
        <Output
          dataProps={data}
          deletedataProps={handleDeleteContact}
          actionProps={handleUpdateAction}
          listopacityProps={listopacity}
          listeffect={effect}
        />
      </Main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <div className="headerCSS">
      <span>Visit Form 📝</span>
    </div>
  );
}
function Main({ children }) {
  return <div className="mainCSS">{children}</div>;
}

function Form({
  addDataProps,
  actionProps,
  recentProps,
  listopacityProps,
  updateDataProps,
}) {
  return (
    <div className="formCSS">
      {!actionProps ? (
        <ReusableForm action="Add" addDataProps={addDataProps} />
      ) : (
        <ReusableForm
          action="Update"
          recentProps={recentProps}
          listopacityProps={listopacityProps}
          actionProps={actionProps}
          updateDataProps={updateDataProps}
        />
      )}
    </div>
  );
}

function ReusableForm({
  action,
  recentProps,
  addDataProps,
  listopacityProps,
  actionProps,
  updateDataProps,
}) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [description, setDescription] = useState("select");
  const [gender, setGender] = useState("select");

  function Resetfields() {
    setName("");
    setContact("");
    setDescription("select");
    setGender("select");
  }

  function handlesubmit(e) {
    e.preventDefault();

    if (action === "Add") {
      const data = {
        id: Date.now(),
        name,
        contact,
        description,
        gender,
      };
      if (!name || !contact || !description || !gender) {
        alert("Please filled all the credentials");
      } else {
        addDataProps(data);
        setName("");
        setContact("");
        setDescription("");
      }
    }

    if (action === "Update") {
      const updateformdata = {
        name: name || recentProps.name,
        contact: contact || recentProps.contact,
        description: description || recentProps.description,
        gender: gender || recentProps.gender,
      };
      console.log(updateformdata);

      updateDataProps(recentProps.id, updateformdata);
      setName("");
      setContact("");
      setDescription("");
      setGender("select");
    }
  }

  return (
    <form onSubmit={handlesubmit}>
      <label>Name</label>
      <br></br>
      <input
        placeholder={recentProps ? recentProps.name : ""}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onClick={() => setName(recentProps ? recentProps.name : "")}
      />
      <br></br>

      <label>Contact</label>
      <br></br>
      <input
        placeholder={recentProps ? recentProps.contact : ""}
        value={contact}
        onChange={(e) =>
          isNaN(e.target.value)
            ? console.log("not")
            : setContact(e.target.value)
        }
        maxLength={10}
      />
      <br></br>

      <label>Faculty</label>
      <br></br>
      <select
        placeholder={recentProps ? recentProps.description : ""}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      >
        <option disabled value="select">
          Select
        </option>
        <option value="IT">IT</option>
        <option value="BBA">BBA</option>
        <option value="BHM">BHM</option>
      </select>
      <br></br>

      <label>Gender</label>
      <br></br>
      <select value={gender} onChange={(e) => setGender(e.target.value)}>
        <option disabled value="select">
          Select
        </option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <br></br>

      <button className="button">{action}</button>
      {action === "Update" ? (
        <button
          className="button cancelbtn"
          onClick={() => {
            listopacityProps();
            Resetfields();
          }}
        >
          Cancel
        </button>
      ) : null}
    </form>
  );
}

function Output({
  dataProps,
  deletedataProps,
  actionProps,
  listopacityProps,
  listeffect,
}) {
  const [listview, setListview] = useState(true);
  const [sortBy, setSortBy] = useState("input");
  const [searchinput, setSearchInput] = useState("");
  let sortedItems;

  if (sortBy === "input") sortedItems = dataProps;

  if (sortBy === "alphabets") {
    sortedItems = dataProps
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  if (searchinput) {
    console.log(searchinput);
    sortedItems = dataProps.filter((nl) => {
      return nl.name.toLowerCase().includes(searchinput.toLowerCase());
    });
  }

  console.log(sortedItems);

  return (
    <div className="outputCSS">
      <div className="outputheader">
        <h3>All Attended Lists</h3>

        <input
          placeholder="Search here"
          value={searchinput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="input">Sort by default</option>
            <option value="alphabets">Sort by Name (A-Z)</option>
          </select>
          <button
            onClick={() => {
              setListview(!listview);
            }}
          >
            {listview ? "List View" : "Grid View"}
          </button>
        </div>
      </div>

      <div className="outputresult">
        <ul>
          {sortedItems.length === 0 && (
            <div>
              <p>No data found....❓</p>
            </div>
          )}
          {sortedItems &&
            sortedItems.map((cl) => (
              <List
                listProps={cl}
                key={cl.id}
                viewProps={listview}
                deletedataProps={deletedataProps}
                actionProps={actionProps}
                listopacityProps={listopacityProps}
                listeffect={listeffect}
              />
            ))}
        </ul>
      </div>
    </div>
  );
}

function List({
  listProps,
  viewProps,
  deletedataProps,
  actionProps,
  listopacityProps,
  listeffect,
}) {
  return (
    <li
      className={`${viewProps ? "gridview" : "listview"} ${
        listeffect ? "listopacity" : ""
      }`}
    >
      <div className={`${viewProps ? "" : "contactCSS"}`}>
        <div>
          <img
            style={{ width: "100px" }}
            src={listProps.gender === "male" ? boy : girl}
            alt={`${listProps.name} pic.`}
          />
        </div>
        <div>
          <h4 style={{ padding: "0.5rem" }}>Name: {listProps.name}</h4>
          <h4 style={{ padding: "0.2rem" }}>Contact: {listProps.contact}</h4>
          <h5 style={{ padding: "0.2rem" }}>
            Faculty: {listProps.description}
          </h5>
        </div>
        <div className="outputbtn">
          <button
            className="button"
            onClick={() => {
              actionProps(listProps.id);
              listopacityProps();
            }}
            disabled={listeffect}
          >
            Update
          </button>
          <button
            className="button"
            onClick={() => deletedataProps(listProps.id)}
            disabled={listeffect}
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}

function Footer() {
  return;
}
