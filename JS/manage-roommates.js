const openButton = document.getElementById("openRoommateModal");
const closeButton = document.getElementById("closeBtn");
const modalOverlay = document.getElementById("modalOverlay");
const roommateForm = document.getElementById("roommateForm");
const submitButton = document.getElementById("submit-button"); 
const notifier = document.getElementById("notifier"); 
const firstNameLabel = document.getElementById("roommateFirstName");
const lastNameLabel = document.getElementById("roommateLastName");
const emailLabel = document.getElementById("roommateEmail");
const phoneLabel = document.getElementById("roommatePhoneNumber");


openButton.addEventListener("click", openModal);
closeButton.addEventListener("click", closeModal);

roommateForm.addEventListener("submit", handleSubmitForm);

// here's for closing the modal when you are click outside the form
modalOverlay.addEventListener("click", (event) => {
    if(event.target === modalOverlay)
        closeModal();
});

function openModal() {
    modalOverlay.style.display = "flex";
}

function closeModal() {
    modalOverlay.style.display = "none";
}

function handleSubmitForm(event) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(roommateForm);
    const {isError, message} = validateInput(formData);

    if (isError) {
        setNotifier(message, true);
        setLoading(false);
        return;
    }

    createRoommate(formData);

    setLoading(false);
}

function createRoommate(roommateData) 
{
    fetch('http://localhost:8080/api/user/register', 
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "firstname": roommateData.get("firstname"),
            "lastname": roommateData.get("lastname"),
            "email": roommateData.get("email"),
            "phonenumber": roommateData.get("phoneNumber"),
        })
    })
        .then(response => {
            if (!response.ok) throw new Error('Error: network error');
            roommateForm.reset();
            setNotifier("Success: The roommate has been created.", false);
        })
        .catch(error =>
            setNotifier("Error: " + error, true));
}

function validateInput(formData) {
    let errorCounter = 0;
    let errorMessage = [];

    if (!formData.get("firstname") || formData.get("firstname").length < 1) {
        errorMessage.push("The firstname is required");
        errorCounter++;
    }

    if (!formData.get("lastname") || formData.get("lastname").length < 1) {
        errorMessage.push("The lastname is required");
        errorCounter++;
    }

    if (!formData.get("email") || formData.get("email").length < 10) {
        errorMessage.push("The email is required or has to be at least 10 characters long.");
        errorCounter++;
    }

    if (!formData.get("phoneNumber") || formData.get("phoneNumber").length < 8) {
        errorMessage.push("A phoneNumber is required or the email needs to have at least 8 numbers.");
        errorCounter++;
    }

    return {
        isError: errorCounter > 0,
        message: "Error: " + errorMessage.join("\n")
    };
}

function setNotifier(message, isError) {
    notifier.innerText = message;
    notifier.style.color = isError ? "red" : "green";
}

function setLoading(isLoading) {
    if (isLoading) {
        submitButton.innerText = "Loading...";
        submitButton.disabled = true;
    } else {
        submitButton.innerText = "Roommate created !";
        submitButton.disabled = false;
        setTimeout(() => 
        {
            submitButton.innerText = "Confirm the creation";
            submitButton.disabled = false;
            notifier.innerText = "";
        }, 5000);
    }
}




function setConditions()
{
    // fn = first name, ln = last name, pn = phone number.
    const fn = document.getElementById("fnCondition");
    const ln = document.getElementById("lnCondition");
    const pn = document.getElementById("pnCondition");
    const emailLength = document.getElementById("emailLength");
    const emailFormat = document.getElementById("emailFormat");
    const domainEmailCheck = document.getElementById("domainEmailCheck");
    const checkAt = document.getElementById("checkAt");

    firstNameLabel.addEventListener("input", (e) => {
        const validation = e.target.value.trim().length;
        fn.classList.toggle("valid", validation);
    });

    lastNameLabel.addEventListener("input", (e) =>{
        const validation = e.target.value.trim().length;
        ln.classList.toggle("valid", validation)
    });

    phoneLabel.addEventListener("input", (e) => {
        const validation = e.target.value.trim().length >= 8;
        pn.classList.toggle("valid", validation);
    });

    roommateEmail.addEventListener("input", (e) => 
    {
        const validation = e.target.value.trim().length >= 10 && e.target.value.trim().length <= 64;
        emailLength.classList.toggle("valid", validation);
    });

    roommateEmail.addEventListener("input", (e) => {
        const input = e.target.value.trim();
        const regex = /^[A-Za-z0-9.\\_\\-\\@]*$/;
        const validation = regex.test(input);

        console.log(input);
        console.log(validation);

        emailFormat.classList.toggle("valid", validation);
    });

    roommateEmail.addEventListener("input", (e) => {
        const input = e.target.value.trim();
        const regex = /[.]{1,1}[a-z]{2,}$/;
        const validation = regex.test(input);

        console.log(input);
        console.log(validation);

        domainEmailCheck.classList.toggle("valid", validation);
    });

    roommateEmail.addEventListener("input", (e) => {
        const input = e.target.value.trim();
        const regex = /@/
        const validation = regex.test(input);

        checkAt.classList.toggle("valid", validation);
    });

}

setConditions();
