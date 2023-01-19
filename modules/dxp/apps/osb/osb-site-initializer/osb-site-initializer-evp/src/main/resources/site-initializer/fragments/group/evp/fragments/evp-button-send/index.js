/*
const queryString = window.location.search;
const urlParams = queryString.split('=');
const requestId = urlParams[1];
const liferayUrl = window.location.origin;

const updateStatusToClose = async () => {

    const request = await fetch(`${liferayUrl}/o/c/evprequests/${requestId}`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'x-csrf-token': Liferay.authToken,
        },
    });

    const response = await request.json();

    const payload = {
        "requestStatus": {
            "key": "closed"
        },
        "requestType": {
            "key": `${response.requestType.key}`
        },
        "requestBehalf": {
            "key": `${response.requestBehalf.key}`
        },
        "requestPurposes": {
            "key": `${response.requestPurposes.key}`
        },
        "liferayBranch": {
            "key": `${response.liferayBranch.key}`
        }
    }
    await statusResponse(payload);

}
const statusResponse = async (payload) => {

    const response = await fetch(
        `${liferayUrl}/o/c/evprequests/${requestId}`,
        {
            body: payload,
            headers: {
                'content-type': 'application/json',
                'x-csrf-token': Liferay.authToken,
            },
            method: 'PATCH',
        }
    )
    return response;
}

const btnSend = document.querySelector(".btn-payment-submit");
btnSend.onClick = () => updateStatusToClose();

*/


//const btnSend = document.querySelector(".btn-payment-submit");

//document.getElementsByClassName("btn-payment-submit").addEventListener("click", updateStatusToClose);




const queryString = window.location.search;
const urlParams = queryString.split('=');
const requestId = urlParams[1];
const liferayUrl = window.location.origin;



const updateStatusToClose = async () => {

    const request = await fetch(`${liferayUrl}/o/c/evprequests/${requestId}`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'x-csrf-token': Liferay.authToken,
        },
    });

    const response = await request.json();

    const payload = {
        "requestStatus": {
            "key": "closed",
            "name": "Closed"
        },
        "requestType": {
            "key": `${response.requestType.key}`
        },
        "requestBehalf": {
            "key": `${response.requestBehalf.key}`
        },
        "requestPurposes": {
            "key": `${response.requestPurposes.key}`
        },
        "liferayBranch": {
            "key": `${response.liferayBranch.key}`
        }
    }
    payloadJson = await JSON.stringify(payload).json();
    statusResponse(payloadJson);

}
const statusResponse = async (payload) => {

    const response = await fetch(
        `${liferayUrl}/o/c/evprequests/${requestId}`,
        {
            body: {
                "requestStatus": {
                    "key": "closed",
                    "name": "Closed"
                }
            },
            headers: {
                'content-type': 'application/json',
                'x-csrf-token': Liferay.authToken,
            },
            method: 'PATCH',
        }
    )

    return response;

}

const btnSend = document.querySelector(".btn-payment-submit");
btnSend.addEventListener("click", updateStatusToClose);



//const btnSend = document.getElementsByClassName(".btn-payment-submit");
//btnSend.onClick = () => updateStatusToClose();



