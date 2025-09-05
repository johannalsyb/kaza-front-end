export interface AvailableSlot {
    id: string
    dateFrom: string
    dateTo: string
}

export type PublicProperty = {
    id: string,
    name: string,
    amenities: string,
    attractiveness: number,
    images: string,
    primaryImage: string,
    description: string,
    flatmates: number,
    country: string,
    region: string | null,
    city: string,
    bathrooms: number,
    bedrooms: number,
    beds: number,
    pets: boolean,
    sizeM2: number,
    approxLat: number,
    approxLon: number,
    type: string,
    smokingAllowed: boolean,
    childrenAllowed: boolean,
    bedArrangements: string,
    availableSlots: AvailableSlot[]
}

export type Property = PublicProperty & {
    owner: string,
    type: string,
    dateDuration: string,
    datePreference: string,
    dateRanges: string,
    address: string,
    lat: number,
    lon: number,
    private: boolean,
    verified: boolean,
    createdAt: string,
    updatedAt: string,
    createdDate: string,
    availableDates: {
        id: number,
        value: string[]
    }[]
    availableSlots: AvailableSlot[]
}

export default Property