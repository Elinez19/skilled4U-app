export interface LocationResult {
  place_id: string | number;
  display_name: string;
  place_name?: string;
  short_name?: string;
  context_label?: string;
  lat: string;
  lon: string;
}

export type MapLayerType = "streets" | "detailed" | "satellite";

export interface SelectedMapCoords {
  lat: number;
  lon: number;
  areaLabel: string;
}

export const DEFAULT_MAP_COORDS: SelectedMapCoords = {
  lat: 9.0765,
  lon: 7.4765,
  areaLabel: "Wuse 2, Abuja",
};

// Popular Nigerian neighborhoods & landmarks for instant zero-latency search + offline support
export const PRESET_PLACES: LocationResult[] = [
  {
    place_id: "osm.wuse2",
    short_name: "Wuse 2, Abuja",
    display_name: "Adetokunbo Ademola Crescent, Wuse 2, Abuja, FCT",
    context_label: "Wuse 2, Abuja Municipal, FCT, Nigeria",
    lat: "9.0765",
    lon: "7.4765",
  },
  {
    place_id: "osm.wuye",
    short_name: "Wuye District, Abuja",
    display_name: "Wuye District, Abuja Municipal, FCT, Nigeria",
    context_label: "Abuja Municipal, Federal Capital Territory, Nigeria",
    lat: "9.0563",
    lon: "7.4298",
  },
  {
    place_id: "osm.gwarinpa",
    short_name: "3rd Avenue, Gwarinpa",
    display_name: "3rd Avenue, Gwarinpa, Abuja, FCT",
    context_label: "Gwarinpa, Abuja, Federal Capital Territory, Nigeria",
    lat: "9.1099",
    lon: "7.4042",
  },
  {
    place_id: "osm.maitama",
    short_name: "Maitama District, Abuja",
    display_name: "Aguiyi Ironsi Street, Maitama, Abuja, FCT",
    context_label: "Maitama, Abuja, Federal Capital Territory, Nigeria",
    lat: "9.0882",
    lon: "7.4934",
  },
  {
    place_id: "osm.lekki",
    short_name: "Lekki Phase 1, Lagos",
    display_name: "Admiralty Way, Lekki Phase 1, Lagos",
    context_label: "Lekki, Eti-Osa, Lagos State, Nigeria",
    lat: "6.4478",
    lon: "3.4723",
  },
  {
    place_id: "osm.ikeja",
    short_name: "Ikeja GRA, Lagos",
    display_name: "Isaac John Street, Ikeja GRA, Lagos",
    context_label: "Ikeja, Lagos State, Nigeria",
    lat: "6.5818",
    lon: "3.3568",
  },
  {
    place_id: "osm.vi",
    short_name: "Victoria Island, Lagos",
    display_name: "Ahmadu Bello Way, Victoria Island, Lagos",
    context_label: "Victoria Island, Lagos State, Nigeria",
    lat: "6.4281",
    lon: "3.4219",
  },
  {
    place_id: "osm.jabi",
    short_name: "Jabi Lake Area, Abuja",
    display_name: "Bala Sokoto Way, Jabi, Abuja, FCT",
    context_label: "Jabi, Abuja, Federal Capital Territory, Nigeria",
    lat: "9.0668",
    lon: "7.4215",
  },
  {
    place_id: "osm.garki",
    short_name: "Area 11, Garki, Abuja",
    display_name: "Area 11, Garki, Abuja, FCT, Nigeria",
    context_label: "Garki, Abuja, Federal Capital Territory, Nigeria",
    lat: "9.0385",
    lon: "7.4892",
  },
  {
    place_id: "osm.utako",
    short_name: "Utako District, Abuja",
    display_name: "Obafemi Awolowo Way, Utako, Abuja, FCT",
    context_label: "Utako, Abuja, Federal Capital Territory, Nigeria",
    lat: "9.0694",
    lon: "7.4419",
  },
  {
    place_id: "osm.yaba",
    short_name: "Herbert Macaulay Way, Yaba",
    display_name: "Herbert Macaulay Way, Yaba, Lagos",
    context_label: "Yaba, Lagos Mainland, Lagos State, Nigeria",
    lat: "6.5095",
    lon: "3.3711",
  },
  {
    place_id: "osm.ph",
    short_name: "GRA Phase 2, Port Harcourt",
    display_name: "Sani Abacha Road, GRA Phase 2, Port Harcourt",
    context_label: "Port Harcourt, Rivers State, Nigeria",
    lat: "4.8242",
    lon: "6.9936",
  },
];

