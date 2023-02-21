export interface Address{
    name?:String,
    door:String,

    city: String,
    state:String,
    country?:String,
    areaCode:String,
    pretty_address_text?:string
}
export interface Location{
    lat?:number,
    lon?:number
    delivery_radius?:number
}