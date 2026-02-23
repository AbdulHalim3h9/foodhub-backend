import app from "./app";

const PORT = process.env.PORT || 5000;

async function main() {
    try {

        app.listen(PORT, () => {
            console.log(`🍱 FoodHub Backend is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("An error occurred:", error);
        process.exit(1);
    }
}

main();