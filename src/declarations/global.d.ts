declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (
            options: {
              client_id: string;
              callback: (response: GoogleCredentialResponse,
                flow: string
              ) => void
            }) => void
          prompt: () => void
        }
      }
      maps: {
        places: {
          Autocomplete: new (
            input: HTMLInputElement | null,
            options: {
              fields?: string[]
              types?: string[]
              language?: string
              componentRestrictions?: AutocompleteComponentRestrictions
            }
          ) => AutocompleteInstance
        }
      }
    }
  }

  interface GoogleCredentialResponse {
    credential: string
  }
}

declare module '*.css';
declare module 'react-datepicker/dist/react-datepicker.css';
declare module './components/DatePicker/datepickerOverrides.css';

export { }
