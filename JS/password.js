import {getApiUrl} from "./api.js";

export async function updatePassword(email, oldPassword, newPassword)
{
    if (!email || !oldPassword || !newPassword)
        return {ok: false, status: 400, message: "All fields are required"};

    try
    {
        const response = await fetch(getApiUrl('/api/user/newPassword'),
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                })
            });

        const message = await response.text();

        if (response.status === 404)
            return {ok: false, status: 404, message: "User not found"};

        return {ok: response.ok, status: response.status, message: message};
    }
    catch(error)
    {
        console.error(error);
        return {ok: false, status: 0, message: "Network error, please try again"};
    }
}