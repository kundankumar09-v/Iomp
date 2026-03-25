import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaClock, FaCalendarAlt, FaUsers, FaGlobe, FaMapMarkerAlt, FaTag, FaHourglass, FaQrcode, FaMap, FaSignInAlt } from "react-icons/fa";
import { MdLocalOffer } from "react-icons/md";
import { QRCodeCanvas } from "qrcode.react";
import VenueMap from "../components/VenueMap";
import API_URL from "../config";
import "./Eventdetails.css";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error("Failed to fetch event:", err);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);



  const formatImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_URL}/${path.replace(/\\/g, "/")}`;
  };

  const formatEventDate = (startDate, endDate) => {
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

  // 🖼️ Calculate carousel images (at top level to satisfy hooks)
  const images = event?.eventImages?.length > 0 
    ? event.eventImages.map(formatImageUrl) 
    : event ? [formatImageUrl(event.bannerImage || event.eventImage || "")].filter(Boolean) : [];

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  if (loading) {
    return (
      <div className="event-details-page">
        <div className="loading">Loading event details...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-details-page">
        <button onClick={() => navigate("/")} className="back-link">
          <FaArrowLeft /> Back to Home
        </button>
        <div className="error">
          <h2>Event Not Found</h2>
        </div>
      </div>
    );
  }



  const description = event.aboutEvent || "No description available";
  const isLongDescription = description.length > 200;

  return (
    <div className="event-details-page">
      <button onClick={() => navigate(-1)} className="back-link">
        <FaArrowLeft /> Back
      </button>

      <div className="details-container">
        <div className="details-left">
          <h1 className="event-name">{event.name}</h1>

          {/* Banner Carousel */}
          <div className="event-banner-carousel">
            <div className="carousel-inner" style={{ transform: `translateX(-${currentImgIndex * 100}%)` }}>
              {images.map((img, index) => (
                <div key={index} className="carousel-slide">
                  <img src={img} alt={`${event.name} slide ${index + 1}`} className="carousel-img" />
                </div>
              ))}
            </div>
            
            {images.length > 1 && (
              <>
                <button 
                  className="carousel-control prev" 
                  onClick={() => setCurrentImgIndex((currentImgIndex - 1 + images.length) % images.length)}
                >
                  <FaArrowLeft />
                </button>
                <button 
                  className="carousel-control next" 
                  onClick={() => setCurrentImgIndex((currentImgIndex + 1) % images.length)}
                >
                  <FaArrowLeft style={{ transform: 'rotate(180deg)' }} />
                </button>
                
                <div className="carousel-dots">
                  {images.map((_, index) => (
                    <div 
                      key={index} 
                      className={`dot ${currentImgIndex === index ? 'active' : ''}`}
                      onClick={() => setCurrentImgIndex(index)}
                    ></div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="event-tags">
            <span className="tag">{event.type || "Event"}</span>
            {event.city && <span className="tag">{event.city}</span>}
          </div>

          <div className="about-section">
            <h3 className="section-title">About the Event</h3>
            <p className={`about-text ${expanded ? "expanded" : ""}`}>
              {description}
            </p>
            {isLongDescription && (
              <button
                className="read-more-btn"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "Read Less" : "Read More"}
              </button>
            )}
          </div>

          <div className="map-section">
            <div className="section-header-row">
              <div className="section-title-wrap">
                <h3 className="section-title">
                  <FaMap style={{ marginRight: '8px', color: '#ff0844' }} /> 
                  Interactive Venue Map
                </h3>
                <p className="section-subtitle">Explore the venue, locate stalls, and plan your visit.</p>
              </div>
              {localStorage.getItem("wahap_temp_user") && (
                <button 
                  className="full-view-btn" 
                  onClick={() => navigate(`/event/${id}/map`)}
                >
                  Go Full Screen
                </button>
              )}
            </div>
            
            <div className="map-container-wrapper">
              {localStorage.getItem("wahap_temp_user") ? (
                <VenueMap eventId={id} />
              ) : (
                <div className="map-auth-overlay" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '16px', border: '1.5px dashed #e2e8f0', flexDirection: 'column', gap: '15px' }}>
                  <FaMap size={40} style={{ color: '#cbd5e1' }} />
                  <p style={{ color: '#64748b', fontSize: '15px', fontWeight: '500' }}>
                    <Link to="/signin" style={{ color: '#ff0844', textDecoration: 'none', borderBottom: '1px solid #ff0844' }}>Sign in</Link> to explore the interactive map
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="details-right">
          <div className="details-card">
            <div className="details-grid">
              <div className="detail-item">
                <div className="detail-icon">
                  <FaCalendarAlt />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Date</span>
                  <span className="detail-value">{formatEventDate(event.date, event.endDate)}</span>
                </div>
              </div>

              {event.startTime && (
                <div className="detail-item">
                  <div className="detail-icon">
                    <FaClock />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Start Time</span>
                    <span className="detail-value">{event.startTime}</span>
                  </div>
                </div>
              )}

              {event.duration && (
                <div className="detail-item">
                  <div className="detail-icon">
                    <FaHourglass />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Duration</span>
                    <span className="detail-value">{event.duration}</span>
                  </div>
                </div>
              )}

              {event.ageLimit && (
                <div className="detail-item">
                  <div className="detail-icon">
                    <FaUsers />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Age Limit</span>
                    <span className="detail-value">{event.ageLimit}+</span>
                  </div>
                </div>
              )}

              {event.language && (
                <div className="detail-item">
                  <div className="detail-icon">
                    <FaGlobe />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Language</span>
                    <span className="detail-value">{event.language}</span>
                  </div>
                </div>
              )}

              <div className="detail-item">
                <div className="detail-icon">
                  <FaTag />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Event Type</span>
                  <span className="detail-value">{event.type || "N/A"}</span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <FaMapMarkerAlt />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Location</span>
                  <div className="location-info">
                    <span className="detail-value">{event.city || "N/A"}</span>
                    {event.address && (
                      <span className="detail-address">{event.address}</span>
                    )}
                  </div>
                </div>
              </div>

              {event.ticketType && (
                <div className="detail-item">
                  <div className="detail-icon">
                    <MdLocalOffer />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Ticket Type</span>
                    <span className="detail-value">{event.ticketType}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="qr-reveal-section" style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px', textAlign: 'center' }}>
                {localStorage.getItem("wahap_temp_user") ? (
                  <>
                    <button 
                      onClick={() => setShowQR(!showQR)}
                      style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto', fontSize: '14px', fontWeight: '600', transition: 'all 0.3s ease' }}
                    >
                      <FaQrcode /> {showQR ? "Hide Event QR" : "Generate Event QR"}
                    </button>
                    
                    {showQR && (
                      <div style={{ marginTop: '15px', background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'inline-block' }}>
                        <QRCodeCanvas value={id} size={160} level="H" includeMargin={true} />
                        <p style={{ fontSize: '12px', color: '#64748b', marginTop: '10px' }}>Scan this code to enter the event</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="qr-auth-prompt" style={{ padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1.5px dashed #e2e8f0' }}>
                    <p style={{ margin: 0, fontSize: '14px', color: '#444', fontWeight: '600' }}>
                      <FaSignInAlt style={{ marginRight: '8px', color: '#ff0844' }} />
                      <Link to="/signin" style={{ color: '#ff0844', textDecoration: 'none', borderBottom: '1px solid #ff0844' }}>Sign in</Link> to generate entry QR code
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;