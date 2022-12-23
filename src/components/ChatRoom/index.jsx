import { Link, useParams } from 'react-router-dom';
import { chatRooms } from '../../data/chatRooms';
import { MessageList } from '../MessageList';
import { MessageInput } from '../MessageInput';
import './styles.css';

function ChatRoom() {
    const params = useParams();

    const room = chatRooms.find((x) => x.id === params.id);
    if (!room) {
        // TODO: 404
    }

    return (
        <>
            <h2 className='chat-title'>{room.title}</h2>
            <div>
                <Link to="/"> <i style={{color:"black"}} className="fa fa-hand-o-left" aria-hidden="true"></i> <span style={{color:"black"}}> Back to all rooms</span>&#128536; </Link>
            </div>
            <div className="messages-container">
                <MessageList roomId={room.id} />
                <MessageInput roomId={room.id} />
            </div>
        </>
    );
}

export { ChatRoom };