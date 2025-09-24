export const SelectTravelsList = [
    {
        id:1,
        title: 'Just Me',
        desc: 'A sole traveles in exploration',
        icon: '+',
        people: '1'
    },
    {
        id:2,
        title: 'A Couple',
        desc: 'Two traveles in tandem',
        icon: '🍷',
        people: '2 people'    
    },
    {
        id:3,
        title: 'Family',
        desc: 'A group of fun loving adv',
        icon: '🏠',
        people: '3 to 5 people' 
    },
     {
        id:4,
        title: 'Friends',
        desc: 'A bunch of like-minded ppl',
        icon: '😎',
        people: '3 to 5 people' 
    },
]


export const SelectBudgetOptions=[
    {
        id:1,
        title: 'Cheap',
        desc: 'Stay conscious of costs',
        icon:'🪙',
    },
    {
        id:2,
        title: 'Moderate',
        desc: 'Keep cost on the average side',
        icon:'💵',
    },
    {
        id: 3,
        title: 'Luxury',
        desc: 'Dont worry about cost',
        icon:'💎',
    }
]


export const AI_PROMPT = `
You are a travel concierge. Plan a {days}-day trip to {destinationLabel} for {travelWith} with a {budget} budget.

Include:
1) 5 to 8 hotel options that fit {travelWith} and {budget}. For each: name, area/neighbourhood, starRating, priceRangeSGD, roomType, whyGoodFor (tie to {travelWith}), walkToTransitMins, cancellation, bookingNotes.
2) Daily plan (morning/afternoon/evening) clustered by area to reduce travel time, with food picks matched to {budget}, +1 rain-friendly backup per day.
3) Tips and rough total budget in SGD.
4) Include Place image URL, GeoCoordinates
5) Exact Pricing
6) Include Exact Location of the Hotel
Remember to give the output in JSON Format.`