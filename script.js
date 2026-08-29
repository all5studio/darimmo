async function loadProperties() {
    const { data, error } = await supabaseClient
        .from("properties")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.error("Supabase error:", JSON.stringify(error, null, 2));
        return;
    }

    const { data: images, error: imagesError } = await supabaseClient
        .from("property_images")
        .select("property_id, image_url");

    if (imagesError) {
        console.error("Images error:", JSON.stringify(imagesError, null, 2));
    }

    const grid = document.getElementById("property-grid");
    grid.innerHTML = "";

    data.forEach(property => {
        const card = document.createElement("article");

        card.className = "property-card";
        card.dataset.city = property.city;
        card.dataset.type = property.transaction_type;

        const propertyImage = images?.find(
            img => Number(img.property_id) === Number(property.id)
        );

        const imageHTML = propertyImage?.image_url
            ? `<img src="${propertyImage.image_url}" alt="${property.title}" style="width:100%;height:100%;object-fit:cover;">`
            : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#e2e8f0;font-size:60px;">🏠</div>`;

        card.innerHTML = `
            <div class="property-image">
                ${imageHTML}

                <span class="status ${
                    property.transaction_type === "rent" ? "rent" : ""
                }">
                    ${
                        property.transaction_type === "rent"
                            ? "للكراء"
                            : "للبيع"
                    }
                </span>
            </div>

            <div class="property-content">
                <p class="type">${property.property_type}</p>

                <h3>${property.title}</h3>

                <p class="location">
                    📍 ${property.city}
                </p>

                <div class="details">
                    <span>🛏 ${property.bedrooms || 0} غرف</span>
                    <span>🚿 ${property.bathrooms || 0} حمام</span>
                    <span>📐 ${property.surface || 0} م²</span>
                </div>

                <div class="price">
                    ${Number(property.price).toLocaleString("fr-FR")} DH
                </div>

<button class="details-btn" data-id="${property.id}">
    مشاهدة التفاصيل
</button>
            </div>
        `;

        grid.appendChild(card);

        card.querySelector(".details-btn").addEventListener("click", () => {
    window.location.href = `details.html?id=${property.id}`;
});

    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadProperties();
});