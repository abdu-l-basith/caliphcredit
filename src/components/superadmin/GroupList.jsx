// StudentsTable.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config'; // adjust the path if needed
import { collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import './GroupList.css';
import AddGroupModal from './AddGroupModel';
import EditGroupName from './EditGroupName';
const GroupList = () => {
  const [groups, setgroups] = useState([]);
const [addGroupModel, setAddGroupModel] = useState(false)
const [selectedGroup, setSelectedGroup] = useState(null)
  // 🔽 Fetch students from Firestore
  const fetchGroups = async () => {
    

    // Then fetch Director
    const groupSnapshot = await getDocs(collection(db, 'groups'));
    const groupList = groupSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
      };
    });

    setgroups(groupList);
  };
  useEffect(() => {
 fetchGroups();
}, []);
const handleEdit = (group)=>{
setSelectedGroup(group)
}
const handleDelete = async (group) => {
  const confirmDelete = window.confirm('Are you sure you want to delete this class?');
  if (!confirmDelete) return;

  try {
    // Create a reference in "trash-director" collection with same ID
    const trashRef = doc(db, 'trash-group', group.id);

    // Copy the data with a deletedAt timestamp
    await setDoc(trashRef, {
      ...group,
      deletedAt: serverTimestamp(),
    });

    // Then delete from "directors"
    await deleteDoc(doc(db, 'groups', group.id));

    alert('Group moved to trash and deleted.');
    fetchGroups(); // Refresh table
  } catch (err) {
    console.error('Failed to delete and archive:', err);
    alert('Error occurred while deleting.');
  }
};
  return (
    <div className="group-list-container">
      

      <div className="group-list-action-row">
        <span onClick={()=>{setAddGroupModel(true)}} className='group-list-action-select'>Add New Group</span>
      </div>

      <table className="group-list-students-table">
        <thead>
          <tr>
            <th>Sl No</th>
            <th>Group</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group, index) => (
            <tr key={index}>
              <td>{index+1}</td>
              <td>{group.Name}</td>
              <td onClick={()=>handleEdit(group)} className='group-list-edit-action'>EDIT</td>
              <td onClick={()=>handleDelete(group)} className='group-list-delete-action'>DELETE</td>
            </tr>
          ))}
        </tbody>
      </table>
{selectedGroup && (
        <EditGroupName
          groupId={selectedGroup.id}
          currentGroupName={selectedGroup.Name}
          onClose={() => setSelectedGroup(null)}
          onUpdate={fetchGroups} // ✅ Function reference, not call
        />
      )}
      {addGroupModel && <AddGroupModal onClose={() => setAddGroupModel(false)} onUpdate={fetchGroups}/>}

    </div>
  );
};

export default GroupList;