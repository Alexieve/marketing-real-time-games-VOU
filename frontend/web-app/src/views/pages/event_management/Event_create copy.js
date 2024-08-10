import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppSidebar, AppFooter, AppHeader } from "../../../components/index";
import axios from "axios";

const EventCreate = () => {
  const { id } = useParams();

  const [eventData, setEventData] = useState({
    name: "",
    imageUrl: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    if (id !== "-1") {
      axios
        .get(`http://localhost:8000/events/${id}`)
        .then((response) => {
          setEventData(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error fetching event data:", error);
        });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let request;
    if (id === "-1") {
      request = axios.post("http://localhost:8000/events", eventData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      request = axios.put(`http://localhost:8000/events/${id}`, eventData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    request
      .then((response) => {
        if (response.status === 200) {
          console.log("Event created successfully");
        } else {
          console.error("Failed to create event");
        }
      })
      .catch((error) => {
        console.error("Error creating event:", error);
      });
  };

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <h1>{id !== "0" ? "Edit Event" : "Create Event"}</h1>
          <form onSubmit={handleSubmit}>
            {/* <input type="text" name="id" value={eventData.id} style={{ display: 'none' }} /> */}
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={eventData.name}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Image URL
              <input
                type="text"
                name="imageUrl"
                value={eventData.imageUrl}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Start Time:
              <textarea
                type="datetime-local"
                name="startTime"
                value={eventData.startTime}
                onChange={handleChange}
              />
            </label>
            <label>
              End Time:
              <textarea
                type="datetime-local"
                name="endTime"
                value={eventData.endTime}
                onChange={handleChange}
              />
            </label>
            <br />
            <button type="submit">{id !== "0" ? "Update" : "Create"}</button>
          </form>
        </div>
        <AppFooter />
      </div>
    </div>
  );
};

export default EventCreate;

