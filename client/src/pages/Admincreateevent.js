import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config";

function AdminCreateEvent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    city: "",
    address: "",
    duration: "",
    date: "",
    ticketType: "Free",
    ageLimit: "",
    language: "",
    aboutEvent: "",
  });

  const [eventImage, setEventImage] = useState(null);
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
      alert("Please upload both event image and layout image");
      return;
    }

    setLoading(true);

    const data = new FormData();

    // append text fields
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    // append images
    data.append("eventImage", eventImage);
    data.append("layoutImage", layoutImage);

    try {
      const res = await axios.post(
        `${API_URL}/api/events/create`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("✅ Event Created Successfully!");

      const eventId = res.data.event._id;
      const layoutPath = res.data.event.layoutImage;

      // ✅ IMPORTANT redirect with layout
      navigate(`/admin/map/${eventId}?layout=${layoutPath}`);
    } catch (err) {
      console.error(err);
      alert("❌ Error creating event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Create Event (Organizer)</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Event Name"
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <select name="type" onChange={handleChange} style={inputStyle} required>
          <option value="">Select Event Type</option>
          <option value="concert">Concert</option>
          <option value="fest">Fest</option>
          <option value="exhibition">Exhibition</option>
          <option value="wedding">Wedding</option>
        </select>

        <input
          name="city"
          placeholder="City"
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          name="address"
          placeholder="Full Address / Venue"
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="duration"
          placeholder="Duration (e.g., 3 hours)"
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="date"
          name="date"
          onChange={handleChange}
          style={inputStyle}
        />

        <select
          name="ticketType"
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="Free">Free</option>
          <option value="Paid">Paid</option>
        </select>

        <input
          name="ageLimit"
          placeholder="Age Limit (e.g., 5yrs+)"
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="language"
          placeholder="Language (for concerts)"
          onChange={handleChange}
          style={inputStyle}
        />

        <textarea
          name="aboutEvent"
          placeholder="About Event"
          onChange={handleChange}
          rows={4}
          style={inputStyle}
        />

        <label>Event Card Image:</label>
        <input
          type="file"
          onChange={(e) => setEventImage(e.target.files[0])}
          required
          style={inputStyle}
        />

        <label>Layout Image (Map):</label>
        <input
          type="file"
          onChange={(e) => setLayoutImage(e.target.files[0])}
          required
          style={inputStyle}
        />

        <button type="submit" disabled={loading} style={{ padding: "10px 20px" }}>
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "12px",
};

export default AdminCreateEvent;