import app from "./app";

const PORT = process.env.PORT || 3000;

async function main() {
    try {

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("An error occurred:", error);
        process.exit(1);
    }
}

main();