export * from './auth'
export * from './user'

export interface ForgotPasswordState {
    loading: boolean
    successMessage: string | null
    errorMessage: string | null
  }

export interface RegisterState {
    token: string | null
    userId: string | null
    email: string | null
    registering: boolean
    error: string | null
    resettingPassword: boolean
    resetPasswordSuccess: boolean
    resetPasswordError: string | null
  }
  export interface AddPropertyState {
    loading: boolean
    successMessage: string | null
    errorMessage: string | null
    property: Property | null
  }
  
  export interface Property {
    id: number;
    createdBy: { id: number }
    propertyName: string
    ownerRezPropId: number
    address: string
    city: string
    state: string
    country: string
    zipcode: number
    houseDescription: string
    isExclusive: boolean
    propertyShare: number
    latitude: number
    longitude: number
    isActive: boolean
    displayOrder: number
  }
  export interface UpdateProperty {
    id: number;
    updatedBy: { id: number }
    propertyName: string
    ownerRezPropId: number
    address: string
    city: string
    state: string
    country: string
    zipcode: number
    houseDescription: string
    isExclusive: boolean
    propertyShare: number
    latitude: number
    longitude: number
    isActive: boolean
    displayOrder: number
  }




  