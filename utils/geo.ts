export const getBrowserLocation = () => {
    return new Promise<PositionType>((resolve , reject) => {
        if('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos)=> {
                    const {latitude : lat, longitude : lng} = pos.coords
                    resolve({lat, lng})
                },
                () => {
                    reject({lat: 25, lng: 25})
                }
            )
        } else {
            reject({lat: 25, lng: 25})
        }
    })
}

export type PositionType = {
    lat: number
    lng: number
}