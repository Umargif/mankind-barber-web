export interface ServiceItem {
  id: string;
  name: string;
  price: string;
  duration: string;
  description: string;
}

export interface Barber {
  id: string;
  name: string;
  specialty: string;
  image: string;
}

export interface StyleRecommendation {
  styleName: string;
  description: string;
  suitability: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
