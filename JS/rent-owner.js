import {getApiUrl} from "./api.js";

const rentTitle = document.getElementById("rent-title");
rentTitle.textContent = "All the rents for -> " + new Date().toLocaleDateString("en-GB", {month: "long", year: "numeric"});