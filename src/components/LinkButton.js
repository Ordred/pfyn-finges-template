
import { withRouter } from 'react-router-dom';

function LinkButton({ history, to, onClick, ...rest }){

    return (
        <button
            {...rest}
            onClick={(e) => { onClick && onClick(e); history.push(to) }}
        />
    )
}

export default withRouter(LinkButton);