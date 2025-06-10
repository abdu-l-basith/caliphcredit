import React, {useState} from 'react';
import AddStudentCreditModal from './AddStudentCreditModal';

function DirectorDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div>
      <h1>director DahBoard</h1>
      <button onClick={handleOpenModal}>Add Credit</button>

      <AddStudentCreditModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  )
}

export default DirectorDashboard