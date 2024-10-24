// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import { LatLngExpression, Icon } from 'leaflet';
// import pin from '../../assets/images/fraxionedpng.png';
// import styles from './location.module.css';

// interface PropertyData {
//     id: number;
//     propertyName: string;
//     latitude: number;
//     longitude: number;
//     address: string;
//     city: string;
//     state: string;
//     country: string;
//     zipcode: string;
// }

// const PropertyLocation: React.FC = () => {
//     const { id } = useParams<{ id: string }>();
//     const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchPropertyData = async () => {
//             try {
//                 const response = await getPropertyById(Number(id));
//                 setPropertyData(response.data);
//                 setLoading(false);
//             } catch (err) {
//                 console.error('Error fetching property details:', err);
//                 setError('Failed to fetch property details. Please try again.');
//                 setLoading(false);
//             }
//         };
//         fetchPropertyData();
//     }, [id]);

//     if (loading) return <div className={styles.loading}>Loading...</div>;
//     if (error) return <div className={styles.error}>{error}</div>;
//     if (!propertyData) return <div className={styles.noData}>No property data found.</div>;

//     const position: LatLngExpression = [propertyData.latitude, propertyData.longitude];

//     const customIcon = new Icon({
//         iconUrl: pin,
//         iconSize: [32, 32],
//         iconAnchor: [16, 32],
//         popupAnchor: [0, -32]
//     });

//     return (
//         <div className={styles.container}>
//             <h2 className={styles.title}>Property Location</h2>
//             <div className={styles.mapContainer}>
//                 <MapContainer
//                     center={position}
//                     zoom={3}
//                     scrollWheelZoom={true}
//                     className={styles.map}
//                     style={{ height: '400px', width: '100%' }}
//                 >
//                     <TileLayer
//                         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                     />
//                     <Marker position={position} icon={customIcon}>
//                         <Popup>
//                             <strong>{propertyData.propertyName}</strong><br />
//                             {propertyData.address}<br />
//                             {propertyData.city}, {propertyData.state} {propertyData.zipcode}<br />
//                             {propertyData.country}
//                         </Popup>
//                     </Marker>
//                 </MapContainer>
//             </div>
//         </div>
//     );
// };

// export default PropertyLocation;