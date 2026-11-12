import {getApiUrl} from "./api.js";

export async function updatePassword(roommateData)
{
    try
    {
        const response = await fetch(getApiUrl('/user'),
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstname: roommateData.firstname,
                    lastname: roommateData.lastname,
                    email: roommateData.email,
                    phonenumber: roommateData.phonenumber,
                    rawPassword: roommateData.rawPassword,
                })
            });

        if(!response.ok)
        {
            console.error("Error from the backend : failed to get a response.");
        }

        return await response.json();

    }
    catch(error)
    {
        console.error(error)
    }
}