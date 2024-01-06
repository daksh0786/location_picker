
// import { useState, useEffect } from 'react';

// import Places from './Places.jsx';
// import Error from './Error.jsx';
// import { sortPlacesByDistance } from '../loc.js';
// import { fetchAvailablePlaces } from '../http.js';

// export default function AvailablePlaces({ onSelectPlace }) {
  
//   const [availablePlaces, setAvailablePlaces] = useState([]);
//   const [error, setError] = useState();

//   // useEffect(() => {
//   //   fetch('http://localhost:3000/places')
//   //     .then((response) => {
//   //       return response.json();
//   //       // this json is used to extract data that is
//   //       // stored in json format
//   //       // this also return a promise

//   //     })
//   //     .then((resData) => {
//   //       setAvailablePlaces(resData.places);
//   //     });
//   // }, []);
//   // // as fetch return promise that it will get output and when we get output we
//   // // use the function used by then.

//   useEffect(() => {
//     async function fetchPlaces() {
      

//       try {
//         const places = await fetchAvailablePlaces();
//         // all these function returns promise so we use await and as while describing the function in http.js we used async.
//         // The await keyword is used inside an async function to pause execution until the promise is resolved. It can only be used inside an async function

//         navigator.geolocation.getCurrentPosition((position) => {
//           const sortedPlaces = sortPlacesByDistance(
//             places,
//             position.coords.latitude,
//             position.coords.longitude
//           );
//           setAvailablePlaces(sortedPlaces);
          
//         });
//       } catch (error) {
//         setError({
//           message:
//             error.message || 'Could not fetch places, please try again later.',
//         });
//         setIsFetching(false);
//       }
//     }
//     // should not use async in useeffect itself it should be used in a function that is defined inside it
//     // and await act as a promise
//     // now we have to call the function

//     fetchPlaces();
//   }, []);

//   if (error) {
//     return <Error title="An error occurred!" message={error.message} />;
//   }

//   return (
//     <Places
//       title="Available Places"
//       places={availablePlaces}
//       fallbackText="No places available."
//       onSelectPlace={onSelectPlace}
//     />
//   );
// }
import { useState, useEffect } from 'react';

import Places from './Places.jsx';
import Error from './Error.jsx';
import { sortPlacesByDistance } from '../loc.js';
import { fetchAvailablePlaces } from '../http.js';

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);

      try {
        const places = await fetchAvailablePlaces();

        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          );
          setAvailablePlaces(sortedPlaces);
          setIsFetching(false);
        });
      } catch (error) {
        setError({
          message:
            error.message || 'Could not fetch places, please try again later.',
        });
        setIsFetching(false);
      }
    }

    fetchPlaces();
  }, []);

  if (error) {
    return <Error title="An error occurred!" message={error.message} />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}