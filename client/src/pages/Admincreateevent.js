import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config";
import { EVENT_TYPES } from "../constants/eventTypes";
import { FaArrowLeft, FaRocket, FaImage, FaMapMarkerAlt, FaGlobe } from "react-icons/fa";
import "./AdminCreateEvent.css";

function AdminCreateEvent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    city: "",
    address: "",
    duration: "",
    date: "",
    endDate: "",
    ticketType: "Free",
    ageLimit: "",
    language: "",
    aboutEvent: "",
  });

  const [eventImage, setEventImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [layoutImage, setLayoutImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!layoutImage || !eventImage) {
      alert("Please upload both event image and layout map");
      return;
    }

    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    data.append("eventImage", eventImage);
    data.append("layoutImage", layoutImage);
    if (bannerImage) {
      data.append("bannerImage", bannerImage);
    }

    try {
      const res = await axios.post(`${API_URL}/api/events/create`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const eventId = res.data.event._id;
      const layoutPath = res.data.event.layoutImage;
      navigate(`/admin/map/${eventId}?layout=${layoutPath}`);
    } catch (err) {
      console.error(err);
      alert("❌ Error creating event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-create-page">
      <div className="admin-create-container">
        <button onClick={() => navigate("/admin")} className="back-btn">
          <FaArrowLeft /> Dashboard
        </button>

        <div className="form-header">
          <FaRocket className="header-icon" />
          <h1>Launch New Event</h1>
          <p>Create an immersive experience for your attendees.</p>
        </div>

        <form onSubmit={handleSubmit} className="premium-form">
          <div className="form-grid">
            <div className="form-section">
              <h3><FaGlobe /> Core Identity</h3>
              <input name="name" placeholder="Event Name" onChange={handleChange} required className="p-input" />
              <div className="row">
                <select name="type" onChange={handleChange} className="p-input" required>
                  <option value="">Select Category</option>
                  {EVENT_TYPES.map((typeItem) => (
                    <option key={typeItem.value} value={typeItem.value}>{typeItem.label}</option>
                  ))}
                </select>
                <select name="ticketType" onChange={handleChange} className="p-input">
                  <option value="Free">Free Entry</option>
                  <option value="Paid">Paid Ticket</option>
                </select>
              </div>
              <textarea name="aboutEvent" placeholder="Describe the event experience..." onChange={handleChange} rows={4} className="p-input" />
            </div>

            <div className="form-section">
              <h3><FaMapMarkerAlt /> Venue & Logistics</h3>
              <div className="row">
                 <input name="city" placeholder="City" onChange={handleChange} required className="p-input" />
                 <input name="duration" placeholder="Duration (e.g., 3h)" onChange={handleChange} className="p-input" />
              </div>
              <input name="address" placeholder="Full Venue Address" onChange={handleChange} className="p-input" />
              <div className="row">
                <input type="date" name="date" onChange={handleChange} className="p-input" title="Start Date" />
                <input type="date" name="endDate" onChange={handleChange} className="p-input" title="End Date" />
              </div>
              <div className="row">
                <input name="ageLimit" placeholder="Age Limit" onChange={handleChange} className="p-input" />
                <input name="language" placeholder="Main Language" onChange={handleChange} className="p-input" />
              </div>
            </div>

            <div className="form-section full-width">
              <h3><FaImage /> Visual Assets</h3>
              <div className="upload-grid">
                <div className="upload-box">
                  <span className="label">Event Card*</span>
                  <input type="file" onChange={(e) => setEventImage(e.target.files[0])} required />
                </div>
                <div className="upload-box">
                  <span className="label">Banner (Slide)</span>
                  <input type="file" onChange={(e) => setBannerImage(e.target.files[0])} />
                </div>
                <div className="upload-box layout">
                  <span className="label">Venue Layout (Map)*</span>
                  <input type="file" onChange={(e) => setLayoutImage(e.target.files[0])} required />
                </div>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="p-submit-btn">
            {loading ? "Preparing Launch..." : "Create & Open Map Editor"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminCreateEvent;