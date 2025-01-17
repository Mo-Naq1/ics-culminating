import { Link } from 'react-router-dom';

function Button() {
    
    return (
        <div>
            <Link to="/home">Go to Home</Link>
            <Link to="/score">Go to Score</Link>
        </div>
    );
}

export default Button;


