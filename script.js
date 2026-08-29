async function loadProperties() {
const { data, error } = await supabaseClient
    .from("properties")
.select("*")
    .order("id", { ascending: false });

    if (error) {
       console.error("Supabase error:", JSON.stringify(error, null, 2));
        return;
    }

    const grid = document.getElementById("property-grid");

    grid.innerHTML = "";

    data.forEach(property => {
        const card = document.createElement("article");

        card.className = "property-card";

        card.dataset.city = property.city;
        card.dataset.type = property.transaction_type;

        card.innerHTML = `
            <div class="property-image">
                <img 
    src="${
        property.property_images?.[0]?.image_url || ""
    }"
    alt="${property.title}"
    style="width:100%;height:100%;object-fit:cover;"
    onerror="this.style.display='none';"
/>

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

                <p class="type">
                    ${property.property_type}
                </p>

                <h3>
                    ${property.title}
                </h3>

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

                <button class="details-btn">
                    مشاهدة التفاصيل
                </button>

            </div>
        `;

        grid.appendChild(card);
    });
}


document.addEventListener("DOMContentLoaded", () => {
    loadProperties();
});