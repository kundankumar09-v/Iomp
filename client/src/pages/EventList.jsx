import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import API_URL from "../config";
import { EVENT_TYPES } from "../constants/eventTypes";
import Footer from "../components/Footer";
import "./EventList.css";

function EventList() {

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [params] = useSearchParams();
  const navigate = useNavigate();

  // Extract filters from URL
  const city = params.get("city") || "";
  const type = params.get("type") || "";
  const search = params.get("query") || "";

  // Fetch events when params change
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (city && city !== "All") queryParams.set("city", city);
        if (type) queryParams.set("type", type);
        if (search) queryParams.set("query", search);

        const res = await axios.get(
          `${API_URL}/api/events${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
        );
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [city, type, search]);

  const formatDate = (startDate, endDate) => {
    if (!startDate) return "TBA";
    const start = new Date(startDate);
    if (Number.isNaN(start.getTime())) return "TBA";

    const startStr = start.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    if (!endDate) {
      return `${startStr} onwards`;
    }

    const end = new Date(endDate);
    if (Number.isNaN(end.getTime())) {
      return `${startStr} onwards`;
    }

    if (startDate === endDate || start.getTime() === end.getTime()) {
      return startStr;
    }

    return `${startStr} onwards`;
  };

  return (
    <div className="event-page">
      {loading && <div className="loading-overlay">✨ Discovering nearby events...</div>}

      <h2>Explore Events</h2>
      {search && (
        <div className="search-status" style={{ marginBottom: '20px', color: '#64748b' }}>
          Showing results for "<strong>{search}</strong>"
          <button
            onClick={() => {
              const newParams = new URLSearchParams(params);
              newParams.delete("query");
              navigate(`?${newParams.toString()}`);
            }}
            style={{ marginLeft: '10px', background: 'none', border: 'none', color: '#ff0844', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Clear search
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="filters">

        <select
          value={city}
          onChange={(e) => {
            const newCity = e.target.value;
            const newParams = new URLSearchParams(params);
            if (newCity && newCity !== "All") {
              newParams.set("city", newCity);
            } else {
              newParams.delete("city");
            }
            navigate(`?${newParams.toString()}`);
          }}
        >
          <option value="">All Cities</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Delhi">Delhi</option>
          <option value="Bangalore">Bangalore</option>
          <option value="LB Nagar">LB Nagar</option>
        </select>

        <select
          value={type}
          onChange={(e) => {
            const newType = e.target.value;
            const newParams = new URLSearchParams(params);
            if (newType) {
              newParams.set("type", newType);
            } else {
              newParams.delete("type");
            }
            navigate(`?${newParams.toString()}`);
          }}
        >
          <option value="">All Types</option>
          {EVENT_TYPES.map((typeItem) => (
            <option key={typeItem.value} value={typeItem.value}>
              {typeItem.label}
            </option>
          ))}
        </select>

      </div>

      {/* Cards */}
      <div className="cards">

        {events.map((event) => (

          <div
            key={event._id}
            className="card"
            onClick={() => navigate(`/event/${event._id}`)}
          >
            <div className="event-poster-wrap">
              <img
                src={`${API_URL}/${event.eventImage?.replace(/\\/g, "/")}`}
                alt={event.name}
                className="card-img"
              />
              <div className="event-bottom-strip">{formatDate(event.date, event.endDate)}</div>
            </div>

            <div className="card-info">
              <h4>{event.name}</h4>
              <p className="city">{event.type}</p>
            </div>

          </div>

        ))}

      </div>

      <Footer />
    </div>
  );
}

export default EventList;