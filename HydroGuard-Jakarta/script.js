/* ===================================================
   HYDROGUARD JAKARTA
   SCRIPT.JS

   Fitur:
   1. Dark Mode
   2. Counter Animation
   3. Integrasi OpenRouter AI
   4. Loading Animation
   5. Validasi Input

=================================================== */


/* ===========================
   DARK MODE
=========================== */

const darkBtn = document.getElementById("darkModeBtn");

darkBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});


/* ===========================
   COUNTER ANIMATION
=========================== */

function animateCounter(id, target) {

    let count = 0;

    const speed = Math.ceil(target / 60);

    const counter = document.getElementById(id);

    const interval = setInterval(() => {

        count += speed;

        if (count >= target) {
            count = target;
            clearInterval(interval);
        }

        counter.innerText = count;

    }, 30);

}

window.addEventListener("load", () => {

    animateCounter("counter1", 120);
    animateCounter("counter2", 13);
    animateCounter("counter3", 3);

});


/* ===========================
   OPENROUTER API
=========================== */

/*
Masukkan API Key OpenRouter di bawah ini.
*/

const API_KEY = "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";

const analyzeBtn = document.getElementById("analyzeBtn");
const input = document.getElementById("userInput");
const result = document.getElementById("result");
const loading = document.getElementById("loading");


analyzeBtn.addEventListener("click", async () => {

    const text = input.value.trim();

    if (text === "") {
        alert("Silakan masukkan kondisi sungai terlebih dahulu.");
        return;
    }

    loading.style.display = "block";
    result.innerHTML = "";

    const prompt = `
Anda adalah AI HydroGuard Jakarta.

Analisis laporan warga mengenai kondisi sungai.

Tentukan salah satu status berikut:

🟢 SAFE
🟡 WARNING
🔴 CRITICAL

Berikan:

1. Status
2. Alasan
3. Maksimal 3 rekomendasi tindakan

Gunakan bahasa Indonesia yang jelas dan mudah dipahami.

Laporan warga:

${text}
`;

    try {

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {

            method: "POST",

            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": window.location.origin,
                "X-Title": "HydroGuard Jakarta"
            },

            body: JSON.stringify({

                model: "openai/gpt-oss-20b:free",

                messages: [
                    {
                        role: "system",
                        content: "Kamu adalah AI HydroGuard Jakarta yang membantu masyarakat menganalisis kondisi sungai dan risiko banjir."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ]

            })

        });

        const data = await response.json();

        console.log(data);

        loading.style.display = "none";

        if (!response.ok) {
            result.innerHTML = "❌ Error: " + (data.error?.message || "Terjadi kesalahan.");
            return;
        }

        if (data.choices && data.choices.length > 0) {

            result.innerHTML = data.choices[0].message.content;

        } else {

            result.innerHTML = "AI tidak memberikan respons.";

        }

    } catch (error) {

        loading.style.display = "none";

        console.error(error);

        result.innerHTML = "Terjadi kesalahan saat menghubungi AI.";

    }

});