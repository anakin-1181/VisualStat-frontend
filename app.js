const displayImage = async(params) => {
    try {
        const  response = await fetch(
            "https://visualstat-backend.onrender.com/plot_distribution",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(params)
            }
            );
        if (!response.ok) {
            throw new Error("HTTP status code is " + response.statusText);
        }

        const blob = await response.blob();
        document.getElementById("graph").src = URL.createObjectURL(blob);
        console.log(URL.createObjectURL(blob));
    }
    catch (error) {
        console.error("Failed to load image", error);
    }
}

const healthCheck = async () => {
    const  response = await fetch("https://visualstat-backend.onrender.com/")
    if (!response.ok) {
        throw new Error("HTTP status code is " + response.statusText);
    }
    const data = await response.json();
    const key = Object.keys(data)[0]
    alert(`${key} ${data[key]}`);

}

// Heath check
const healthButton = document.getElementById("healthCheck");
healthButton.addEventListener("click", async function() {
    try {
        await healthCheck();
    }
    catch (error) {
        console.error("Failed to load health check", error);
    }
})

// Generate Uniform Distribution
const uniformButton = document.getElementById("uniform");
const uniformParams = {
    "distribution": "uniform",
    "size": 10000,
    "show_mean": true,
    "low": 0,
    "high": 1
}
uniformButton.addEventListener("click", async () => {
    try {
        await displayImage(uniformParams);
    }
    catch (error) {
        console.error("Failed to load image", error);
    }
})

// Generate Uniform Distribution
const binomButton = document.getElementById("binom");
const binomParams = {
    "distribution": "binomial",
    "size": 10000,
    "show_mean": true,
    "n": 100,
    "p": 0.5
}
binomButton.addEventListener("click", async () => {
    try {
        await displayImage(binomParams);
    }
    catch (error) {
        console.error("Failed to load image", error);
    }
})

// Download Image
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


