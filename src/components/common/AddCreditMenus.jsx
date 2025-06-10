import React, { useState, useEffect } from 'react';
import './AddCreditMenus.css';
import AcademicPerformanceModal from './AddCredit';
import { db } from '../../firebase/config';
import { collection, getDocs, query, orderBy } from "firebase/firestore";

function AddCreditMenus({ isSidebarOpen }) {
  const [modalData, setModalData] = useState(null);
  const [cards, setCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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

  // Filter cards by searchTerm (case-insensitive)
  const filteredCards = cards.filter(card =>
    card.Title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`credit-menu-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>

      {/* 🔍 Search Bar */}
      <div className="credit-menu-search-bar">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    <div className="credit-menu-card-wrapper">
      {/* Card List */}
      {filteredCards.map((card) => (
        <div key={card.id} className="item" onClick={() => handleOpenModal(card)}>
          <div className="credit-menu-card-container">
            <div className="credit-menu-icon-circle">
              <i className={card.Image}></i>
            </div>
            <p className="credit-menu-card-title">{card.Title}</p>
          </div>
        </div>
      ))}
</div>
      {/* Modal */}
      {modalData && (
        <AcademicPerformanceModal
          isOpen={!!modalData}
          onClose={handleCloseModal}
          creditId={modalData.id}
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

export default AddCreditMenus;
