import axios from "axios";

export async function getCoordinatesFromAddress(address) {
    const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );
    if (response.data.length > 0) {
        console.log(response.data[0]);
        return {
            latitude: response.data[0].lat,
            longitude: response.data[0].lon,
        };
    } else {
        throw new Error('Endereço não encontrado');
    }
}
