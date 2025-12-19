import React from 'react';
import { FaLock, FaList, FaThLarge, FaFilter } from 'react-icons/fa';
import Button from '../ui/Button';

const BoardHeader = ({ board, members = [], viewMode = 'kanban', onViewChange }) => {
  return (
    <div className="board-header">
      <div className="board-info">
        <h1 className="board-title-main">{board.name}</h1>
        
        <div className="board-members">
          {members.map((member, index) => (
            <img 
              key={index}
              src={member.avatar}
              alt={member.name}
              className="member-avatar"
              title={member.name}
            />
          ))}
        </div>
      </div>

     
    </div>
  );
};

export default BoardHeader;