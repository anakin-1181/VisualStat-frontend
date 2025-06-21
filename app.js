const displayImage = async (params) => {
    try {
        const response = await fetch(
            "https://visualstat-backend.onrender.com/plot_distribution",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(params),
            }
        );
        if (!response.ok) throw new Error("HTTP status code is " + response.statusText);

        const blob = await response.blob();
        document.getElementById("graph").src = URL.createObjectURL(blob);
    } catch (error) {
        console.error("Failed to load image", error);
    }
};

// Elements
const distributionSelect = document.getElementById("distribution-select");
const param1Input = document.getElementById("param1");
const param2Input = document.getElementById("param2");
const sizeInput   = document.getElementById("size-input");
const generateBtn = document.getElementById("generate");

// Update placeholders when distribution type changes
const updatePlaceholders = () => {
    if (distributionSelect.value === "uniform") {
        param1Input.placeholder = "a =";
        param2Input.placeholder = "b =";
    } else {
        param1Input.placeholder = "n =";
        param2Input.placeholder = "p =";
    }
};
distributionSelect.addEventListener("change", updatePlaceholders);

// Initialize placeholders on page load
updatePlaceholders();

// Generate listener
generateBtn.addEventListener("click", async () => {
    const dist = distributionSelect.value;
    const size = parseInt(sizeInput.value, 10);
    let params = { distribution: dist, size, show_mean: true };

    if (dist === "uniform") {
        params.low  = parseFloat(param1Input.value);
        params.high = parseFloat(param2Input.value);
    } else {
        params.n = parseInt(param1Input.value, 10);
        params.p = parseFloat(param2Input.value);
    }

    try {
        await displayImage(params);
    } catch (error) {
        console.error("Error generating distribution:", error);
    }
});

// Download ImageAdd commentMore actions
document.getElementById("download").addEventListener("click", () => {
    const img = document.getElementById("graph");
    const imageUrl = img.src;

    if (!(img.complete && img.naturalWidth > 0)) {
        alert("Please generate a distribution image!");
        return;
    }

    // Optional: auto-generate filename from URL or timestamp
    const filename = "downloaded_image.png";

    fetch(imageUrl)
        .then(res => res.blob())
        .then(blob => {
            const link = document.createElement("a");
            const objectURL = URL.createObjectURL(blob);
            link.href = objectURL;
            link.download = filename;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(objectURL);
        })
        .catch(err => {
            console.error("Image download failed:", err);
            alert("Failed to download image.");
        });
});

const healthCheck = async () => {
    const  response = await fetch("https://visualstat-backend.onrender.com/")
    if (!response.ok) {
        throw new Error("HTTP status code is " + response.statusText);
    }
    const data = await response.json();
    const key = Object.keys(data)[0]
    alert(`${key} ${data[key]}`);
    console.log(`${key} ${data[key]}`);
    return `${key} ${data[key]}`

}

const healthButton = document.getElementById("healthCheck");
healthButton.addEventListener("click", async function() {
    try {
        await healthCheck();
    }
    catch (error) {
        console.error("Failed to load health check", error);
    }
})
