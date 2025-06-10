// AddCreditModal.jsx
import React, { useState } from 'react';
import { db } from '../../firebase/config';
import { collection, setDoc, doc } from 'firebase/firestore';
import './AddCreditModal.css';

const iconList = ['fa-solid fa-star',
  'fa-solid fa-heart',
  'fa-solid fa-bolt',
  'fa-solid fa-school',
  'fa-solid fa-award',
  'fa-solid fa-user-graduate',
  'fa-regular fa-bell',
  'fa-solid fa-building-columns',
  'fa-solid fa-star',
  'fa-solid fa-shield-halved',
  'fa-solid fa-trophy',
  'fa-solid fa-crown',
  'fa-solid fa-medal',
  'fa-solid fa-snowflake',
  'fa-solid fa-clipboard-user',
  'fa-solid fa-certificate',
  'fa-solid fa-stamp',
  'fa-solid fa-layer-group',
  'fa-solid fa-user-group',
  'fa-solid fa-people-group',
  'fa-solid fa-users-viewfinder',
  'fa-solid fa-building-un',
  'fa-solid fa-building-ngo',
  'fa-solid fa-building',
  'fa-solid fa-handshake',
  'fa-solid fa-umbrella-beach',
  'fa-solid fa-list-check',
  'fa-solid fa-bars-progress',
  'fa-solid fa-bars-progress',
  'fa-solid fa-comment',
  'fa-solid fa-microphone'

];
 // example icons

const AddCreditModal = ({ isOpen, onClose, triggerRefresh }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creditType, setCreditType] = useState('single');
  const [creditValue, setCreditValue] = useState(0);
  const [multipleCredits, setMultipleCredits] = useState([{ title: '', credit: 0 }]);
  const [iconModalOpen, setIconModalOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState('');
if (!isOpen) return null;
  const handleAddMultipleCredit = () => {
    setMultipleCredits([...multipleCredits, { title: '', credit: 0 }]);
  };

  const handleMultipleChange = (index, field, value) => {
    const updated = [...multipleCredits];
    updated[index][field] = value;
    setMultipleCredits(updated);
  };

  const handleSubmit = async () => {
    const docRef = doc(collection(db, 'menus'));
    let data = {
      Title: title,
      Description: description,
      Image: selectedIcon
    };

    if (creditType === 'single') data.Credit = Number(creditValue);
    else if (creditType === 'maximum') data.MaxCredit = Number(creditValue);
    else if (creditType === 'multiple') {
      data.Credits = multipleCredits.map(item => ({
        Title: item.title,
        Credit: Number(item.credit)
      }));
    }

    await setDoc(docRef, data);
    triggerRefresh()
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h2>Add New Credit</h2>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="credit-type-section">
          <label><input type="radio" name="creditType" value="single" checked={creditType === 'single'} onChange={() => setCreditType('single')} /> Single</label>
          <label><input type="radio" name="creditType" value="maximum" checked={creditType === 'maximum'} onChange={() => setCreditType('maximum')} /> Maximum</label>
          <label><input type="radio" name="creditType" value="multiple" checked={creditType === 'multiple'} onChange={() => setCreditType('multiple')} /> Multiple</label>
        </div>

        {creditType === 'single' || creditType === 'maximum' ? (
          <input
            type="text"
            placeholder="Credit Value"
            value={creditValue}
            onChange={(e) => setCreditValue(e.target.value)}
          />
        ) : (
          <div>
            {multipleCredits.map((group, index) => (
              <div key={index} className="multi-credit-group">
                <input
                  type="text"
                  placeholder="Title"
                  value={group.title}
                  onChange={(e) => handleMultipleChange(index, 'title', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Credit"
                  value={group.credit}
                  onChange={(e) => handleMultipleChange(index, 'credit', e.target.value)}
                />
              </div>
            ))}
            <button className="add-group-btn" onClick={handleAddMultipleCredit}>+</button>
          </div>
        )}

        <div className="icon-section">
          <button className='icon-select-button' onClick={() => setIconModalOpen(true)}>Select Icon</button>
          {selectedIcon && <i className={selectedIcon}></i>}
        </div>

        {iconModalOpen && (
          <div className="icon-modal">
            {iconList.map((icon, i) => (
              <i
                key={i}
                className={`${icon} icon-selectable`}
                onClick={() => {
                  setSelectedIcon(icon);
                  setIconModalOpen(false);
                }}
              ></i>
            ))}
          </div>
        )}

        <div className="modal-actions">
          <button className='add-credit-modal-submit-button' onClick={handleSubmit}>Submit</button>
          <button className='add-credit-modal-cancel-button' onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddCreditModal;
