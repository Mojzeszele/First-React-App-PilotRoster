import React, {useState, useEffect} from "react";
import './App.css';

const API = "http://localhost:3005"
const API2 = "http://localhost:3006"

const Roster = () => {

    const [pilot, setPilot] = useState(false)
    const [records, setRecords] = useState([])
    const [text, setText] = useState(false)
    const [newRecord, setNewRecord] = useState({date: "", text: ""})
    const [PilotDetails, setPilotDetails] = useState({kills: "", hours: ""})
    const [changePilot, setChangePilot] = useState(1)
    const [changeRecords, setChangeRecords] = useState((1))
    const [added, setAdded] = useState()


    useEffect(() => {
        setAdded({kills: +pilot.kills + +PilotDetails.kills, hours: +pilot.hours + +PilotDetails.hours})
    }, [PilotDetails]) //z tym to się namęczyłem, chwal się tym!
    useEffect(() => {
        fetch(`${API}/pilot`)
            .then(response => response.json())
            .then(data => setPilot(data))
            .catch(err => console.warn(err))
    }, [changePilot]) //pobranie bazy pilot do stanu
    useEffect(() => {
        fetch(`${API2}/records`)
            .then(response => response.json())
            .then(data => setRecords(data))
            .catch(err => console.warn(err))
    }, [changeRecords]) //pobranie bazy records do stanu

    const handleTextarea = (e)  => {
        setNewRecord(  prev => { return {...prev, text: e.target.value}
        })
    }
    const handleDate = (e) => {
        setNewRecord(  prev => { return {...prev, date: e.target.value}
        })
    }
    const handleKills = (e) => {
        setPilotDetails(prev => { return {...prev, kills: e.target.value}})
        }
    const handleHours = (e) => {
        setPilotDetails(  prev => { return {...prev, hours: e.target.value}
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        fetch(`${API2}/records`, {
            method: "POST",
            body: JSON.stringify(newRecord),
            headers: {"Content-Type": "application/json"}
        })
            .then(response => response.json())
            .then(data => {console.log(data);})
            .catch(error => {console.log(error);});
        setChangeRecords(prev => prev + 1)
        fetch(`${API}/pilot`, {
            method: "PATCH",
            body: JSON.stringify(added),
            headers: {"Content-Type": "application/json"}
        })
            .then(response => response.json())
            .then(data => {console.log(data);})
            .catch(error => {console.log(error);});
                setChangePilot(prev => prev + 1)
                setNewRecord({text: "", date: ""},
                setPilotDetails({kills: "", hours: ""}))
                e.preventDefault()
    } //przesyłanie raportu do bazy danych
    const handleDelete = (id) => {
        fetch(`${API2}/records/${id}`, {
            method: "DELETE"
        })
            .then(() => setRecords(prev => prev.filter(el => el.id !== id)))
    } //usuwanie raportu


    return pilot ? (
            <div className="base">
                <div className="background">
                    <div className="pilot-name-base">
                        <div className="pilot-name">
                            <span>Imię, nazwisko i ranga: {pilot.rank}  {pilot.name} </span>
                            <span>zestrzelenia: {pilot.kills}</span>
                            <span>godziny wylatane: {pilot.hours}</span>
                        </div>
                    </div>
                    <div className="form-div">
                        <form className="form">
                            <label style={{display: "flex", flexDirection: "column"}}> Data wylotu/Który to lot danego dnia
                                <input className="input" onChange={handleDate} value={newRecord.date} name="date"   type="text"/>
                            </label>
                            <label style={{display: "flex", flexDirection: "column"}}> Czas trwania lotu
                                <input className="input" onChange={handleHours} value={PilotDetails.hours} name="hours"  type="text" />
                            </label>
                            <label style={{display: "flex", flexDirection: "column"}}> Zestrzelone maszyny
                                <input className="input" onChange={handleKills} value={PilotDetails.kills} name="kills" type="text"  />
                            </label>
                            <label  style={{display: "flex", flexDirection: "column"}}>Szczegółowy raport
                                <textarea className="input" onChange={handleTextarea} value={newRecord.text}/>
                            </label>
                            <button className="input" onClick={handleSubmit} type="submit">Zapisz raport</button>
                        </form>
                    </div>
                    <div className="records">
                        <ul style={{backgroundColor: "whitesmoke",width: 800, height: 100, overflow: "auto"}}>
                            {records.map(el =>                               <li key={el.id}>
                                    <div>{el.date} {el.text}</div>
                                    <button className="input" onClick={() => handleDelete(el.id)}>Usun raport</button>
                                </li>)}
                        </ul>
                    </div>
                    <div className="records-div">
                        { text ?  <div  style={{height: 100, width: 790,}}>{text}</div>  : null}
                    </div>
                </div>
            </div>
    ) :
    <div className="base">
        <div className="background">
            <div>ŁADOWANIE DANYCH...</div>
        </div>
    </div>
}

function App() {
  return (
      <Roster/>
  )
}

export default App;