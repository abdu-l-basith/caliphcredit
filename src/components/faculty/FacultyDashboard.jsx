import React, { useState, useEffect } from 'react';
import './FacultyDashboard.css';
import AcademicPerformanceModal from './AcademicPerformanceForm';
import {db} from '../../firebase/config';
import {collection, getDocs, query, orderBy } from "firebase/firestore";


function FacultyDashboard({ isSidebarOpen }) {
  const [modalData, setModalData] = useState(null);
  const [cards,setCards] = useState([]);
  const Firebase = db;

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const q = query(collection(Firebase, "menus"), orderBy("Title"));
        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCards(docs);
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };

    fetchCards();
  }, []);

  const handleOpenModal = (data) => {
    setModalData(data);
  };
  const handleCloseModal = () => setModalData(null);
  return (
    
    <div className={`container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {cards.map((card)=>{
        return(
          <div key={card.id} className="item" onClick={() => handleOpenModal(card)}>
        <div className="card-container">
          <div className="icon-circle">
            <i className={card.Image}></i>
          </div>
          <p className="card-title">{card.Title}</p>
        </div>
      </div>
        )
        
      })}

      {/* Modal must be inside the return and below useState */}
      {modalData && (
  <AcademicPerformanceModal
  isOpen={!!modalData}
  onClose={handleCloseModal}
  title={modalData.Title}
  description={modalData.Description}
  credit={
    modalData.Credit !== undefined
      ? { type: 'credit', value: modalData.Credit }
      : modalData.MaxCredit !== undefined
      ? { type: 'max', value: modalData.MaxCredit }
      : modalData.Credits !== undefined
      ? { type: 'categories', value: modalData.Credits }
      : { type: 'none', value: null }
  }
/>

)}

    </div>
  );
}

export default FacultyDashboard;
