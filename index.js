// Function to navigate to the home page
function goToHome() {
    window.location.href = 'index.html';
}

//  Async function to fetch solar system key data 
async function fetchSolariskeys() {
    try{
        const resp = await fetch("https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys", {
        method: "POST"
    });
    
    const apiKeys = await resp.json();
    return apiKeys.key;

    } catch (error) {
        console.log(error);
    }
};

//  Async function to fetch solar system bodies data from the API
async function fetchSolarisBodies() {

    try {
        const key = await fetchSolariskeys();
        const response = await fetch("https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies", {
            method: "GET",
            headers: {
                "x-zocom": key,
            }
        });

        // Parsing the JSON response
        const data = await response.json();
        console.log(data.bodies);

        // Storing the data in a global variable
        window.solarisData = data;

        // Handling errors if the response is not successful
        if (!response.ok) {
            console.error('Error:', response.status, response.statusText);
            throw new Error('Network response was not ok');
        } 
    } catch (error) {
        console.log(error);
    }
}

// Function to find a solar system object by name
function findObjectByName(data, name) {
    const result = data.bodies;
    for (let i = 0; i < result.length; i++) {
        if (result[i].name === name) {
            return result[i];
        }
    }
    return null;
}

// Function to display content for a specific solar system object
function showContent(objectName) {
    const object = findObjectByName(window.solarisData, objectName);
    const contentContainer = document.getElementById('contentContainer');

    // Clear the content of the container
    contentContainer.innerHTML = '';

    if (object) {
        // Displaying detailed content in a dialog
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('contentDetails');
        contentDiv.innerHTML = `
        <div class="dialog-container">
            <dialog open class="contentDetails">
            <button type="reset" class="custom-btn btn-1" onclick="goToHome()">Back</button>
                <div class="details_header">
                    <h1>${object.name}</h1>
                    <h2>${object.latinName}</h2>
                </div>
                
                <p>desc ${object.desc}</p>
                <hr>
                <div class="details_Items">
                    <p>rotation : <br>${object.rotation}</p>
                    <p>Temp of Day : <br>${object.temp.day}</p>
                    <p>Type : <br>${object.type}</p>
                    <p>circumference : <br>${object.circumference}</p>
                    <p>distance : <br>${object.distance}</p>
                    <p>orbitalPeriod : <br>${object.orbitalPeriod}</p>
                    <p class="item_moon">moons : <br>${object.moons} empty</p>
                </div>
                <div id="containerLogo">
                    <img id="logo" src="img/logo.webp">
                </div>
            </dialog>
        </div>
        `;
        // Appends the detailed content div to the content container in the HTML document
        contentContainer.appendChild(contentDiv);
    } else {
        // Display a message if the object is not found
        const notFoundDiv = document.createElement('div');
        notFoundDiv.textContent = `${objectName} not found`;
        contentContainer.appendChild(notFoundDiv);
        console.log(`${objectName} not found`);
    }
}
// Fetch solar system bodies data when the script is loaded
fetchSolarisBodies();