import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../pages/Showtimes.css'

export default function Showtimes() {
  const [areas, setAreas] = useState([])
  const [selectedArea, setSelectedArea] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [showtimes, setShowtimes] = useState([])

  //Parse theatre areas from XML
  const getFinnkinoTheatres = (xml) => {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xml, 'application/xml')
    const theatres = xmlDoc.getElementsByTagName('TheatreArea')
    const tempAreas = []

    //Loop through theatre areas and extract ID and name
    for (let i = 0; i < theatres.length; i++) {
      tempAreas.push({
          "id": theatres[i].getElementsByTagName('ID')[0].textContent,
          "name": theatres[i].getElementsByTagName('Name')[0].textContent
      });
    }
  setAreas(tempAreas);
  }

  //Parse showtimes from XML
  const getFinnkinoSchedules = (xml) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'application/xml');
    const shows = xmlDoc.getElementsByTagName('Show');
    const tempShowtimes = [];

    // Loop through the shows and extract relevant details
    for (let i = 0; i < shows.length; i++) {
        tempShowtimes.push({
            "title": shows[i].getElementsByTagName('Title')[0].textContent,
            "theatre": shows[i].getElementsByTagName('Theatre')[0].textContent,
            "startTime": shows[i].getElementsByTagName('dttmShowStart')[0].textContent,
            "genres": shows[i].getElementsByTagName('Genres')[0].textContent,
            "language": shows[i].getElementsByTagName('SpokenLanguage')[0].textContent,
            "image": shows[i].getElementsByTagName('EventSmallImagePortrait')[0].textContent
        });
    }
    setShowtimes(tempShowtimes)
}

//Handler for area dropdown selection
const handleAreaChange = (e) => {
  const selectedId = e.target.value;
  console.log('Selected area ID: ' + selectedId)
  setSelectedArea(selectedId)
}

//Handler for date picker selection
const handleDateChange = (e) => {
  const selectedDate = e.target.value
  const [year, month, day] = selectedDate.split('-')
  const formattedDate = (day + "." + month + "." + year)
  console.log('Selected date: ' + formattedDate)
  setSelectedDate(formattedDate)
}

//Fetch data when the component mounts or selected filters change
useEffect(() => {
  //Fetch theatre areas if not already loaded
  if (!areas.length) {
      axios
      .get('https://www.finnkino.fi/xml/TheatreAreas/', {responseType: 'text'})
      .then((response) => {
          getFinnkinoTheatres(response.data)
          console.log(response.data)
      })
      .catch(error => {
          console.error(error)
      })
  }

  //Fetch showtimes when area or date changes
  if (selectedArea || selectedDate) {
      let url = 'https://www.finnkino.fi/xml/Schedule/'
      if (selectedArea) url += `?area=${selectedArea}`
      if (selectedDate) url += (selectedArea ? '&' : '?') + `dt=${selectedDate}`
      console.log(url)
      axios
      .get(url, {responseType: 'text'})
      .then((response) => {
          getFinnkinoSchedules(response.data)
          console.log(response.data)
      })
      .catch(error => {
          console.error(error)
      })
  }
}, [selectedArea, selectedDate])

return (
  <div className="showtimes-container">
    <div className="inputs-container">
      <input 
        type='date' 
        id='date' 
        onChange={handleDateChange}
        className="date-input"/>
      <select onChange={handleAreaChange} value={selectedArea} className="area-select">
          {areas.map((area) => (
              <option key={area.id} value={area.id}>
                  {area.name}
              </option>
          ))}
      </select>
    </div>
      <div className="showtimes-list">
          <h2 className="showtimes-title">Showtimes</h2>
          {showtimes.length > 0 ? (
              <ul className="showtimes-ul">
                  {showtimes.map((show, index) => (
                      <li key={index} className="showtime-card">
                          {show.image && (
                            <div className="showtime-image-container">
                              <img
                                  src={show.image}
                                  alt={show.title}
                                  className="showtime-image"
                              />
                            </div>
                          )}
                          <div className="showtime-details">
                          <h3 className="showtime-title">{show.title}</h3>
                          <p className="showtime-theatre">{show.theatre}</p>
                          <p className="showtime-time">
                            <strong>
                              Date: {new Date(show.startTime).toLocaleDateString()}<br/>
                              Time: {new Date(show.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}
                            </strong>
                          </p>
                          <p className="showtime-genres-language">
                            <strong>Language: </strong>{show.language} | <strong>Genre: </strong>{show.genres}
                          </p>
                          </div>
                      </li>
                  ))}
              </ul>
          ): (
              <p className="no-showtimes">No showtimes available for the selected filters</p>
          )}
      </div>
  </div>
)
}
