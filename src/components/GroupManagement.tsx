'use client'
import { useState, useEffect } from 'react';
import { WebSocketMessage, Member } from '../../services/types';

interface GroupManagementProps {
  ws: WebSocket | null;
}

export default function GroupManagement({ ws }: GroupManagementProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (ws) {
      ws.onmessage = (event: MessageEvent) => {
        const data: WebSocketMessage = JSON.parse(event.data);
        if (data.type === 'welcome') {
          setMembers(prev => [...prev, { userId: data.message!.split(' ')[1], isAdmin: !!data.isAdmin }]);
          setIsAdmin(!!data.isAdmin);
        } else if (['admin_promoted', 'user_kicked', 'user_banned'].includes(data.type)) {
          setMembers(prev => prev.map(m => 
            m.userId === data.userId 
              ? { ...m, isAdmin: data.type === 'admin_promoted' }
              : m
          ).filter(m => !['user_kicked', 'user_banned'].includes(data.type) || m.userId !== data.userId));
        }
      };
    }
  }, [ws]);

  const handleAction = (type: string, userId: string) => {
    if (ws && isAdmin) {
      ws.send(JSON.stringify({ type, targetUserId: userId }));
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Group Management</h2>
      {members.map(member => (
        <div key={member.userId} className="flex justify-between items-center mb-2 p-2 bg-gray-100 rounded-md">
          <span>{member.userId} {member.isAdmin ? '(Admin)' : ''}</span>
          {isAdmin && !member.isAdmin && (
            <div>
              <button
                onClick={() => handleAction('promote_admin', member.userId)}
                className="mr-2 px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              >
                Promote
              </button>
              <button
                onClick={() => handleAction('kick', member.userId)}
                className="mr-2 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Kick
              </button>
              <button
                onClick={() => handleAction('ban', member.userId)}
                className="px-2 py-1 bg-red-700 text-white rounded-md hover:bg-red-800"
              >
                Ban
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}