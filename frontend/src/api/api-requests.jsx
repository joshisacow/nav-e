import config from '../../config.json';

//TODO: check userID, generate tripID

export const postTrip = async (trip) => {
    console.log(JSON.stringify({"trip": trip}))
    const response = await fetch(config.baseURL + "trips/1", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"trip": trip})
    });
    const data = await response.json();
    console.log(data);
}

export const getAddrDetails = async (address) => {
    const response = await fetch(
        config.baseURL + "place?" + new URLSearchParams({
            "placeID": address
        }), 
        {
            method: "GET"
        }
    );
    const data = await response.json();
    console.log(data);
    return data;
}

export const optimizeRoute = async (trip) => {
    if (trip.length < 3) {
        throw new Error("add more locations to optimize route!");
    }
    const response = await fetch(config.testURL + "route", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"trip": trip})
    });
    const data = await response.json();
    console.log(data);
    return data;
}