import React, { useEffect, useState, useContext } from 'react'
import { Modal, Button } from "react-bootstrap";
import Dropzone from "react-dropzone";
import AdminNavbar from "./AdminNavbar";
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom";
import "./CreateEvents.css"
import "./Modal.css";
import Editor from "./Editor";
function EventDetails() {
  const [modal, setModal] = useState(false);
  const [file, setFiles] = useState(null);
  const [itinerary, setItinerary] = useState();
  const [highlights, setHighlights] = useState();
  const [pickupPoints, setPickupPoints] = useState();
  const [thingsToCarry, setThingsToCarry] = useState();
  const [costIncludes, setCostIncludes] = useState();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const toggleModal = () => {
    if (modal) {
      setModal(false);
    } else {
      setModal(true);
    }
  };
  if (modal) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();
  const [isEditable, setEditable] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [event, setEvent] = useState();
  const [currentImages, setcurrentImages] = useState();
  const navigate = useNavigate();
  const params = useParams()
  let eventId = params.eventId;
  useEffect(() => {
    getCurrentrecord();
  }, []);

  const removeFile = name => {
    setcurrentImages(currentImages => currentImages.filter(file => file !== name))
  }


  const getCurrentrecord = async () => {
    fetch(`https://sahyadri-vacations.vercel.app/create-event/event-details/:${eventId}`, {
      method: "GET", headers: {
        "Content-Type": "application/json",
      }
    }).then(resp => resp.json())
      .then(data => {
        console.log('data--', data);
        setSuccess(data.isSuccess);
        if (data.isSuccess == true) {
          setEvent(data.events[0]);
          setItinerary(data.events[0]?.itinerary);
          setHighlights(data.events[0]?.highlights);
          setPickupPoints(data.events[0]?.pickupPoints);
          setThingsToCarry(data.events[0]?.thingsToCarry);
          setCostIncludes(data.events[0]?.costIncludes);
          setcurrentImages(data.events[0]?.images);
          console.log('event-%8', event);
        }
      });
  }

  const onDelete = async (data) => {
    let r = await fetch(`https://sahyadri-vacations.vercel.app/create-event/event-details/:${eventId}`,
      {
        method: "POST", headers: {
          "Content-Type": "application/json",
        }, body: JSON.stringify(data)
      })
    let res = await r.json()
    console.log('res --', JSON.stringify(res));
    if (res.isSuccess == true) {
      navigate('/all-events');
    }
    handleClose();
  }

  function getSubstring(string, char1, char2) {
    var array = string.slice(
      string.indexOf(char1) + 1,
      string.lastIndexOf(char2),
    ).split("$$");

    var filtered = array.filter(function (element) {
      return element != '';
    });
    console.log("filtered", filtered);
    return filtered;
  }

  const displayList = (data) => {
    var splitedList = data.replaceAll('<p class="ql-align-justify">', '<p class="ql-align-justify ql-p">');
    splitedList = splitedList.replaceAll('<ul>', '<ul class="display-bulletin">');
    splitedList = splitedList.replaceAll('<ol>', '<ol class="display-bulletin">');
    splitedList = splitedList.replaceAll('<p>', '<p class="ql-p">');
    return splitedList;
  }

  const addUploadedInages = () => {
    console.log('file', file);
    var allFiles = currentImages;
    if (file) {
      for (let index = 0; index < file.length; index++) {
        const url = URL.createObjectURL(file[index])
        console.log(url)
        allFiles.push(url);
      }
      console.log('allFiles', allFiles);
    }
    setcurrentImages(allFiles);
  }
  const handleUpload = async (data) => {
    console.log('data ===', data);
    console.log("costIncludes --> " + costIncludes);
    console.log("highlights --> " + highlights);
    console.log("itinerary --> " + itinerary);
    console.log("pickupPoints --> " + pickupPoints);
    console.log("thingsToCarry --> " + thingsToCarry);
    // fake request to upload file
    const url = `https://sahyadri-vacations.vercel.app/create-event/event-details/:${eventId}`;
    const formData = new FormData();
    if (file) {
      for (let index = 0; index < file.length; index++) {
        formData.append("file", file[index]);
      }
    }
    if (currentImages) {
      for (let index = 0; index < currentImages.length; index++) {
        formData.append("currentImages", currentImages[index])
      }
    }
    formData.append("costIncludes", costIncludes);
    formData.append("eventDetails", data.eventDetails);
    formData.append("eventName", data.eventName);
    formData.append("eventType", data.eventType);
    formData.append("highlights", highlights);
    formData.append("itinerary", itinerary);
    formData.append("pickupPoints", pickupPoints);
    formData.append("thingsToCarry", thingsToCarry);
    console.log('formData ===', formData);
    //Assuming you only accept one file     
    // console.log("file logging drop/selected file", JSON.stringify(formData));
    let r = await fetch(url, {
      method: "PUT",
      body: formData,
    })
    let res = await r.json()
    console.log('res ===', res.events[0]);
    if (res.isSuccess == true) {
      setEditable(false);
      setEvent(res.events[0]);
    }

  };

  return (
    <div>
      <AdminNavbar />
      {!isEditable && isSuccess &&
        <div className="container">
          <div className="title-header">Event Details</div>
          <div className="button-container">
            <div className="button">
              <input type="submit" value="Edit" onClick={() => {
                console.log('click');
                setEditable(true)
              }} />
              <input type="submit" value="Delete" onClick={handleShow} />

              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>

                </Modal.Header>
                <Modal.Body> <center><div>Do you want to delete event ?</div></center></Modal.Body>
                <Modal.Footer>
                  <div className="button-edit-container">
                    <div className="button">
                      <input type="submit" value=" Delete " onClick={handleSubmit(onDelete)} />
                      <input type="submit" value=" Cancel " onClick={handleClose} />
                    </div>
                  </div>
                </Modal.Footer>
              </Modal>
            </div>
            {
              <div className="content">
                <div className="user-details">
                  <div className="input-box ">
                    <span className="details">Event Name</span>
                    <div>{event.name}</div>
                  </div>
                  <div className="input-box ">
                    <span className="details">Event Type</span>
                    <div>{event.eventType}</div>
                  </div>
                  <div className="input-select-box ">
                    <span className="details">Event Details</span>
                    <div>{event.eventDetails}</div>
                  </div>
                  <div className="input-select-box">
                    <span className="details">Itinerary</span>
                    <div>
                      <div dangerouslySetInnerHTML={{ __html: displayList(event.itinerary) }} />

                      <div className='note'><div className='thicker'>Note : </div>
                        Above mentioned timings are tentative, It may vary according to situation.
                      </div>
                    </div>
                  </div>
                  <div className="input-select-box">
                    <span className="details">Highlights</span>
                    <div dangerouslySetInnerHTML={{ __html: displayList(event.highlights) }} />
                  </div>
                  <div className="input-select-box">
                    <span className="details">Cost Includes</span>
                    <div dangerouslySetInnerHTML={{ __html: displayList(event.costIncludes) }} />
                  </div>
                  <div className="input-select-box">
                    <span className="details">Things To Carry</span>
                    <div dangerouslySetInnerHTML={{ __html: displayList(event.thingsToCarry) }} />
                  </div>
                  <div className="input-select-box">
                    <span className="details">Pickup Points</span>
                    <div dangerouslySetInnerHTML={{ __html: displayList(event.pickupPoints) }} />
                  </div>
                </div>
                <div >
                  <div className='image-font'>
                    Images
                  </div>
                  <ul >
                    {currentImages.map(file => (
                      <li className="image-display" key={file} >
                        <img
                          src={file}
                          width="200vh"
                          height="250vh"
                          onLoad={() => {
                            URL.revokeObjectURL(file)
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            }
          </div>
        </div>
      }
      {
        isEditable && isSuccess &&
        <form action="" onSubmit={handleSubmit(handleUpload)}>
          <div className="container">
            <div className="title-header">Event Details</div>
            <div className="content">
              {isSubmitting && <div>Loading...</div>}
              <div className="user-details">
                <div className="input-box ">
                  <span className="details">Event Name</span>
                  <input value={event.name} {...register("eventName", { required: { value: true, message: "This field is required" }, })} type="text" required />
                </div>
                <div className="input-box ">
                  <span className="details">Event Type</span>
                  <select  {...register("eventType", { required: { value: true, message: "This field is required" }, })} >
                    <option value={"TrekEvent"} >Trekking Event</option>
                    <option value={"CampingEvent"}>Camping Event</option>
                    <option value={"BackPackingTrip"} >BackPacking Trip</option>
                  </select>
                </div>
                <div className="input-select-box ">
                  <span className="details">Event Details</span>
                  <textarea defaultValue={event.eventDetails}   {...register("eventDetails", { required: { value: true, message: "This field is required" }, })} type="text" required />
                </div>
                <div className="input-select-box">
                  <span className="details">Itinerary</span>
                  <Editor value={itinerary} sendDataToParent={setItinerary} />
                </div>
                <div className="input-select-box">
                  <span className="details">Highlights</span>
                  <Editor value={highlights} sendDataToParent={setHighlights} />
                </div>
                <div className="input-select-box">
                  <span className="details">Cost Includes</span>
                  <Editor value={costIncludes} sendDataToParent={setCostIncludes} />
                </div>
                <div className="input-select-box">
                  <span className="details">Things To Carry</span>
                  <Editor value={thingsToCarry} sendDataToParent={setThingsToCarry} />
                </div>
                <div className="input-select-box">
                  <span className="details">Pickup Points</span>
                  <Editor value={pickupPoints} sendDataToParent={setPickupPoints} />
                </div>
                <div className="input-box">
                  <span className="details">Upload Images</span>
                  <div className="dropzon">
                    <Dropzone onDrop={files => {
                      setFiles(files);
                      addUploadedInages();
                    }}>
                      {({ getRootProps, getInputProps }) => (
                        <div className="container">
                          <div
                            {...getRootProps({
                              className: 'dropzone',
                              onDrop: event => event.stopPropagation()
                            })}
                          >
                            <input {...getInputProps()} />
                            <div>Drag 'n' drop some files here, or click to select files</div>
                          </div>
                        </div>
                      )}
                    </Dropzone>
                  </div>

                </div>

              </div>
              <div >
                <div className='image-font'>
                  Images
                </div>
                <ul >
                  {currentImages.map(file => (
                    <li className="image-display" key={file} >
                      <div
                        className='close-button'
                        onClick={() => removeFile(file)}                        >
                        <span className="close">&times;</span>
                      </div>
                      <img
                        src={file}
                        width="200vh"
                        height="250vh"
                        onLoad={() => {
                          URL.revokeObjectURL(file)
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="button-edit-container">
              <div className="button">
                <input disabled={isSubmitting} type="submit" value="Update" />
                <input disabled={isSubmitting} type="submit" value="Cancel" onClick={() => setEditable(false)} />
              </div>
            </div>
          </div>
        </form>
      }
    </div >
  )
}

export default EventDetails
