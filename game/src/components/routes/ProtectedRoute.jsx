import { memo } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({session, children}) {
    if(session === undefined){
        return null;
    }
    if(!session){
        return <Navigate to="/auth" replace/>
    }
    return children
}

export default memo(ProtectedRoute)