import config from '../../config.json';

export const getTrips = async (uid) => {
    const response = await fetch(config.baseURL + "trips/" + uid, {
        method: "GET"
    });
    if (response.status === 404) {
        return [];
    }
    const data = await response.json();
    console.log(data);
    return data;
}

export const postTrip = async (trip, uid) => {
    const response = await fetch(config.baseURL + "trips/" + uid, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"trip": trip})
    });
    const data = await response.json();
    console.log(data);
}

export const deleteTrip = async (uid, index) => {
    const response = await fetch(
        config.baseURL + "trips/" + uid + "?" + new URLSearchParams({
            "index": index
        }), 
        {method: "DELETE"});

    const data = await response.json();
    console.log(data);
}

export const getAddrDetails = async (address) => {
    const response = await fetch(
        config.baseURL + "place?" + new URLSearchParams({
            "placeID": address
        }), 
        {method: "GET"});

    const data = await response.json();
    console.log(data);
    return data;
}

export const optimizeRoute = async (trip) => {
    const response = await fetch(config.baseURL + "route", {
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



