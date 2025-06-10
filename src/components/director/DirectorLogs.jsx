import React, {useEffect, useState} from 'react';
import { db } from '../../firebase/config';
import { collection, getDoc, getDocs, doc } from 'firebase/firestore';

import './DirectorLogs.css';

const DirectorLogs = () => {
  const [credits, setCredits] = useState([]);
  useEffect(() => {
    const fetchCredits = async () => {
      const creditsSnapshot = await getDocs(collection(db, 'credits'));
      const creditsData = [];

      for (const creditDoc of creditsSnapshot.docs) {
        const credit = creditDoc.data();
        // Fetch related student document
        let studentData = null;
        if (credit.student) {
          const studentRef = doc(db, 'students', credit.student);
          const studentSnap = await getDoc(studentRef);
          if (studentSnap.exists()) {
            studentData = studentSnap.data();
            
          }
        }
        //fetch title of credit
        let creditData = null;
        if(credit.title){
          const creditRef = doc(db, 'menus', credit.title);
          const creditSnap = await getDoc(creditRef);
          if(creditSnap.exists()){
            creditData = creditSnap.data();
          }
        }
        // Fetch related faculty document
        let facultyData = null;
        if (credit.approvedBy) {
          const facultyRef = doc(db, 'faculties', credit.approvedBy);
          const facultySnap = await getDoc(facultyRef);
          if (facultySnap.exists()) {
            facultyData = facultySnap.data();
          }
        }

        creditsData.push({
          id: creditDoc.id,
          ...credit,
          studentName: studentData?.name,
          facultyName: facultyData?.Name,
          title :creditData?.Title
        });
      }

      setCredits(creditsData);
    };

    fetchCredits();
  }, []);


  return (
    <div className="timeline-container">
      {credits.map((item, index) => (
        <div className="timeline-item" key={index}>
          <div className={`timeline-icon ${item.type}`}></div>
          <div className="timeline-content">
            <span className="time">{item.date?.toDate().toLocaleString('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
}).replace(',', ' |')}
</span>
            <h4 className="title">{item.credit} credits Added to {item.studentName} for {item.title}</h4>
            <p className="subtitle">by: {item.facultyName}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DirectorLogs;
