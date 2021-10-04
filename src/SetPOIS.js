import "./App.css";

import 'leaflet/dist/leaflet.css'
import React, {useEffect, useState} from 'react'
import {db, COLLECTION_POIS} from "./App";

const EMPTY_POI = {name: '', description: '', latitude: '', longitude: '', url: ''}

export function SetPOIS(props) {


    let [newPOI, setNewPOI] = useState(EMPTY_POI)



    const addPOI = async (event) => {
        event.preventDefault();
        const poisCollection = await db.collection(COLLECTION_POIS);

        try {
            await poisCollection.add(newPOI);
        } catch (e) {
            console.error("Could not add new POI");
            console.error(e.stack)
        }

        resetNewPOI();
    };

    const handleFormInputChange = (event) => {

        const target = event.target;
        const value = target.value;
        const name = target.name;

        setNewPOI(newPOI => ({...newPOI, [name]: value}))
    };


    /* Reset the new book object */
    const resetNewPOI = () => {
        setNewPOI(EMPTY_POI);
    };


    return (

        <form onSubmit={addPOI} className="addPOI">
            <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                value={newPOI.name}
                onChange={handleFormInputChange}
            />
            <input
                type="text"
                id="description"
                name="description"
                placeholder="Description"
                value={newPOI.description}
                onChange={handleFormInputChange}
            />
            <input
                type="number"
                id="latitude"
                name="latitude"
                placeholder="Latitude"
                value={newPOI.latitude}
                onChange={handleFormInputChange}
            />
            <input
                type="number"
                id="longitude"
                name="longitude"
                placeholder="Longitude"
                value={newPOI.longitude}
                onChange={handleFormInputChange}
            />
            <input
                type="text"
                id="url"
                name="url"
                placeholder="QR-Code URL"
                value={newPOI.url}
                onChange={handleFormInputChange}
            />
            <button type="submit">Add POI</button>
        </form>)

    {/*{/!* Render a list of Book components, with no bullet points *!/}
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {/!* The "map" function iterates over the array of books *!/}
                    {/!* and returns a list item with a Book component for   *!/}
                    {/!* each book in the books array.                       *!/}
                    {/!* The books now come from the state                   *!/}
                    {this.state.books.map((book, index) => (
                        /!*
                        The key of the list item is currently just the index of
                        the book in the array (0, 1, 2,...), as we do not have
                        a unique ID for each book available so far.
                         *!/
                        <li key={index}>
                            {/!* The object spread syntax is used here in order to   *!/}
                            {/!* map the properties of each book object to the props *!/}
                            {/!* of the Book component directly.                     *!/}
                            <Book {...book} />
                        </li>
                    ))}
                </ul>*/


    }}



