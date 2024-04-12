import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

export function DetectedDamages(props) {
  {
    /* <img className = "road_image" src={'data:image/jpeg;base64,' + base64_image} alt="" /> */
  }
  const { data } = props;
  const [showMore, setShowMore] = useState({});
  const [damage, setDamage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const toggleShowMore = (key) => {
    setShowMore((prevState) => ({ ...prevState, [key]: !prevState[key] }));
  };

  const viewAll = (key) => {
    setDamage(key);
  };

  let labelNames = {
    D00: "Longitudinal Crack",
    D10: "Transverse Crack",
    D20: "Alligator Crack",
    D40: "Pothole",
  };

  return (
    <>
      {!damage && (
        <div className="damaged_roads">
          {Object.keys(data).map((key, index) => {
            return (
              <div key={index} className="damage_type">
                <h3>Category: {key}</h3>
                <div className="damage_images">
                  {(showMore[key] ? data[key] : data[key].slice(0, 4)).map(
                    (damage, index) => {
                      return (
                        <div key={index} className="damage_image">
                          <img
                            className="road_image"
                            src={`data:image/jpeg;base64,${damage.image}`}
                            alt=""
                            onClick={() => {
                              setIsModalOpen(true);
                              setSelectedImage({
                                image: damage.image,
                                label: key,
                                latitude: damage.latitude,
                                longitude: damage.longitude,
                              });
                            }}
                          />
                        </div>
                      );
                    }
                  )}
                </div>
                <button className="view_more" onClick={() => viewAll(key)}>
                  {showMore[key] ? "View Less" : "View All"}
                  <FaArrowRight />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {damage && (
        <div className="damage_images_grid">
          <div className="damage-heading">
            <h3>Category: {damage}</h3>
            <button className="view_more" onClick={() => setDamage(null)}>
              <FaArrowLeft />
              Back
            </button>
          </div>
          <div className="road-images">
            {data[damage].map((item, index) => {
              return (
                <img
                  className="road_image"
                  src={`data:image/jpeg;base64,${item.image}`}
                  alt=""
                  onClick={() => {
                    setIsModalOpen(true);
                    setSelectedImage({
                      image: item.image,
                      label: damage,
                      latitude: item.latitude,
                      longitude: item.longitude,
                    });
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <FaTimes
              size={22}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                color: "red",
                cursor: "pointer",
              }}
              onClick={() => setIsModalOpen(false)}
            />
            <img
              className="modal-image"
              src={`data:image/jpeg;base64,${selectedImage.image}`}
              alt=""
            />
            <div className="modal-details">
              <p>
                Label: <span>{selectedImage.label === 'D0'? "D00" : selectedImage.label}</span>
              </p>
              <p>
                Type: <span>{labelNames[selectedImage.label === 'D0'? "D00" : selectedImage.label]}</span>
              </p>
              <p>
                Latitude: <span>{selectedImage.latitude===""?"Not Available": selectedImage.latitude}</span>
              </p>
              <p>
                Longitude: <span>{selectedImage.longitude===""?"Not Available": selectedImage.longitude}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
