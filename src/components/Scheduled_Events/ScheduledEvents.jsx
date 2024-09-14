import React, { useEffect, useState, useContext } from 'react'
import AdminNavbar from "../AdminDashboard/AdminDashboard";
import { useNavigate } from "react-router-dom";
import '../ShowAllEvents/Events.css'
const ScheduledEvents = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [isSuccess, setSuccess] = useState(false);
    const [events, setEvent] = useState();
    useEffect(() => {

        if (isSuccess == false) {
            getAllRecord();
        }
    })
    const getNextBatchDate = (event) => {

        var liveEvent = '';
        let batchdate = '';
        let eventCostPerPerson;
         console.log('event------',event);
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        for (let i = 0; i < event.batches.length; i++) {
            if (event.batches[i].everyWeekend == true) {
                batchdate = 'Available On All Weekends';
                eventCostPerPerson = event.batches[i].eventCostPerPerson;
            } else if (event.batches[i].notScheduleYet == true) {
                batchdate = 'On Public Demand';
                eventCostPerPerson = event.batches[i].eventCostPerPerson;
            } else {

                batchdate = batchdate + new Date(event.batches[i].eventStartDate).getDate() + ' ' + months[new Date(event.batches[i].eventStartDate).getMonth()] + ' ' + new Date(event.batches[i].eventStartDate).getFullYear() + ' - ' + new Date(event.batches[i].eventEndDate).getDate() + ' ' + months[new Date(event.batches[i].eventEndDate).getMonth()] + ' ' + new Date(event.batches[i].eventEndDate).getFullYear() + ' | ';
                eventCostPerPerson = event.batches[i].eventCostPerPerson;
                console.log('batchdate --', batchdate);
            }
        }

        if (batchdate && eventCostPerPerson) {
            liveEvent = {
                eventId: event.eventId,
                eventname: event.eventname,
                eventType: event.eventType,
                url: event.Url.replace('/event-details', '/scheduled-event-details'),
                status: event.active.toString().toUpperCase(),
                images: event.images,
                batchdate: batchdate,
                eventCostPerPerson: eventCostPerPerson,

            }
        }
        //  console.log('liveEvent==', liveEvent);
        return liveEvent;
    }
    const getAllRecord = async () => {
        let liveEvents = [];
        let r = await fetch(`${apiUrl}scheduled-events`, {
            method: "GET", headers: {
                "Content-Type": "application/json",
            }
        })
        let res = await r.json()

        if (res.isSuccess == true) {
            setSuccess(true);
            for (let i = 0; i < res.events.length; i++) {
                if (getNextBatchDate(res.events[i]) != '') {
                    liveEvents.push(getNextBatchDate(res.events[i]));
                }
            }
            setEvent(liveEvents);
        }
    }
    const navigate = useNavigate();
    return (
        <div>
            <AdminNavbar />
            <div className="scheduled-contentbody contentbody">
                <div className="container justify-content-center py-md-5">
                    <h1><b>All Scheduled Events</b></h1>
                    <div className="row justify-content- py-4" >

                        {isSuccess && events.map((event, index) => (
                            <>
                                <div className="event-card card all-events-card">
                                    <a onClick={() => navigate(event.url)}>
                                        <img className="event-card-image" src={event.images} alt="Avatar" width="100%" />
                                        <div className="event-card-container">
                                            <h2 className='all-event-header event-card-header bg-transparent'><b>{event.eventname}</b></h2>
                                            <div className='all-event-card-footer event-card-footer'>
                                                <div> Status : {event.status}</div>
                                                <div >{event.batchdate}</div>
                                                <div ><strong className='price'>₹{event.eventCostPerPerson} </strong><i>per person</i></div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ScheduledEvents
