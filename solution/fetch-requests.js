const getRocketsData = async () => {
    const response = await fetch('https://api.spacexdata.com/v2/rockets');
    const data = await response.json()
    return data;
}

export {getRocketsData};